import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/core/db";
import {
  challenges,
  classrooms,
  moduleAssignments,
  modules,
  semesters,
  submissions,
  users,
} from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { PixelIcon } from "@/core/components/PixelSprite";
import { SubmissionReviewForm } from "@/core/components/SubmissionReviewForm";
import { WeaveNav } from "@/core/components/WeaveNav";

interface TelemetryView {
  keystrokes?: number;
  pasteChars?: number;
  pasteEvents?: number;
  tabSwitches?: number;
  durationSec?: number;
  hintsUsed?: number;
  runCount?: number;
}

export default async function TeacherStudentDetailPage(props: {
  params: Promise<{ assignmentId: string; studentId: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/");
  if (session.role !== "teacher" && session.role !== "admin") redirect("/dashboard");

  const { assignmentId, studentId } = await props.params;

  const [student] = await db.select().from(users).where(eq(users.id, studentId)).limit(1);
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

  if (!student || !assignmentRow) notFound();

  const rows = await db
    .select({
      sub: submissions,
      challengeTitle: challenges.title,
      challengeOrder: challenges.orderIndex,
    })
    .from(submissions)
    .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
    .where(and(eq(submissions.assignmentId, assignmentId), eq(submissions.studentId, studentId)))
    .orderBy(desc(submissions.submittedAt));

  const passedCount = rows.filter((r) => r.sub.passed).length;
  const flaggedCount = rows.filter((r) => {
    const ev = r.sub.evidence as { reviewReasons?: string[] };
    return (ev.reviewReasons?.length ?? 0) > 0 || r.sub.reviewFlag === "flagged";
  }).length;

  return (
    <div className="min-h-screen bg-paper text-cloth-deep">
      <WeaveNav
        session={session}
        activePath="teacher"
        semesterLabel={assignmentRow.sem.label}
        surface="paper"
      />

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
        <Link href={`/teacher/assignments/${assignmentId}`} className="btn-notch-outline notch text-sm">
          <PixelIcon name="back" size={16} />
          <span>กลับผืนผ้าของห้อง</span>
        </Link>

        <header className="notch-lg border-2 border-cloth-deep bg-paper p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-ink-2">
                {assignmentRow.room.name} · {assignmentRow.assignment.titleOverride ?? assignmentRow.mod.title}
              </div>
              <h1 className="mt-1 text-2xl font-bold text-cloth-deep">{student.fullName}</h1>
              <p className="mt-0.5 text-sm text-ink-2">{student.email}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <span className="border-2 border-cloth-deep bg-cloth px-3 py-1.5">
                ส่งทั้งหมด {rows.length} ครั้ง
              </span>
              <span className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white">
                ผ่าน {passedCount} ครั้ง
              </span>
              {flaggedCount > 0 && (
                <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-900">
                  ควรถามปากเปล่า {flaggedCount} รายการ
                </span>
              )}
            </div>
          </div>
        </header>

        {rows.length === 0 ? (
          <div className="ed-card p-8 text-center text-base text-[#5C7299]">
            นักเรียนคนนี้ยังไม่ได้ส่งคำตอบในชุดภารกิจนี้
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map(({ sub, challengeTitle, challengeOrder }) => {
              const evidence = sub.evidence as {
                answer?: unknown;
                code?: string;
                telemetry?: TelemetryView;
                reviewReasons?: string[];
                microCheck?: { question?: string; selectedOption?: string };
              };
              const telemetry = evidence.telemetry ?? {};
              const reasons = evidence.reviewReasons ?? [];

              return (
                <article key={sub.id} className="ed-card p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="rounded-lg bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-bold text-[#1364E7]">
                          ด่าน {challengeOrder} · ครั้งที่ {sub.attemptNo}
                        </span>
                        <h2 className="font-display text-lg font-bold text-[#092551]">{challengeTitle}</h2>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            sub.passed
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {sub.passed ? `ผ่านแล้ว ${sub.stars} ดาว` : "ยังไม่ผ่าน"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#5C7299]">
                        ส่งเมื่อ {new Date(sub.submittedAt).toLocaleString("th-TH")}
                      </p>
                    </div>

                    <div className="font-display text-base font-bold text-[#092551]">
                      {Number(sub.score).toFixed(0)} / {Number(sub.maxScore).toFixed(0)} คะแนน
                    </div>
                  </div>

                  {/* สถิติการทำงานระหว่างทำโจทย์ */}
                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-[#E1EAFB] bg-[#F8FAFF] p-3.5 text-xs text-[#092551] sm:grid-cols-4">
                    <div>
                      เวลาที่ใช้: <strong>{telemetry.durationSec ?? 0} วินาที</strong>
                    </div>
                    <div>
                      จัดเรียง/พิมพ์: <strong>{telemetry.keystrokes ?? 0} ครั้ง</strong>
                    </div>
                    <div>
                      Paste: <strong>{telemetry.pasteChars ?? 0} ตัว</strong> ({telemetry.pasteEvents ?? 0} ครั้ง)
                    </div>
                    <div>
                      สลับแท็บ: <strong>{telemetry.tabSwitches ?? 0} ครั้ง</strong>
                    </div>
                  </div>

                  {reasons.length > 0 && (
                    <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                      <div>
                        <strong>ควรถามปากเปล่า:</strong> {reasons.join(" · ")}
                      </div>
                    </div>
                  )}

                  {evidence.microCheck?.question && (
                    <div className="mt-3 rounded-2xl border border-[#E1EAFB] bg-[#F8FAFF] p-3 text-sm text-[#092551]">
                      <div>
                        <strong>คำถามยืนยันความเข้าใจ:</strong> {evidence.microCheck.question}
                      </div>
                      <div>
                        <strong>คำตอบที่เลือก:</strong> {evidence.microCheck.selectedOption || "ยังไม่ได้ตอบ"}
                      </div>
                    </div>
                  )}

                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer font-semibold text-[#1364E7] hover:underline">
                      เปิดดูคำตอบที่ส่ง
                    </summary>
                    <pre className="mt-2 overflow-x-auto rounded-2xl bg-[#081A37] p-4 font-code text-xs text-[#E4EDFF]">
                      {JSON.stringify(evidence.code ?? evidence.answer ?? evidence, null, 2)}
                    </pre>
                  </details>

                  <SubmissionReviewForm
                    submissionId={sub.id}
                    initialFlag={sub.reviewFlag}
                    initialNote={sub.teacherNote ?? ""}
                  />
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
