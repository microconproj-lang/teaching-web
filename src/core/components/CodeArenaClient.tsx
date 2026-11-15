"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Crown,
  Maximize2,
  Play,
  ShieldAlert,
  Sparkles,
  Swords,
  Terminal,
  Trophy,
  X,
} from "lucide-react";
import { ARENA_CHALLENGES, matchesCourseCode, type ArenaProblemDef } from "@/core/config/curriculum";
import { getEditorTheme } from "@/core/config/shop";
import { ARENA_TIERS, getArenaTierInfo } from "@/core/grading/level";
import { gradePythonChallenge, runPythonCode, type PythonGradeResult } from "@/core/python/runner";
import { usePlatformState } from "@/core/components/PlatformStateProvider";

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  room: string;
  ap: number;
  streak: number;
  solved: number;
  isMe?: boolean;
}

export function CodeArenaClient({
  leaderboard,
  initialCourse = "",
}: {
  leaderboard: LeaderboardEntry[];
  initialCourse?: string;
}) {
  const { state, recordArenaResult } = usePlatformState();
  const [courseFilter, setCourseFilter] = useState<string>(initialCourse);
  const [tab, setTab] = useState<"ranked" | "duel" | "leaderboard">("ranked");
  const [activeMatch, setActiveMatch] = useState<{
    problem: ArenaProblemDef;
    mode: "ranked" | "duel";
  } | null>(null);

  const [code, setCode] = useState("");
  const [elapsedSec, setElapsedSec] = useState(0);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [stdout, setStdout] = useState<string | null>(null);
  const [runErr, setRunErr] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<PythonGradeResult | null>(null);
  const timerRef = useRef<number | null>(null);

  const myTier = getArenaTierInfo(state.ap);
  const theme = getEditorTheme(state.equippedThemeKey);

  useEffect(() => {
    if (!activeMatch) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      return;
    }
    setElapsedSec(0);
    timerRef.current = window.setInterval(() => {
      setElapsedSec((s) => s + 1);
    }, 1000);

    const onVis = () => {
      if (document.hidden) setTabWarnings((w) => w + 1);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [activeMatch]);

  const startMatch = (problem: ArenaProblemDef, mode: "ranked" | "duel") => {
    setActiveMatch({ problem, mode });
    setCode(problem.starterCode);
    setTabWarnings(0);
    setStdout(null);
    setRunErr(null);
    setMatchResult(null);
  };

  const handleRun = () => {
    if (!activeMatch) return;
    const stdin = activeMatch.problem.testCases[0]?.stdin ?? [];
    const res = runPythonCode(code, stdin);
    setStdout(res.stdout.join("\n") || "(ไม่มี Output)");
    setRunErr(res.error);
  };

  const handleSubmitMatch = async () => {
    if (!activeMatch) return;
    const res = gradePythonChallenge(code, activeMatch.problem.testCases);
    setMatchResult(res);

    const apDelta = res.passed
      ? activeMatch.mode === "ranked"
        ? activeMatch.problem.apRewardWin
        : Math.round(activeMatch.problem.apRewardWin * 0.7)
      : activeMatch.mode === "ranked"
        ? -8
        : 0;

    await recordArenaResult({
      problemKey: activeMatch.problem.key,
      code,
      mode: activeMatch.mode,
      durationSec: Math.max(1, elapsedSec),
      passed: res.passed,
      apDelta,
      coinReward: activeMatch.problem.coinReward,
      title: activeMatch.problem.title,
    });
  };

  const mergedLeaderboard: LeaderboardEntry[] = [
    ...leaderboard.filter((r) => !r.isMe),
    {
      rank: 0,
      displayName: state.fullName,
      room: state.roomName ?? "โหมดทดลอง",
      ap: state.ap,
      streak: state.solvedArenaKeys.length,
      solved: state.solvedArenaKeys.length,
      isMe: true,
    },
  ]
    .sort((a, b) => b.ap - a.ap)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <div className="space-y-6">
      {/* Arena Hero Banner */}
      <section className="rounded-[24px] border border-[#224E8C] bg-gradient-to-br from-[#071B3D] via-[#0B3370] to-[#111C44] p-6 text-white shadow-[0_18px_44px_rgba(7,27,59,0.28)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-300">
              <Swords className="h-3.5 w-3.5 text-amber-300" />
              <span>SEASON 1 · PCCPL CODE ARENA</span>
            </div>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">
              สนามประลองโค้ดและจัดอันดับโรงเรียน
            </h1>
            <p className="max-w-[52ch] text-xs leading-relaxed text-[#C2D2EE] sm:text-sm">
              ทดสอบความแม่นยำและความไวในการแก้โจทย์ Python แข่งขันเก็บแต้ม AP ไต่แรงก์ตั้งแต่ Bronze ถึง Diamond
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-xs">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${myTier.gradient} text-white shadow-lg`}
            >
              <Crown className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs text-sky-200">ระดับแรงก์ปัจจุบัน</div>
              <div className="font-display text-2xl font-semibold text-white">
                {myTier.name} <span className="text-base font-mono text-amber-300">{state.ap} AP</span>
              </div>
              <div className="text-[11px] text-[#C2D2EE]">
                พิชิตแล้ว {state.solvedArenaKeys.length} / {ARENA_CHALLENGES.length} สนาม
              </div>
            </div>
          </div>
        </div>

        {/* Tier Ladder */}
        <div className="mt-6 grid grid-cols-5 gap-2">
          {ARENA_TIERS.map((tier) => {
            const active = tier.name === myTier.name;
            return (
              <div
                key={tier.name}
                className={`rounded-xl border px-3 py-2 text-center text-xs transition ${
                  active
                    ? "border-amber-300 bg-white/15 font-semibold text-white shadow-sm"
                    : "border-white/10 bg-white/5 text-[#8BA9DA]"
                }`}
              >
                <div>{tier.name}</div>
                <div className="font-mono text-[10px] opacity-80">{tier.minAp}+ AP</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mode Switcher */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-[#E1EAFB] bg-white p-1.5 shadow-xs sm:inline-flex">
        {[
          { key: "ranked" as const, label: "Ranked Match (เก็บ AP)" },
          { key: "duel" as const, label: "1v1 Speed Duel (ท้าดวล)" },
          { key: "leaderboard" as const, label: "ตารางอันดับโรงเรียน (Leaderboard)" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              tab === item.key
                ? "bg-[#1364E7] text-white shadow-xs"
                : "text-[#5C7299] hover:bg-[#F4F7FD] hover:text-[#092551]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "leaderboard" ? (
        <section className="ed-card overflow-hidden">
          <div className="border-b border-[#E1EAFB] bg-[#F8FAFF] px-6 py-4">
            <h2 className="font-display text-lg font-semibold text-[#092551]">
              🏆 ตารางอันดับ Season 1 (PCCPL Code Arena)
            </h2>
          </div>
          <div className="divide-y divide-[#E1EAFB]">
            {mergedLeaderboard.map((row) => {
              const t = getArenaTierInfo(row.ap);
              return (
                <div
                  key={`${row.rank}-${row.displayName}`}
                  className={`flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 ${
                    row.isMe ? "bg-[#EFF6FF]" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl font-mono text-sm font-bold ${
                        row.rank === 1
                          ? "bg-amber-100 text-amber-800"
                          : row.rank === 2
                            ? "bg-slate-200 text-slate-800"
                            : row.rank === 3
                              ? "bg-orange-100 text-orange-800"
                              : "bg-[#F4F7FD] text-[#5C7299]"
                      }`}
                    >
                      #{row.rank}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#092551]">
                        {row.displayName} {row.isMe && <span className="text-[#1364E7]">(เธอ)</span>}
                      </div>
                      <div className="text-xs text-[#5C7299]">
                        {row.room} · ชนะต่อเนื่อง {row.streak} ครั้ง
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${t.badgeClass}`}>
                      {t.name}
                    </span>
                    <span className="font-mono text-sm font-bold text-[#092551]">{row.ap} AP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: "", label: "ทุกสนามประลอง" },
              { key: "ว21103", label: "ม.1 (ว21103)" },
              { key: "ว21202", label: "ม.1 micro:bit (ว21202)" },
              { key: "ว22103", label: "ม.2 (ว22103)" },
              { key: "ว23103", label: "ม.3 Cyber (ว23103)" },
              { key: "ว23202", label: "ม.3 IoT (ว23202)" },
            ].map((tabItem) => {
              const active =
                tabItem.key === ""
                  ? !courseFilter
                  : matchesCourseCode(courseFilter, tabItem.key);
              return (
                <button
                  key={tabItem.key || "all"}
                  type="button"
                  onClick={() => setCourseFilter(tabItem.key)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? tabItem.key === "ว23202"
                        ? "bg-[#092551] text-[#F0742E]"
                        : tabItem.key === "ว21202"
                          ? "bg-[#065F46] text-emerald-200"
                          : "bg-[#1364E7] text-white"
                      : "border border-[#D4E4FC] bg-white text-[#5C7299] hover:text-[#092551]"
                  }`}
                >
                  {tabItem.label}
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {ARENA_CHALLENGES.filter((ch) =>
              courseFilter ? matchesCourseCode(ch.courseCode ?? "", courseFilter) : true
            ).map((ch) => {
              const solved = state.solvedArenaKeys.includes(ch.key);
              return (
                <div key={ch.key} className="ed-card ed-card-hover flex flex-col justify-between p-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {ch.courseCode && (
                          <span
                            className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${
                              matchesCourseCode(ch.courseCode, "ว23202")
                                ? "bg-[#092551] text-[#F0742E]"
                                : "bg-[#E1EAFB] text-[#092551]"
                            }`}
                          >
                            {ch.courseCode}
                          </span>
                        )}
                        <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-800">
                          ม.{ch.gradeLevel} · {ch.difficulty}
                        </span>
                      </div>
                      {solved && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          พิชิตแล้ว
                        </span>
                      )}
                    </div>

                  <h3 className="font-display text-lg font-semibold text-[#092551]">{ch.title}</h3>
                  <p className="text-xs leading-relaxed text-[#5C7299]">{ch.prompt}</p>
                </div>

                <div className="mt-5 space-y-3 border-t border-[#E1EAFB] pt-4">
                  <div className="flex items-center justify-between text-xs text-[#5C7299]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      จำกัดเวลา {Math.round(ch.timeLimitSec / 60)} นาที
                    </span>
                    <span className="font-semibold text-[#0A5FE6]">
                      +{ch.apRewardWin} AP · +{ch.coinReward} Coins
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => startMatch(ch, tab === "duel" ? "duel" : "ranked")}
                    className="ed-btn-primary w-full !min-h-10 !text-xs"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>{tab === "duel" ? "เข้าสู่สนาม 1v1 Duel" : "เข้าสู่สนาม Ranked Match"}</span>
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fullscreen Arena Combat Modal */}
      {activeMatch && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#06152E] p-4 text-white sm:p-6">
          <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-[#092551]">
                <Trophy className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs font-semibold text-sky-300">
                  {activeMatch.mode === "ranked" ? "RANKED ARENA · SINGLE-SUBMIT FOCUS" : "1v1 SPEED DUEL vs BOT"}
                </div>
                <h2 className="font-display text-lg font-semibold">{activeMatch.problem.title}</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 font-mono text-xs">
                <Clock className="h-3.5 w-3.5 text-amber-300" />
                {elapsedSec}s / {activeMatch.problem.timeLimitSec}s
              </span>
              {tabWarnings > 0 && (
                <span className="inline-flex items-center gap-1 rounded-xl bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-200">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  สลับหน้าต่าง {tabWarnings} ครั้ง
                </span>
              )}
              <button
                type="button"
                onClick={() => setActiveMatch(null)}
                className="rounded-xl bg-white/10 p-2 hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mx-auto mt-5 grid w-full max-w-5xl flex-1 gap-5 overflow-y-auto lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <div className="text-xs font-semibold text-sky-300">ภารกิจการประลอง</div>
                <p className="mt-2 text-sm leading-relaxed text-[#E4EDFF]">
                  {activeMatch.problem.prompt}
                </p>

                {activeMatch.mode === "duel" && (
                  <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                    🤖 คู่แข่ง Bot ประจำสนาม: กำลังประมวลผลเฉลี่ยที่ ~95 วินาที — เคลียร์ให้เร็วกว่าเพื่อรับโบนัส!
                  </div>
                )}

                <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
                  <div className="text-xs font-semibold text-[#8BA9DA]">ตัวอย่างกรณีทดสอบ:</div>
                  {activeMatch.problem.testCases.map((tc, i) => (
                    <div key={i} className="rounded-lg bg-black/30 px-3 py-2 font-mono text-xs text-[#C2D2EE]">
                      {tc.label} → Expect: {tc.expectedOutput}
                    </div>
                  ))}
                </div>
              </div>

              {matchResult && (
                <div
                  className={`rounded-2xl border p-4 text-xs ${
                    matchResult.passed
                      ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-100"
                      : "border-rose-400/40 bg-rose-500/15 text-rose-100"
                  }`}
                >
                  <div className="font-display text-base font-semibold">
                    {matchResult.passed
                      ? `🏆 ชนะการประลองใน ${elapsedSec} วินาที!`
                      : `ยังไม่ผ่าน (${matchResult.passedCount}/${matchResult.totalCount})`}
                  </div>
                  <div className="mt-2 space-y-1 font-mono">
                    {matchResult.results.map((r, i) => (
                      <div key={i}>
                        {r.passed ? "✓" : "✗"} {r.label} (ได้: {r.error || r.actual})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-7">
              <div className={`overflow-hidden rounded-2xl border ${theme.borderClass} ${theme.bgClass} shadow-2xl`}>
                <div className={`flex items-center justify-between px-4 py-3 ${theme.barClass}`}>
                  <span className={`font-mono text-xs font-semibold ${theme.textClass}`}>
                    arena_solution.py
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleRun}
                      className="inline-flex items-center gap-1 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/25"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>ลองรัน</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitMatch}
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-400"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>ส่งคำตอบจริง</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={12}
                  spellCheck={false}
                  className={`w-full bg-transparent p-4 font-mono text-sm leading-relaxed focus:outline-none ${theme.textClass}`}
                />

                {(stdout !== null || runErr) && (
                  <div className="border-t border-white/10 bg-black/40 p-4 font-mono text-xs">
                    <div className="mb-1 flex items-center gap-1 text-emerald-400">
                      <Terminal className="h-3.5 w-3.5" />
                      <span>Output:</span>
                    </div>
                    <pre className="whitespace-pre-wrap text-[#E4EDFF]">{runErr || stdout}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

