import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/core/db";
import {
  challenges,
  enrollments,
  moduleAssignments,
  modules,
  semesters,
  studentChallengeProgress,
  submissions,
  xpLedger,
} from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { generateStudentSeed } from "@/core/grading/anti-cheat";
import { awardBadges } from "@/core/grading/badge-engine";
import { findDemoChallengeGradeTarget } from "@/core/modules/demo-registry";
import { getRegisteredModule } from "@/core/modules/registry";
import { grantUniqueCoins } from "@/core/platform/rewards";
import type { SubmissionEvidence } from "@/core/modules/contract";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ moduleKey: string }> }
) {
  const { moduleKey } = await context.params;
  const modDef = getRegisteredModule(moduleKey);
  if (!modDef) {
    return NextResponse.json({ error: `ไม่พบ Module: ${moduleKey}` }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as {
    assignmentId?: string;
    challengeId?: string;
    evidence?: SubmissionEvidence;
  } | null;

  if (!body?.assignmentId || !body?.challengeId || !body?.evidence?.telemetry) {
    return NextResponse.json({ error: "ข้อมูลการส่งงานไม่ครบถ้วน" }, { status: 400 });
  }

  // โหมด Demo (เปิดให้ผู้เยี่ยมชมและนักเรียนทดลองฝึกด่านตัวอย่างได้โดยไม่ต้อง Login)
  if (body.assignmentId === "demo") {
    const target = await findDemoChallengeGradeTarget(moduleKey, body.challengeId);
    if (!target) {
      return NextResponse.json({ error: "ไม่พบด่านทดสอบ" }, { status: 404 });
    }

    const grade = await modDef.gradeSubmission({
      challengeConfig: target.challengeConfig,
      solutionCheck: target.solutionCheck,
      evidence: body.evidence,
      maxScore: target.maxScore,
      studentSeed: 2569,
    });
    return NextResponse.json({
      ...grade,
      demo: true,
      coinsAwarded: grade.passed ? 10 : 0,
    });
  }

  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนส่งคำตอบ" }, { status: 401 });
  }

  // 1. ตรวจสอบ Assignment + Semester (ห้ามส่งถ้าภาคเรียนถูกล็อกแล้ว)
  const [assignmentRow] = await db
    .select({
      assignment: moduleAssignments,
      semester: semesters,
      mod: modules,
    })
    .from(moduleAssignments)
    .innerJoin(semesters, eq(moduleAssignments.semesterId, semesters.id))
    .innerJoin(modules, eq(moduleAssignments.moduleId, modules.id))
    .where(and(eq(moduleAssignments.id, body.assignmentId), eq(modules.moduleKey, moduleKey)))
    .limit(1);

  if (!assignmentRow) {
    return NextResponse.json({ error: "ไม่พบงานที่มอบหมายในระบบ" }, { status: 404 });
  }

  if (assignmentRow.semester.isLocked) {
    return NextResponse.json({ error: "ภาคเรียนนี้ปิดและล็อกคะแนนแล้ว ไม่สามารถส่งงานเพิ่มได้" }, { status: 403 });
  }

  if (session.role === "student") {
    if (!assignmentRow.assignment.isPublished) {
      return NextResponse.json({ error: "งานนี้ยังไม่เปิดให้ส่ง" }, { status: 403 });
    }

    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, session.userId),
          eq(enrollments.classroomId, assignmentRow.assignment.classroomId),
          eq(enrollments.status, "active")
        )
      )
      .limit(1);

    if (!enrollment) {
      return NextResponse.json({ error: "คุณไม่ได้ลงทะเบียนอยู่ในห้องเรียนของงานนี้" }, { status: 403 });
    }
  }

  // 2. โหลดข้อมูลด่านและเฉลยฝั่ง Server
  const [challenge] = await db
    .select()
    .from(challenges)
    .where(and(eq(challenges.id, body.challengeId), eq(challenges.moduleId, assignmentRow.mod.id)))
    .limit(1);

  if (!challenge) {
    return NextResponse.json({ error: "ไม่พบด่านที่ระบุ" }, { status: 404 });
  }

  const maxScore = Number(challenge.maxScore);
  const studentSeed = generateStudentSeed(
    session.userId,
    challenge.id,
    assignmentRow.semester.id
  );

  // 3. ตรวจคะแนนผ่าน Module Contract
  const grade = await modDef.gradeSubmission({
    challengeConfig: challenge.config,
    solutionCheck: challenge.solutionCheck,
    evidence: body.evidence,
    maxScore,
    studentSeed,
  });

  // 4. บันทึกผลลงฐานข้อมูลแบบ Transaction
  const saved = await db.transaction(async (tx) => {
    const [latest] = await tx
      .select({ attemptNo: submissions.attemptNo })
      .from(submissions)
      .where(
        and(
          eq(submissions.assignmentId, assignmentRow.assignment.id),
          eq(submissions.challengeId, challenge.id),
          eq(submissions.studentId, session.userId)
        )
      )
      .orderBy(desc(submissions.attemptNo))
      .limit(1);

    const nextAttempt = (latest?.attemptNo ?? 0) + 1;

    const [insertedSub] = await tx
      .insert(submissions)
      .values({
        assignmentId: assignmentRow.assignment.id,
        challengeId: challenge.id,
        studentId: session.userId,
        attemptNo: nextAttempt,
        score: grade.score.toFixed(2),
        maxScore: grade.maxScore.toFixed(2),
        stars: grade.stars,
        passed: grade.passed,
        evidence: {
          ...body.evidence,
          reviewReasons: grade.reviewReasons,
        },
        reviewFlag: grade.reviewFlag,
      })
      .returning();

    const [existingProgress] = await tx
      .select()
      .from(studentChallengeProgress)
      .where(
        and(
          eq(studentChallengeProgress.assignmentId, assignmentRow.assignment.id),
          eq(studentChallengeProgress.challengeId, challenge.id),
          eq(studentChallengeProgress.studentId, session.userId)
        )
      )
      .limit(1);

    const previouslyPassed = existingProgress?.passed ?? false;
    const prevBestScore = existingProgress ? Number(existingProgress.bestScore) : -1;
    const isNewBest = grade.score >= prevBestScore;

    if (!existingProgress) {
      await tx.insert(studentChallengeProgress).values({
        assignmentId: assignmentRow.assignment.id,
        challengeId: challenge.id,
        studentId: session.userId,
        bestScore: grade.score.toFixed(2),
        bestStars: grade.stars,
        passed: grade.passed,
        attemptsCount: 1,
        hasReviewFlag: grade.reviewFlag !== "none",
        bestSubmissionId: insertedSub.id,
        firstPassedAt: grade.passed ? new Date() : null,
      });
    } else {
      await tx
        .update(studentChallengeProgress)
        .set({
          bestScore: isNewBest ? grade.score.toFixed(2) : existingProgress.bestScore,
          bestStars: Math.max(existingProgress.bestStars, grade.stars),
          passed: previouslyPassed || grade.passed,
          attemptsCount: existingProgress.attemptsCount + 1,
          hasReviewFlag: existingProgress.hasReviewFlag || grade.reviewFlag !== "none",
          bestSubmissionId: isNewBest ? insertedSub.id : existingProgress.bestSubmissionId,
          firstPassedAt:
            existingProgress.firstPassedAt ?? (grade.passed ? new Date() : null),
          updatedAt: new Date(),
        })
        .where(eq(studentChallengeProgress.id, existingProgress.id));
    }

    // แจก XP และ Coins ครั้งแรกที่ผ่านด่าน (+เพิ่มความสนิทสัตว์เลี้ยง)
    let xpAwarded = 0;
    let coinsAwarded = 0;
    if (grade.passed && !previouslyPassed && challenge.xpReward > 0) {
      xpAwarded = challenge.xpReward;
      await tx.insert(xpLedger).values({
        studentId: session.userId,
        semesterId: assignmentRow.semester.id,
        sourceType: "challenge_clear",
        sourceId: challenge.id,
        xpAmount: xpAwarded,
        description: `ผ่านด่าน ${challenge.title}`,
      });

      const coinRes = await grantUniqueCoins(tx, {
        studentId: session.userId,
        sourceType: "challenge_clear",
        refKey: `module-ch:${assignmentRow.assignment.id}:${challenge.id}`,
        amount: grade.stars === 3 ? 15 : 10,
        description: `ผ่านภารกิจ: ${challenge.title}`,
        boostCloseness: 8,
      });
      coinsAwarded = coinRes.grantedCoins;
    }

    return { attemptNo: nextAttempt, xpAwarded, coinsAwarded, passedNow: grade.passed };
  });

  // มอบ Badge (แยก Transaction เพื่อไม่ให้ความผิดพลาดของ Badge กระทบการบันทึกคะแนน)
  let newBadges: { key: string; code: string; title: string; iconKey: string; xpBonus: number }[] = [];
  if (session.role === "student") {
    try {
      const awarded = await db.transaction((tx) =>
        awardBadges(tx, {
          studentId: session.userId,
          semesterId: assignmentRow.semester.id,
          assignmentId: assignmentRow.assignment.id,
          moduleId: assignmentRow.mod.id,
          passed: grade.passed,
          stars: grade.stars,
          hintsUsed: Number(body.evidence?.telemetry?.hintsUsed ?? 0),
          attemptNo: saved.attemptNo,
        })
      );
      newBadges = awarded.map((b) => ({
        key: b.key,
        code: b.code,
        title: b.title,
        iconKey: b.iconKey,
        xpBonus: b.xpBonus,
      }));
    } catch (err) {
      console.error("Badge awarding failed:", err);
    }
  }

  return NextResponse.json({
    ...grade,
    attemptNo: saved.attemptNo,
    xpAwarded: saved.xpAwarded,
    coinsAwarded: saved.coinsAwarded,
    newBadges,
  });
}
