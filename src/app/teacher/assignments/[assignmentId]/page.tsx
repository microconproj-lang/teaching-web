import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/core/db";
import {
  challenges,
  classrooms,
  enrollments,
  moduleAssignments,
  modules,
  semesters,
  studentChallengeProgress,
  submissions,
  users,
} from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { findWorldForModule } from "@/core/config/worlds";
import { AssignmentSettingsControls } from "@/core/components/AssignmentSettingsControls";
import { PixelIcon } from "@/core/components/PixelSprite";
import {
  TeacherHeatmapClient,
  type HeatmapAttemptDetail,
  type HeatmapCellProgress,
} from "@/core/components/TeacherHeatmapClient";
import { WeaveNav } from "@/core/components/WeaveNav";

interface TelemetryShape {
  durationSec?: number;
  keystrokes?: number;
  pasteChars?: number;
  pasteEvents?: number;
  tabSwitches?: number;
}

export default async function TeacherAssignmentHeatmapPage(props: {
  params: Promise<{ assignmentId: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/");
  if (session.role !== "teacher" && session.role !== "admin") redirect("/dashboard");

  const { assignmentId } = await props.params;

  const [assignmentRow] = await db
    .select({
      assignment: moduleAssignments,
      mod: modules,
      room: classrooms,
      sem: semesters,
    })
    .from(moduleAssignments)
    .innerJoin(modules, eq(moduleAssignments.moduleId, modules.id))
    .innerJoin(classrooms, eq(moduleAssignments.classroomId, classrooms.id))
    .innerJoin(semesters, eq(moduleAssignments.semesterId, semesters.id))
    .where(eq(moduleAssignments.id, assignmentId))
    .limit(1);

  if (!assignmentRow) notFound();

  const world = findWorldForModule(assignmentRow.mod.moduleKey);

  const challengeList = await db
    .select()
    .from(challenges)
    .where(eq(challenges.moduleId, assignmentRow.mod.id))
    .orderBy(asc(challenges.orderIndex));

  const roster = await db
    .select({
      studentId: users.id,
      studentNumber: enrollments.studentNumber,
      fullName: users.fullName,
      email: users.email,
    })
    .from(enrollments)
    .innerJoin(users, eq(enrollments.studentId, users.id))
    .where(
      and(
        eq(enrollments.classroomId, assignmentRow.room.id),
        eq(enrollments.status, "active")
      )
    )
    .orderBy(asc(enrollments.studentNumber));

  const progressRows = await db
    .select()
    .from(studentChallengeProgress)
    .where(eq(studentChallengeProgress.assignmentId, assignmentId));

  const progressByKey: Record<string, HeatmapCellProgress> = {};
  for (const row of progressRows) {
    progressByKey[`${row.studentId}:${row.challengeId}`] = {
      bestScore: Number(row.bestScore),
      bestStars: row.bestStars,
      passed: row.passed,
      attemptsCount: row.attemptsCount,
      hasReviewFlag: row.hasReviewFlag,
    };
  }

  const subRows = await db
    .select()
    .from(submissions)
    .where(eq(submissions.assignmentId, assignmentId))
    .orderBy(desc(submissions.attemptNo));

  const attemptsByKey: Record<string, HeatmapAttemptDetail[]> = {};
  for (const sub of subRows) {
    const key = `${sub.studentId}:${sub.challengeId}`;
    const evidence = (sub.evidence ?? {}) as {
      code?: string;
      answer?: unknown;
      telemetry?: TelemetryShape;
      reviewReasons?: string[];
    };
    const t = evidence.telemetry ?? {};
    const detail: HeatmapAttemptDetail = {
      id: sub.id,
      attemptNo: sub.attemptNo,
      score: Number(sub.score),
      maxScore: Number(sub.maxScore),
      stars: sub.stars,
      passed: sub.passed,
      submittedAtIso: sub.submittedAt.toISOString(),
      reviewFlag: sub.reviewFlag,
      teacherNote: sub.teacherNote,
      codeOrAnswer: evidence.code ?? evidence.answer ?? evidence,
      durationSec: t.durationSec ?? 0,
      keystrokes: t.keystrokes ?? 0,
      pasteChars: t.pasteChars ?? 0,
      pasteEvents: t.pasteEvents ?? 0,
      tabSwitches: t.tabSwitches ?? 0,
      reviewReasons: evidence.reviewReasons ?? [],
    };
    if (!attemptsByKey[key]) attemptsByKey[key] = [];
    attemptsByKey[key].push(detail);
  }

  let passedAllCount = 0;
  let stuckStudentsCount = 0;
  for (const student of roster) {
    let passedStages = 0;
    let hasUnpassed = false;
    for (const ch of challengeList) {
      const p = progressByKey[`${student.studentId}:${ch.id}`];
      if (p?.passed) passedStages += 1;
      else if (p && !p.passed) hasUnpassed = true;
    }
    if (challengeList.length > 0 && passedStages === challengeList.length) passedAllCount += 1;
    if (hasUnpassed) stuckStudentsCount += 1;
  }

  const flaggedStudentsCount = new Set(
    progressRows.filter((p) => p.hasReviewFlag).map((p) => p.studentId)
  ).size;

  return (
    <div className="min-h-screen bg-paper text-cloth-deep">
      <WeaveNav
        session={session}
        activePath="teacher"
        semesterLabel={assignmentRow.sem.label}
        surface="paper"
      />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        {/* แถบบน: กลับ + ปุ่มส่งออกคะแนนติดมุมขวาบน */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/dashboard" className="btn-notch-outline notch text-sm">
            <PixelIcon name="back" size={16} />
            <span>กลับห้องเรียนทั้งหมด</span>
          </Link>

          <a
            href={`/api/teacher/export?assignmentId=${assignmentId}`}
            className="btn-notch notch text-sm"
          >
            <PixelIcon name="export" size={16} />
            <span>ส่งออกคะแนน</span>
          </a>
        </div>

        {/* ส่วนหัวเรียบและหนาแน่นบนพื้นขาว ไม่ใช้สีโลก */}
        <section className="notch-lg border-2 border-cloth-deep bg-paper p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="text-sm font-semibold text-ink-2">
                {assignmentRow.room.name} · {assignmentRow.sem.label}
              </div>
              <h1 className="text-2xl font-bold text-cloth-deep">
                ผืนผ้าของห้อง: {assignmentRow.assignment.titleOverride ?? assignmentRow.mod.title}
              </h1>
              <p className="text-sm text-ink-2">
                นักเรียนทั้งหมด {roster.length} คน · ผ่านครบ {passedAllCount} คน · ติดขัด{" "}
                {stuckStudentsCount} คน · ควรถามปากเปล่า {flaggedStudentsCount} คน
              </p>
            </div>

            <AssignmentSettingsControls
              assignmentId={assignmentId}
              initialPublished={assignmentRow.assignment.isPublished}
              initialFocusMode={assignmentRow.assignment.focusMode}
              initialDisablePaste={assignmentRow.assignment.disablePaste}
            />
          </div>
        </section>

        <TeacherHeatmapClient
          assignmentId={assignmentId}
          roster={roster}
          challenges={challengeList.map((ch) => ({
            id: ch.id,
            title: ch.title,
            orderIndex: ch.orderIndex,
            worldShortCode: world.shortCode,
          }))}
          progressByKey={progressByKey}
          attemptsByKey={attemptsByKey}
        />
      </main>
    </div>
  );
}
