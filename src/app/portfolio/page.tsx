import Link from "next/link";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { Award, BookCheck, Lock, Play, Sparkles, TrendingUp } from "lucide-react";
import { db, isDatabaseReachable } from "@/core/db";
import {
  academicYears,
  badges,
  challenges,
  classrooms,
  enrollments,
  moduleAssignments,
  modules,
  semesters,
  studentBadges,
  studentChallengeProgress,
  submissions,
  users,
  xpLedger,
} from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { DEFAULT_AVATAR_KEY } from "@/core/avatars";
import { BADGE_DEFINITIONS } from "@/core/grading/badges";
import { getPlayerLevelInfo } from "@/core/grading/level";
import { ServerAppShell } from "@/core/components/ServerAppShell";
import { AvatarPicker } from "@/core/components/AvatarPicker";
import {
  PortfolioStitchGrid,
  type PortfolioAttemptItem,
  type PortfolioTileItem,
} from "@/core/components/PortfolioStitchGrid";

export const dynamic = "force-dynamic";

interface SemesterOption {
  id: string;
  label: string;
  yearLabel: string;
  isCurrent: boolean;
  isLocked: boolean;
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ semesterId?: string }>;
}) {
  const session = await getCurrentSession();
  const params = await searchParams;

  let avatarKey = DEFAULT_AVATAR_KEY;
  let frameKey = "none";
  let displayName = session?.fullName ?? "ผู้เรียนทดลอง";
  let allSemesters: SemesterOption[] = [];
  let activeSemester: SemesterOption | null = null;
  let totalXp = 0;
  let progressList: PortfolioTileItem[] = [];
  let attemptList: PortfolioAttemptItem[] = [];
  const unlockedBadgeDates = new Map<string, string>();
  let assignedList: Array<{ id: string; title: string; dueAt: Date | null; isPublished: boolean }> = [];

  try {
    if (session && (await isDatabaseReachable())) {
      const [u] = await db
        .select({
          avatarKey: users.avatarKey,
          displayName: users.displayName,
          fullName: users.fullName,
          equippedFrameKey: users.equippedFrameKey,
        })
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1);

      if (u) {
        avatarKey = u.avatarKey ?? DEFAULT_AVATAR_KEY;
        frameKey = u.equippedFrameKey ?? "none";
        displayName = u.displayName?.trim() || u.fullName;
      }

      const semRows = await db
        .select({
          id: semesters.id,
          label: semesters.label,
          yearLabel: academicYears.label,
          isCurrent: semesters.isCurrent,
          isLocked: semesters.isLocked,
        })
        .from(semesters)
        .innerJoin(academicYears, eq(semesters.academicYearId, academicYears.id))
        .orderBy(desc(academicYears.yearBe), asc(semesters.termNo));

      allSemesters = semRows;
      const chosen =
        semRows.find((s) => s.id === params.semesterId) ??
        semRows.find((s) => s.isCurrent) ??
        semRows[0] ??
        null;
      activeSemester = chosen;

      if (chosen) {
        const [xpRow] = await db
          .select({ total: sql<number>`COALESCE(SUM(${xpLedger.xpAmount}), 0)::int` })
          .from(xpLedger)
          .where(and(eq(xpLedger.studentId, session.userId), eq(xpLedger.semesterId, chosen.id)));
        totalXp = xpRow?.total ?? 0;

        const badgeRows = await db
          .select({
            badgeKey: badges.badgeKey,
            awardedAt: studentBadges.awardedAt,
          })
          .from(studentBadges)
          .innerJoin(badges, eq(studentBadges.badgeId, badges.id))
          .where(
            and(
              eq(studentBadges.studentId, session.userId),
              eq(studentBadges.semesterId, chosen.id)
            )
          );
        for (const b of badgeRows) {
          unlockedBadgeDates.set(b.badgeKey, b.awardedAt.toLocaleDateString("th-TH"));
        }

        const progRows = await db
          .select({
            challengeId: challenges.id,
            challengeTitle: challenges.title,
            moduleKey: modules.moduleKey,
            moduleTitle: modules.title,
            assignmentId: moduleAssignments.id,
            orderIndex: challenges.orderIndex,
            bestScore: studentChallengeProgress.bestScore,
            bestStars: studentChallengeProgress.bestStars,
            attemptsCount: studentChallengeProgress.attemptsCount,
            passed: studentChallengeProgress.passed,
          })
          .from(studentChallengeProgress)
          .innerJoin(challenges, eq(studentChallengeProgress.challengeId, challenges.id))
          .innerJoin(moduleAssignments, eq(studentChallengeProgress.assignmentId, moduleAssignments.id))
          .innerJoin(modules, eq(moduleAssignments.moduleId, modules.id))
          .where(
            and(
              eq(studentChallengeProgress.studentId, session.userId),
              eq(moduleAssignments.semesterId, chosen.id)
            )
          )
          .orderBy(asc(challenges.orderIndex));

        progressList = progRows.map((p) => ({
          ...p,
          bestScore: Number(p.bestScore),
          bestStars: Math.min(3, Math.max(0, p.bestStars)) as 0 | 1 | 2 | 3,
        }));

        const subRows = await db
          .select({
            id: submissions.id,
            challengeId: submissions.challengeId,
            challengeTitle: challenges.title,
            attemptNo: submissions.attemptNo,
            score: submissions.score,
            stars: submissions.stars,
            passed: submissions.passed,
            submittedAt: submissions.submittedAt,
            evidence: submissions.evidence,
            teacherNote: submissions.teacherNote,
          })
          .from(submissions)
          .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
          .innerJoin(moduleAssignments, eq(submissions.assignmentId, moduleAssignments.id))
          .where(
            and(
              eq(submissions.studentId, session.userId),
              eq(moduleAssignments.semesterId, chosen.id)
            )
          )
          .orderBy(desc(submissions.submittedAt))
          .limit(40);

        attemptList = subRows.map((s) => {
          const telemetry = (s.evidence as { telemetry?: { durationSec?: number } }).telemetry;
          return {
            id: s.id,
            challengeId: s.challengeId,
            challengeTitle: s.challengeTitle,
            attemptNo: s.attemptNo,
            score: Number(s.score),
            stars: s.stars,
            passed: s.passed,
            submittedAtIso: s.submittedAt.toISOString(),
            durationSec: telemetry?.durationSec ?? 0,
            teacherNote: s.teacherNote,
          };
        });

        const [enr] = await db
          .select({ classroomId: classrooms.id })
          .from(enrollments)
          .innerJoin(classrooms, eq(enrollments.classroomId, classrooms.id))
          .where(and(eq(enrollments.studentId, session.userId), eq(enrollments.status, "active")))
          .orderBy(desc(enrollments.enrolledAt))
          .limit(1);

        if (enr) {
          const assignRows = await db
            .select({
              id: moduleAssignments.id,
              titleOverride: moduleAssignments.titleOverride,
              moduleTitle: modules.title,
              dueAt: moduleAssignments.dueAt,
              isPublished: moduleAssignments.isPublished,
            })
            .from(moduleAssignments)
            .innerJoin(modules, eq(moduleAssignments.moduleId, modules.id))
            .where(
              and(
                eq(moduleAssignments.semesterId, chosen.id),
                eq(moduleAssignments.classroomId, enr.classroomId),
                eq(moduleAssignments.isPublished, true)
              )
            )
            .orderBy(asc(moduleAssignments.dueAt));

          assignedList = assignRows.map((a) => ({
            id: a.id,
            title: a.titleOverride ?? a.moduleTitle,
            dueAt: a.dueAt,
            isPublished: a.isPublished,
          }));
        }
      }
    }
  } catch {
    // Graceful offline preview
  }

  const levelInfo = getPlayerLevelInfo(totalXp);

  return (
    <ServerAppShell activePath="progress">
      <div className="space-y-8">
        {/* Profile Header Card */}
        <section className="ed-hero p-6 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="flex flex-wrap items-center gap-4 lg:col-span-7">
              <AvatarPicker
                currentKey={avatarKey}
                currentDisplayName={displayName}
                frameKey={frameKey}
                readOnlyGuest={!session}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-bold ${levelInfo.rankBadgeClass}`}>
                    <Sparkles className="h-3.5 w-3.5" />
                    LV.{levelInfo.level} · {levelInfo.rankTitle}
                  </span>
                </div>
                <h1 className="mt-1 font-display text-2xl font-bold text-[#092551]">
                  คลังผลงาน — {displayName}
                </h1>
                <p className="text-sm text-[#5C7299]">
                  {session ? session.email : "โหมดทดลองเรียน (เข้าสู่ระบบด้วย @pccpl.ac.th เพื่อบันทึกคะแนนรายภาคเรียน)"}
                </p>

                {allSemesters.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#5C7299]">ภาคเรียน:</span>
                    {allSemesters.map((sem) => {
                      const isSelected = sem.id === activeSemester?.id;
                      return (
                        <Link
                          key={sem.id}
                          href={`/portfolio?semesterId=${sem.id}`}
                          className={`inline-flex min-h-9 items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold transition ${
                            isSelected
                              ? "border-[#1364E7] bg-[#1364E7] text-white"
                              : "border-[#D4E2FA] bg-white text-[#092551] hover:border-[#9FC0F8]"
                          }`}
                        >
                          {sem.isLocked && <Lock className="h-3 w-3" />}
                          <span>
                            {sem.yearLabel} · {sem.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-2xl border border-[#DCE7FA] bg-white/90 p-4 lg:col-span-5">
              <div className="flex items-center justify-between text-xs font-bold text-[#092551]">
                <span>XP ภาคเรียนนี้: {totalXp} XP</span>
                <span className="text-[#1364E7]">{levelInfo.progressPercent}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#E8F1FE]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#1364E7] to-[#227FF5]"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-[#5C7299]">
                  {levelInfo.xpInCurrentLevel} / {levelInfo.xpForNextLevel} XP สู่ LV.{levelInfo.level + 1}
                </span>
                <Link
                  href="/progress"
                  className="inline-flex items-center gap-1 font-bold text-[#1364E7] hover:underline"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Mastery Tracker</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Challenge History */}
        <section className="space-y-3">
          <div>
            <h2 className="font-display text-xl font-bold text-[#092551]">
              บันทึกการส่งงานและคะแนนรายด่าน
            </h2>
            <p className="text-sm text-[#5C7299]">
              คลิกเลือกแต่ละด่านเพื่อดูประวัติการส่งงาน เวลาที่ใช้ และความเห็นจากครูผู้สอน
            </p>
          </div>
          <PortfolioStitchGrid
            tiles={progressList}
            attempts={attemptList}
            isLockedSemester={Boolean(activeSemester?.isLocked)}
          />
        </section>

        {/* Badges Collection */}
        <section id="badges" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <h2 className="font-display text-xl font-bold text-[#092551]">
                เหรียญความสำเร็จ ({unlockedBadgeDates.size}/{BADGE_DEFINITIONS.length})
              </h2>
            </div>
            {unlockedBadgeDates.size === 0 && (
              <span className="text-xs font-semibold text-[#5C7299]">
                ผ่านภารกิจแรกเพื่อปลดล็อกเหรียญรางวัลแรก
              </span>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {BADGE_DEFINITIONS.map((b) => {
              const unlockedAt = unlockedBadgeDates.get(b.key);
              const unlocked = Boolean(unlockedAt);
              return (
                <div
                  key={b.key}
                  className={`ed-card flex items-start gap-3.5 p-4 ${
                    unlocked ? "border-amber-200 bg-amber-50/30" : "opacity-70"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      unlocked ? "squircle-amber text-white shadow-sm" : "bg-[#EFF6FF] text-[#7485A4]"
                    }`}
                  >
                    {unlocked ? <Award className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-sm font-bold text-[#092551]">{b.title}</div>
                    <p className="mt-0.5 text-xs text-[#5C7299]">{b.description}</p>
                    {unlockedAt ? (
                      <span className="mt-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        ได้รับเมื่อ {unlockedAt}
                      </span>
                    ) : (
                      <span className="mt-2 inline-block text-[10px] font-semibold text-[#7485A4]">
                        ยังไม่ปลดล็อก
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Teacher Assigned Tasks */}
        <section id="assignments" className="ed-card space-y-4 p-6">
          <div className="flex items-center gap-2">
            <BookCheck className="h-5 w-5 text-[#1364E7]" />
            <h2 className="font-display text-xl font-bold text-[#092551]">งานที่ครูมอบหมาย</h2>
          </div>

          {assignedList.length === 0 ? (
            <p className="text-sm text-[#5C7299]">ไม่มีงานที่มอบหมายเพิ่มเติมในภาคเรียนนี้</p>
          ) : (
            <div className="divide-y divide-[#EBF2FE]">
              {assignedList.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3.5"
                >
                  <div>
                    <div className="text-base font-bold text-[#092551]">{item.title}</div>
                    <div className="mt-0.5 text-xs text-[#5C7299]">
                      {item.dueAt
                        ? `กำหนดส่ง ${new Date(item.dueAt).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}`
                        : "ไม่มีกำหนดส่ง ทำตามจังหวะการเรียนรู้ของเธอได้เลย"}
                    </div>
                  </div>

                  {activeSemester?.isLocked ? (
                    <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      ภาคเรียนนี้ปิดแล้ว
                    </span>
                  ) : (
                    <Link href={`/learn/${item.id}`} className="ed-btn-primary text-sm">
                      <Play className="h-4 w-4 fill-current" />
                      <span>เข้าทำภารกิจ</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </ServerAppShell>
  );
}
