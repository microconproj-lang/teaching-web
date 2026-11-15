import Link from "next/link";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { Award, BookOpen, Code2, Compass, GraduationCap, Map as MapIcon, Sparkles, Terminal } from "lucide-react";
import { db, isDatabaseReachable } from "@/core/db";
import {
  challenges,
  classrooms,
  enrollments,
  moduleAssignments,
  modules,
  semesters,
  studentChallengeProgress,
  users,
  xpLedger,
} from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { DEFAULT_AVATAR_KEY } from "@/core/avatars";
import { getPlayerLevelInfo } from "@/core/grading/level";
import { ServerAppShell } from "@/core/components/ServerAppShell";
import { AvatarPicker } from "@/core/components/AvatarPicker";
import { DashboardXpSyncBox } from "@/core/components/DashboardXpSyncBox";
import {
  StudentWeaveMap,
  type LiveModuleAssignmentView,
} from "@/core/components/StudentWeaveMap";
import {
  TeacherDashboardClient,
  type TeacherAssignmentCardItem,
} from "@/core/components/TeacherDashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  let semesterLabel: string | null = null;
  let semesterId: string | null = null;
  let totalXp = 0;
  let avatarKey = DEFAULT_AVATAR_KEY;
  let frameKey = "none";
  let displayName = session?.fullName ?? "ผู้เรียนทดลอง";
  let classroomName: string | null = null;
  let studentNumber: number | null = null;
  let studentAssignments: LiveModuleAssignmentView[] = [];
  let teacherAssignments: TeacherAssignmentCardItem[] = [];

  try {
    if (session && (await isDatabaseReachable())) {
      const [semRow] = await db
        .select({
          id: semesters.id,
          label: semesters.label,
        })
        .from(semesters)
        .where(eq(semesters.isCurrent, true))
        .limit(1);

      semesterId = semRow?.id ?? null;
      semesterLabel = semRow?.label ?? null;

      const [userRow] = await db
        .select({
          avatarKey: users.avatarKey,
          displayName: users.displayName,
          fullName: users.fullName,
          equippedFrameKey: users.equippedFrameKey,
        })
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1);

      if (userRow) {
        avatarKey = userRow.avatarKey ?? DEFAULT_AVATAR_KEY;
        displayName = userRow.displayName?.trim() || userRow.fullName;
        frameKey = userRow.equippedFrameKey ?? "none";
      }

      if (session.role === "student") {
        if (semesterId) {
          const [xpRow] = await db
            .select({ total: sql<number>`COALESCE(SUM(${xpLedger.xpAmount}), 0)::int` })
            .from(xpLedger)
            .where(and(eq(xpLedger.studentId, session.userId), eq(xpLedger.semesterId, semesterId)));
          totalXp = xpRow?.total ?? 0;
        }

        const [enrollmentRow] = await db
          .select({
            classroomId: classrooms.id,
            classroomName: classrooms.name,
            studentNumber: enrollments.studentNumber,
          })
          .from(enrollments)
          .innerJoin(classrooms, eq(enrollments.classroomId, classrooms.id))
          .where(and(eq(enrollments.studentId, session.userId), eq(enrollments.status, "active")))
          .orderBy(desc(enrollments.enrolledAt))
          .limit(1);

        if (enrollmentRow) {
          classroomName = enrollmentRow.classroomName;
          studentNumber = enrollmentRow.studentNumber;

          if (semesterId) {
            const assignRows = await db
              .select({
                assignmentId: moduleAssignments.id,
                titleOverride: moduleAssignments.titleOverride,
                dueAt: moduleAssignments.dueAt,
                moduleId: modules.id,
                moduleKey: modules.moduleKey,
                moduleTitle: modules.title,
              })
              .from(moduleAssignments)
              .innerJoin(modules, eq(moduleAssignments.moduleId, modules.id))
              .where(
                and(
                  eq(moduleAssignments.semesterId, semesterId),
                  eq(moduleAssignments.classroomId, enrollmentRow.classroomId),
                  eq(moduleAssignments.isPublished, true)
                )
              )
              .orderBy(asc(moduleAssignments.createdAt));

            if (assignRows.length > 0) {
              const moduleIds = assignRows.map((a) => a.moduleId);
              const assignmentIds = assignRows.map((a) => a.assignmentId);

              const [chRows, progRows] = await Promise.all([
                db
                  .select({
                    id: challenges.id,
                    moduleId: challenges.moduleId,
                    challengeKey: challenges.challengeKey,
                    title: challenges.title,
                    orderIndex: challenges.orderIndex,
                  })
                  .from(challenges)
                  .where(and(inArray(challenges.moduleId, moduleIds), eq(challenges.isPublished, true)))
                  .orderBy(asc(challenges.orderIndex)),
                db
                  .select({
                    assignmentId: studentChallengeProgress.assignmentId,
                    challengeId: studentChallengeProgress.challengeId,
                    passed: studentChallengeProgress.passed,
                    bestStars: studentChallengeProgress.bestStars,
                  })
                  .from(studentChallengeProgress)
                  .where(
                    and(
                      eq(studentChallengeProgress.studentId, session.userId),
                      inArray(studentChallengeProgress.assignmentId, assignmentIds)
                    )
                  ),
              ]);

              const progMap = new Map<string, { passed: boolean; bestStars: number }>();
              for (const p of progRows) {
                progMap.set(`${p.assignmentId}:${p.challengeId}`, {
                  passed: p.passed,
                  bestStars: p.bestStars,
                });
              }

              studentAssignments = assignRows.map((a) => {
                const modChallenges = chRows
                  .filter((c) => c.moduleId === a.moduleId)
                  .map((c) => {
                    const pr = progMap.get(`${a.assignmentId}:${c.id}`);
                    return {
                      id: c.id,
                      challengeKey: c.challengeKey,
                      title: c.title,
                      orderIndex: c.orderIndex,
                      passed: Boolean(pr?.passed),
                      bestStars: Math.min(3, Math.max(0, pr?.bestStars ?? 0)) as 0 | 1 | 2 | 3,
                    };
                  });

                return {
                  assignmentId: a.assignmentId,
                  moduleKey: a.moduleKey,
                  title: a.titleOverride ?? a.moduleTitle,
                  dueAt: a.dueAt ? a.dueAt.toISOString() : null,
                  challenges: modChallenges,
                };
              });
            }
          }
        }
      } else {
        const rows = await db
          .select({
            id: moduleAssignments.id,
            titleOverride: moduleAssignments.titleOverride,
            dueAt: moduleAssignments.dueAt,
            isPublished: moduleAssignments.isPublished,
            moduleTitle: modules.title,
            roomName: classrooms.name,
          })
          .from(moduleAssignments)
          .innerJoin(modules, eq(moduleAssignments.moduleId, modules.id))
          .innerJoin(classrooms, eq(moduleAssignments.classroomId, classrooms.id))
          .where(semesterId ? eq(moduleAssignments.semesterId, semesterId) : undefined)
          .orderBy(asc(classrooms.gradeLevel), asc(classrooms.roomNo));

        teacherAssignments = rows.map((r) => ({
          id: r.id,
          title: r.titleOverride ?? r.moduleTitle,
          roomName: r.roomName,
          dueAtIso: r.dueAt ? r.dueAt.toISOString() : null,
          isPublished: r.isPublished,
        }));
      }
    }
  } catch {
    // Graceful offline preview fallback
  }

  const levelInfo = getPlayerLevelInfo(totalXp);
  const nextAssignment = studentAssignments[0];
  const nextStage = nextAssignment?.challenges.find((c) => !c.passed) ?? nextAssignment?.challenges[0];
  const resumeHref = nextAssignment
    ? `/learn/${nextAssignment.assignmentId}${nextStage ? `?stage=${encodeURIComponent(nextStage.id)}` : ""}`
    : "/learn/demo";

  const isTeacherOrAdmin = session?.role === "teacher" || session?.role === "admin";

  return (
    <ServerAppShell activePath="dashboard">
      <div className="space-y-6">
        {!isTeacherOrAdmin ? (
          <>
            {/* Student & Guest Learning Dashboard Banner */}
            <section className="ed-hero p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="flex flex-wrap items-center gap-4">
                  <AvatarPicker
                    currentKey={avatarKey}
                    currentDisplayName={displayName}
                    frameKey={frameKey}
                    readOnlyGuest={!session}
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-bold ${levelInfo.rankBadgeClass}`}>
                        <Sparkles className="h-3.5 w-3.5" />
                        LV.{levelInfo.level} · {levelInfo.rankTitle}
                      </span>
                      {semesterLabel && (
                        <span className="rounded-full bg-white/85 px-3 py-0.5 text-xs font-semibold text-[#5C7299]">
                          {semesterLabel}
                        </span>
                      )}
                    </div>

                    <h1 className="font-display text-2xl font-bold text-[#092551] sm:text-3xl">
                      {displayName}
                    </h1>
                    <p className="text-sm text-[#5C7299]">
                      {classroomName
                        ? `${classroomName} · เลขที่ ${studentNumber ?? "-"} · สะสมแล้ว ${totalXp} XP`
                        : session
                          ? `${session.email} · พร้อมลุยภารกิจการเขียนโปรแกรม`
                          : "โหมดทดลองเรียน (Guest Preview) · เข้าสู่ระบบด้วยอีเมล @pccpl.ac.th เพื่อบันทึกคะแนนลงห้องเรียน"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href={resumeHref} className="ed-btn-primary">
                    <Code2 className="h-4 w-4" />
                    <span>{studentAssignments.length > 0 ? "ทำภารกิจห้องเรียนต่อ" : "ลองด่าน Algo Quest"}</span>
                  </Link>
                  <Link href="/courses" className="ed-btn-secondary">
                    <BookOpen className="h-4 w-4 text-[#1364E7]" />
                    <span>ดูหลักสูตร ม.1–ม.3</span>
                  </Link>
                </div>
              </div>

              {/* Quick Progress Bar + Shortcut Cards */}
              <div className="mt-6 grid gap-4 lg:grid-cols-12">
                <DashboardXpSyncBox serverXp={totalXp} isAuthenticated={Boolean(session)} />

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-7">
                  <Link
                    href="/lessons"
                    className="ed-card ed-card-hover flex flex-col justify-between p-3.5"
                  >
                    <BookOpen className="h-5 w-5 text-[#1364E7]" />
                    <div className="mt-2">
                      <div className="text-sm font-bold text-[#092551]">Interactive Slides</div>
                      <div className="text-[11px] text-[#5C7299]">6 บทเรียนมีชีวิต</div>
                    </div>
                  </Link>
                  <Link
                    href="/lab"
                    className="ed-card ed-card-hover flex flex-col justify-between p-3.5"
                  >
                    <Terminal className="h-5 w-5 text-emerald-600" />
                    <div className="mt-2">
                      <div className="text-sm font-bold text-[#092551]">Coding Lab</div>
                      <div className="text-[11px] text-[#5C7299]">เขียนโค้ด & ตรวจอัตโนมัติ</div>
                    </div>
                  </Link>
                  <Link
                    href="/adventure"
                    className="ed-card ed-card-hover flex flex-col justify-between p-3.5"
                  >
                    <Compass className="h-5 w-5 text-amber-600" />
                    <div className="mt-2">
                      <div className="text-sm font-bold text-[#092551]">Adventure Map</div>
                      <div className="text-[11px] text-[#5C7299]">เกาะสมบัติและบอส</div>
                    </div>
                  </Link>
                  <Link
                    href="/progress"
                    className="ed-card ed-card-hover flex flex-col justify-between p-3.5"
                  >
                    <Award className="h-5 w-5 text-violet-600" />
                    <div className="mt-2">
                      <div className="text-sm font-bold text-[#092551]">ความก้าวหน้า</div>
                      <div className="text-[11px] text-[#5C7299]">Mastery % & ตรา Rank</div>
                    </div>
                  </Link>
                </div>
              </div>
            </section>

            {/* Classroom Assignment Map */}
            <section className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#092551]">
                    ภารกิจประจำวิชาและเส้นทางการเรียนรู้ (Worlds)
                  </h2>
                  <p className="text-sm text-[#5C7299]">
                    ผ่านด่านตามลำดับเพื่อปลดล็อกภารกิจถัดไป หรือสลับไปหน้า{" "}
                    <Link href="/adventure" className="font-semibold text-[#1364E7] hover:underline">
                      Adventure Map
                    </Link>{" "}
                    เพื่อเก็บ Coins และฝึก Python เพิ่มเติม
                  </p>
                </div>
                <Link href="/portfolio" className="ed-btn-secondary text-xs">
                  <MapIcon className="h-4 w-4 text-[#1364E7]" />
                  <span>ดูคลังผลงานและประวัติส่งงาน</span>
                </Link>
              </div>

              <StudentWeaveMap assignments={studentAssignments} />
            </section>
          </>
        ) : (
          <>
            {/* Teacher / Admin Header */}
            <section className="ed-hero p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="squircle-blue flex h-14 w-14 shrink-0 items-center justify-center text-white shadow-md">
                    <GraduationCap className="h-7 w-7" />
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-white/90 px-3 py-0.5 text-xs font-bold text-[#1364E7]">
                      {session?.role === "admin" ? "ผู้ดูแลระบบ" : "ครูผู้สอน"} · {semesterLabel ?? "ภาคเรียนปัจจุบัน"}
                    </span>
                    <h1 className="mt-1 font-display text-2xl font-bold text-[#092551] sm:text-3xl">
                      แดชบอร์ดติดตามผลการเรียนรายระดับชั้น
                    </h1>
                    <p className="mt-0.5 text-sm text-[#5C7299]">
                      เลือกดูงานแยกตามชั้น ม.1 / ม.2 / ม.3 เปิด Heatmap พฤติกรรมการเรียน หรือส่งออกคะแนน CSV
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <TeacherDashboardClient assignments={teacherAssignments} />
          </>
        )}
      </div>
    </ServerAppShell>
  );
}
