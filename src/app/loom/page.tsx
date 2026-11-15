import Link from "next/link";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { ArrowLeft, Medal, ShieldCheck, Trophy, Users } from "lucide-react";
import { db, isDatabaseReachable } from "@/core/db";
import {
  classrooms,
  enrollments,
  semesters,
  users,
  xpLedger,
} from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { DEFAULT_AVATAR_KEY } from "@/core/avatars";
import { getPlayerLevelInfo } from "@/core/grading/level";
import { ServerAppShell } from "@/core/components/ServerAppShell";
import { AvatarEmblem } from "@/core/components/AvatarEmblem";

export const dynamic = "force-dynamic";

interface ThreadView {
  studentId: string;
  studentNumber: number;
  displayName: string;
  avatarKey: string;
  xp: number;
  isMe: boolean;
}

function buildDemoThreads(myStudentId: string, myName: string, myAvatar: string): ThreadView[] {
  const sampleXp = [
    420, 290, 560, 180, 340, 210, 490, 150, 380, 260,
    310, 445, 220, 175, 510, 240, 360, 195, 430, 280,
    330, 200, 390, 470, 250,
  ];
  return sampleXp.map((xp, idx) => ({
    studentId: idx === 4 ? myStudentId : `demo-student-${idx + 1}`,
    studentNumber: idx + 1,
    displayName: idx === 4 ? myName : `นักเรียน ม.1/${idx + 1}`,
    avatarKey: idx === 4 ? myAvatar : DEFAULT_AVATAR_KEY,
    xp,
    isMe: idx === 4,
  }));
}

export default async function ClassroomLeaderboardPage() {
  const session = await getCurrentSession();

  let semesterLabel: string | null = null;
  let roomName = "ม.1/1 (ตัวอย่างห้องเรียน)";
  let myXp = 340;
  let avatarKey = DEFAULT_AVATAR_KEY;
  let myDisplayName = session?.fullName ?? "เธอ (โหมดทดลอง)";
  let thisWeekXp = 140;
  let lastWeekXp = 110;
  let threads: ThreadView[] = [];
  let isFallbackPreview = false;

  try {
    if (session && (await isDatabaseReachable())) {
      const [semRow] = await db
        .select({ id: semesters.id, label: semesters.label })
        .from(semesters)
        .where(eq(semesters.isCurrent, true))
        .limit(1);

      semesterLabel = semRow?.label ?? null;

      const [meUser] = await db
        .select({
          avatarKey: users.avatarKey,
          displayName: users.displayName,
          fullName: users.fullName,
        })
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1);

      if (meUser) {
        avatarKey = meUser.avatarKey ?? DEFAULT_AVATAR_KEY;
        myDisplayName = meUser.displayName?.trim() || meUser.fullName;
      }

      const [enr] = await db
        .select({
          classroomId: classrooms.id,
          roomName: classrooms.name,
        })
        .from(enrollments)
        .innerJoin(classrooms, eq(enrollments.classroomId, classrooms.id))
        .where(and(eq(enrollments.studentId, session.userId), eq(enrollments.status, "active")))
        .orderBy(desc(enrollments.enrolledAt))
        .limit(1);

      if (enr && semRow) {
        roomName = enr.roomName;

        const roster = await db
          .select({
            studentId: enrollments.studentId,
            studentNumber: enrollments.studentNumber,
            fullName: users.fullName,
            displayName: users.displayName,
            avatarKey: users.avatarKey,
          })
          .from(enrollments)
          .innerJoin(users, eq(enrollments.studentId, users.id))
          .where(and(eq(enrollments.classroomId, enr.classroomId), eq(enrollments.status, "active")))
          .orderBy(asc(enrollments.studentNumber));

        const xpRows = await db
          .select({
            studentId: xpLedger.studentId,
            totalXp: sql<number>`COALESCE(SUM(${xpLedger.xpAmount}), 0)::int`,
          })
          .from(xpLedger)
          .where(eq(xpLedger.semesterId, semRow.id))
          .groupBy(xpLedger.studentId);

        const xpByStudent = new Map(xpRows.map((x) => [x.studentId, x.totalXp]));
        myXp = xpByStudent.get(session.userId) ?? 0;

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 86400 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400 * 1000);

        const weekRows = await db
          .select({
            xpAmount: xpLedger.xpAmount,
            createdAt: xpLedger.createdAt,
          })
          .from(xpLedger)
          .where(and(eq(xpLedger.studentId, session.userId), eq(xpLedger.semesterId, semRow.id)));

        thisWeekXp = weekRows
          .filter((r) => r.createdAt >= sevenDaysAgo)
          .reduce((acc, r) => acc + r.xpAmount, 0);
        lastWeekXp = weekRows
          .filter((r) => r.createdAt >= fourteenDaysAgo && r.createdAt < sevenDaysAgo)
          .reduce((acc, r) => acc + r.xpAmount, 0);

        if (roster.length >= 1) {
          threads = roster.map((r) => ({
            studentId: r.studentId,
            studentNumber: r.studentNumber,
            displayName: r.displayName?.trim() || r.fullName,
            avatarKey: r.avatarKey ?? DEFAULT_AVATAR_KEY,
            xp: xpByStudent.get(r.studentId) ?? 0,
            isMe: r.studentId === session.userId,
          }));
        }
      }
    }
  } catch {
    // Graceful preview fallback
  }

  if (threads.length === 0) {
    isFallbackPreview = true;
    threads = buildDemoThreads(session?.userId ?? "guest", myDisplayName, avatarKey);
    if (!session) {
      myXp = threads.find((t) => t.isMe)?.xp ?? 340;
    } else {
      threads = threads.map((t) => (t.isMe ? { ...t, xp: myXp } : t));
    }
  }

  const sortedByXp = [...threads].sort((a, b) => b.xp - a.xp);
  const top10Ids = new Set(sortedByXp.slice(0, 10).map((t) => t.studentId));
  const maxXp = Math.max(150, ...threads.map((t) => t.xp));
  const totalRoomXp = threads.reduce((acc, t) => acc + t.xp, 0);
  const roomTargetXp = threads.length * 300;
  const roomPct = Math.min(100, Math.round((totalRoomXp / Math.max(1, roomTargetXp)) * 100));
  const levelInfo = getPlayerLevelInfo(myXp);
  const weekDiff = thisWeekXp - lastWeekXp;

  return (
    <ServerAppShell activePath="loom">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#1364E7]">
              <Users className="h-3.5 w-3.5" />
              <span>กระดานคะแนนห้องเรียน {semesterLabel ? `· ${semesterLabel}` : ""}</span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold text-[#092551] sm:text-3xl">
              อันดับพลังการเรียนรู้ — {roomName}
            </h1>
            <p className="mt-1 text-sm text-[#5C7299]">
              ร่วมกันเก็บ XP ทั้งห้องเพื่อปลดล็อกเป้าหมายประจำห้องเรียน พร้อมคุ้มครองความเป็นส่วนตัว
            </p>
          </div>
          <Link href="/dashboard" className="ed-btn-secondary text-sm">
            <ArrowLeft className="h-4 w-4" />
            <span>กลับแดชบอร์ด</span>
          </Link>
        </div>

        {isFallbackPreview && (
          <div className="rounded-2xl border border-dashed border-[#9FC0F8] bg-[#F8FAFF] px-4 py-3 text-sm text-[#5C7299]">
            กำลังแสดงข้อมูลตัวอย่างห้องเรียน 25 คน (เลขที่ 1–25) เนื่องจากยังไม่มีรายชื่อนักเรียนเต็มห้องในฐานข้อมูลหรืออยู่ในโหมดทดลอง
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-12">
          <section className="ed-card p-6 lg:col-span-5">
            <h2 className="font-display text-lg font-bold text-[#092551]">
              สถิติสัปดาห์นี้เทียบสัปดาห์ก่อน
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#E1EAFB] bg-[#F8FAFF] p-4">
                <div className="text-xs font-semibold text-[#5C7299]">XP สัปดาห์นี้</div>
                <div className="mt-1 font-display text-2xl font-bold text-[#1364E7]">
                  {thisWeekXp} <span className="text-xs font-semibold">XP</span>
                </div>
              </div>
              <div className="rounded-2xl border border-[#E1EAFB] bg-[#F8FAFF] p-4">
                <div className="text-xs font-semibold text-[#5C7299]">Rank ปัจจุบัน</div>
                <div className="mt-1 font-display text-base font-bold text-[#092551]">
                  LV.{levelInfo.level} · {levelInfo.rankTitle}
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-[#092551]">
              {weekDiff >= 0
                ? `ยอดเยี่ยม! สัปดาห์นี้เธอเก็บเพิ่มได้มากกว่าสัปดาห์ก่อน +${weekDiff} XP`
                : `สัปดาห์ก่อนทำไว้ ${lastWeekXp} XP ลองเก็บโจทย์เพิ่มเติมอีกนิดในสัปดาห์นี้`}
            </p>
          </section>

          <section className="ed-card p-6 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-[#092551]">
                เป้าหมายความก้าวหน้ารวมทั้งห้อง
              </h2>
              <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#1364E7]">
                {totalRoomXp.toLocaleString()} / {roomTargetXp.toLocaleString()} XP ({roomPct}%)
              </span>
            </div>

            <div className="mt-4 h-4 overflow-hidden rounded-full bg-[#E8F1FE]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#1364E7] via-[#227FF5] to-emerald-500 transition-all"
                style={{ width: `${roomPct}%` }}
              />
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[#F8FAFF] p-3 text-xs text-[#5C7299]">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1364E7]" />
              <span>
                เพื่อบรรยากาศการเรียนที่ดี แสดงชื่อเฉพาะบัญชีของเธอและผู้ทำคะแนนสูงสุด 10 อันดับแรกเท่านั้น เพื่อนคนอื่นร่วมสะสมคะแนนแบบไม่ระบุชื่อ
              </span>
            </div>
          </section>
        </div>

        {/* Visual Bar Chart by Student Number */}
        <section className="ed-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EBF2FE] pb-4">
            <h2 className="font-display text-lg font-bold text-[#092551]">
              แผนภูมิแท่งคะแนนรายเลขที่ (1–{threads.length})
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5C7299]">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded bg-amber-400" />
                ของเธอ
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded bg-[#1364E7]" />
                Top 10
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded bg-[#CBD5E1]" />
                เพื่อนร่วมห้อง
              </span>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto pb-2">
            <div className="flex min-w-[660px] items-end justify-between gap-2 border-b border-[#DCE7FA] pt-8">
              {threads.map((t) => {
                const heightPx = Math.max(20, Math.round((t.xp / maxXp) * 180));
                const showName = t.isMe || top10Ids.has(t.studentId);
                const barCls = t.isMe
                  ? "bg-gradient-to-t from-amber-500 to-amber-300"
                  : showName
                    ? "bg-gradient-to-t from-[#1364E7] to-[#60A5FA]"
                    : "bg-[#CBD5E1]";

                return (
                  <div
                    key={t.studentId}
                    className="flex flex-1 flex-col items-center"
                    title={showName ? `${t.displayName}: ${t.xp} XP` : `เลขที่ ${t.studentNumber}: ${t.xp} XP`}
                  >
                    {showName && (
                      <span
                        className={`mb-2 max-w-16 truncate rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          t.isMe
                            ? "bg-amber-100 text-amber-800"
                            : "bg-[#EFF6FF] text-[#1364E7]"
                        }`}
                      >
                        {t.isMe ? "เธอ" : t.displayName}
                      </span>
                    )}
                    <div
                      className={`w-4 rounded-t-lg transition-all ${barCls}`}
                      style={{ height: `${heightPx}px` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex min-w-[660px] justify-between gap-2 text-center text-[11px] font-semibold text-[#5C7299]">
              {threads.map((t) => (
                <span key={t.studentId} className="flex-1">
                  {t.studentNumber}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Top 10 Highlight List */}
        <section className="ed-card p-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h2 className="font-display text-lg font-bold text-[#092551]">
              ทำเนียบผู้ทำคะแนนสูงสุด 10 อันดับแรกของห้อง
            </h2>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {sortedByXp.slice(0, 10).map((t, rankIdx) => (
              <div
                key={t.studentId}
                className={`flex items-center justify-between gap-3 rounded-2xl border p-3.5 ${
                  t.isMe
                    ? "border-amber-300 bg-amber-50/70"
                    : "border-[#E1EAFB] bg-[#F8FAFF]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      rankIdx === 0
                        ? "bg-amber-400 text-white"
                        : rankIdx === 1
                          ? "bg-slate-300 text-slate-800"
                          : rankIdx === 2
                            ? "bg-orange-300 text-orange-950"
                            : "bg-white text-[#5C7299] ring-1 ring-[#D4E2FA]"
                    }`}
                  >
                    #{rankIdx + 1}
                  </span>
                  <AvatarEmblem avatarKey={t.avatarKey} size={36} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-[#092551]">
                      {t.isMe ? `${t.displayName} (เธอ)` : t.displayName}
                    </div>
                    <div className="text-xs text-[#5C7299]">เลขที่ {t.studentNumber}</div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1364E7] ring-1 ring-[#DCE7FA]">
                  <Medal className="h-3.5 w-3.5 text-amber-500" />
                  {t.xp} XP
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ServerAppShell>
  );
}
