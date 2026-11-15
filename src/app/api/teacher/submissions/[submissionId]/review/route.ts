import { NextRequest, NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/core/db";
import { auditLogs, studentChallengeProgress, submissions, type ReviewFlag } from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";

const ALLOWED_FLAGS = new Set<ReviewFlag>(["none", "needs_review", "verified", "flagged"]);

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ submissionId: string }> }
) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "teacher" && session.role !== "admin")) {
    return NextResponse.json({ error: "เฉพาะครูผู้สอนหรือแอดมินเท่านั้น" }, { status: 403 });
  }

  const { submissionId } = await context.params;
  const body = (await req.json().catch(() => null)) as {
    reviewFlag?: ReviewFlag;
    teacherNote?: string;
  } | null;

  if (!body?.reviewFlag || !ALLOWED_FLAGS.has(body.reviewFlag)) {
    return NextResponse.json({ error: "สถานะการตรวจสอบไม่ถูกต้อง" }, { status: 400 });
  }

  const updated = await db.transaction(async (tx) => {
    const [sub] = await tx
      .update(submissions)
      .set({
        reviewFlag: body.reviewFlag,
        teacherNote: typeof body.teacherNote === "string" ? body.teacherNote.trim() : undefined,
      })
      .where(eq(submissions.id, submissionId))
      .returning();

    if (!sub) return null;

    // ตรวจว่ายังมี submission อื่นของนักเรียนคนนี้ในด่านนี้ที่ยัง needs_review / flagged อยู่หรือไม่
    const remainingFlagged = await tx
      .select({ id: submissions.id })
      .from(submissions)
      .where(
        and(
          eq(submissions.assignmentId, sub.assignmentId),
          eq(submissions.challengeId, sub.challengeId),
          eq(submissions.studentId, sub.studentId),
          inArray(submissions.reviewFlag, ["needs_review", "flagged"])
        )
      )
      .limit(1);

    await tx
      .update(studentChallengeProgress)
      .set({
        hasReviewFlag: remainingFlagged.length > 0,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(studentChallengeProgress.assignmentId, sub.assignmentId),
          eq(studentChallengeProgress.challengeId, sub.challengeId),
          eq(studentChallengeProgress.studentId, sub.studentId)
        )
      );

    await tx.insert(auditLogs).values({
      actorId: session.userId,
      action: "submission.review",
      targetType: "submission",
      targetId: submissionId,
      payload: {
        reviewFlag: body.reviewFlag,
        teacherNote: body.teacherNote ?? null,
      },
    });

    return sub;
  });

  if (!updated) {
    return NextResponse.json({ error: "ไม่พบข้อมูลการส่งงาน" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, submission: updated });
}

