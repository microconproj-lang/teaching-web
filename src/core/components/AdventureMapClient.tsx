"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  Compass,
  Gift,
  Lock,
  Play,
  Sparkles,
  Star,
  Terminal,
  Trophy,
  X,
} from "lucide-react";
import {
  ADVENTURE_ISLANDS,
  matchesCourseCode,
  type AdventureIslandDef,
  type AdventureStageDef,
} from "@/core/config/curriculum";
import { getEditorTheme } from "@/core/config/shop";
import { gradePythonChallenge, runPythonCode, type PythonGradeResult } from "@/core/python/runner";
import { usePlatformState } from "@/core/components/PlatformStateProvider";

type IslandFilter = "all" | "1" | "2" | "3" | "v21202" | "v23202";

export function AdventureMapClient({ initialCourse = "" }: { initialCourse?: string }) {
  const { state, claimAdventureReward } = usePlatformState();
  const [filterKey, setFilterKey] = useState<IslandFilter>(
    initialCourse && matchesCourseCode("ว23202", initialCourse)
      ? "v23202"
      : initialCourse && matchesCourseCode("ว21202", initialCourse)
        ? "v21202"
        : initialCourse && matchesCourseCode("ว21103", initialCourse)
          ? "1"
          : initialCourse && matchesCourseCode("ว23103", initialCourse)
            ? "3"
            : "all"
  );
  const [activeStage, setActiveStage] = useState<{
    island: AdventureIslandDef;
    stage: AdventureStageDef;
  } | null>(null);
  const [code, setCode] = useState("");
  const [stdout, setStdout] = useState<string | null>(null);
  const [runErr, setRunErr] = useState<string | null>(null);
  const [gradeRes, setGradeRes] = useState<PythonGradeResult | null>(null);
  const [showHint, setShowHint] = useState(false);

  const theme = getEditorTheme(state.equippedThemeKey);
  const totalStages = ADVENTURE_ISLANDS.reduce((sum, i) => sum + i.stages.length, 0);
  const clearedCount = state.clearedAdventureKeys.length;
  const visibleIslands = ADVENTURE_ISLANDS.filter((i) => {
    if (filterKey === "all") return true;
    if (filterKey === "v21202") return matchesCourseCode(i.courseCode ?? "", "ว21202");
    if (filterKey === "v23202") return matchesCourseCode(i.courseCode ?? "", "ว23202");
    return (
      i.gradeLevel === Number(filterKey) &&
      !matchesCourseCode(i.courseCode ?? "", "ว23202") &&
      !matchesCourseCode(i.courseCode ?? "", "ว21202")
    );
  });

  const openStage = (island: AdventureIslandDef, stage: AdventureStageDef) => {
    setActiveStage({ island, stage });
    setCode(stage.starterCode);
    setStdout(null);
    setRunErr(null);
    setGradeRes(null);
    setShowHint(false);
  };

  const handleRun = () => {
    if (!activeStage) return;
    const stdin = activeStage.stage.testCases[0]?.stdin ?? [];
    const res = runPythonCode(code, stdin);
    setStdout(res.stdout.join("\n") || "(ไม่มี Output)");
    setRunErr(res.error);
  };

  const handleSubmit = async () => {
    if (!activeStage) return;
    const res = gradePythonChallenge(code, activeStage.stage.testCases);
    setGradeRes(res);
    if (res.passed) {
      await claimAdventureReward({
        kind: "stage",
        key: activeStage.stage.key,
        coinReward: activeStage.stage.coinReward,
        xpReward: activeStage.stage.xpReward,
        label: `ผ่านด่าน ${activeStage.stage.code}: ${activeStage.stage.title}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="ed-hero p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0A5FE6]">
              <Compass className="h-3.5 w-3.5" />
              <span>หมู่เกาะล่าสมบัติ PCCPL (ม.1 – ม.3)</span>
            </div>
            <h1 className="font-display text-2xl font-semibold text-[#092551] sm:text-3xl">
              แผนที่ผจญภัยโครงสร้างข้อมูล & อัลกอริทึม
            </h1>
            <p className="max-w-[54ch] text-sm text-[#35517D]">
              เคลียร์ภารกิจทีละเกาะเพื่อเก็บดาว XP และ Coins เปิดหีบสมบัติประจำเกาะจนถึงเกาะจอมบั๊ก!
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#D4E4FC] bg-white px-5 py-3 shadow-xs">
            <Trophy className="h-7 w-7 text-amber-500" />
            <div>
              <div className="text-xs text-[#5C7299]">ความคืบหน้าแผนที่</div>
              <div className="font-display text-xl font-semibold text-[#092551]">
                {clearedCount} / {totalStages} ด่าน
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {[
            { g: "all" as const, label: "ทุกเกาะ" },
            { g: "1" as const, label: "ม.1 อัลกอริทึม (ว21103)" },
            { g: "v21202" as const, label: "ม.1 micro:bit (ว21202)" },
            { g: "2" as const, label: "ม.2 Python" },
            { g: "3" as const, label: "ม.3 นวัตกรรม & Boss (ว23103)" },
            { g: "v23202" as const, label: "ม.3 IoT (ว23202)" },
          ].map((t) => (
            <button
              key={t.g}
              type="button"
              onClick={() => setFilterKey(t.g)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                filterKey === t.g
                  ? t.g === "v23202"
                    ? "bg-[#092551] text-[#F0742E] shadow-xs"
                    : t.g === "v21202"
                      ? "bg-[#065F46] text-emerald-200 shadow-xs"
                      : "bg-[#1364E7] text-white shadow-xs"
                  : "bg-white/85 text-[#5C7299] hover:bg-white hover:text-[#092551]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* Island Cards Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {visibleIslands.map((island) => {
          const allCleared = island.stages.every((s) => state.clearedAdventureKeys.includes(s.key));
          const chestClaimed = state.claimedIslandChests.includes(island.key);
          const doneInIsland = island.stages.filter((s) =>
            state.clearedAdventureKeys.includes(s.key)
          ).length;

          return (
            <section key={island.key} className="ed-card flex flex-col justify-between overflow-hidden">
              <div className={`bg-gradient-to-r ${island.accentGradient} p-5 text-white`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
                    เกาะที่ {island.order} · ม.{island.gradeLevel}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-0.5 text-xs font-semibold">
                    <Star className="h-3.5 w-3.5 text-amber-300" />
                    {doneInIsland}/{island.stages.length} ด่าน
                  </span>
                </div>
                <h2 className="font-display mt-2 text-xl font-semibold">{island.name}</h2>
                <p className="mt-0.5 text-xs text-white/90">{island.subtitle}</p>
              </div>

              <div className="space-y-3 p-5">
                {island.requiredLessonKey && (
                  <div className="flex items-center justify-between rounded-xl border border-[#E1EAFB] bg-[#F8FAFF] px-3 py-2 text-[11px] text-[#5C7299]">
                    <span>แนะนำให้ทบทวนบทเรียนประกอบก่อนลุยเกาะนี้</span>
                    <Link
                      href={`/lessons/${island.requiredLessonKey}`}
                      className="font-semibold text-[#1364E7] hover:underline"
                    >
                      เปิดบทเรียน →
                    </Link>
                  </div>
                )}

                <div className="space-y-2">
                  {island.stages.map((st) => {
                    const cleared = state.clearedAdventureKeys.includes(st.key);
                    return (
                      <div
                        key={st.key}
                        className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 ${
                          cleared ? "border-emerald-200 bg-emerald-50/60" : "border-[#E1EAFB] bg-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-[#092551] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                              {st.code}
                            </span>
                            <span className="text-xs font-semibold text-[#092551]">{st.title}</span>
                          </div>
                          <div className="mt-0.5 text-[11px] text-[#5C7299]">
                            {st.topicTag} · +{st.coinReward} Coins · +{st.xpReward} XP
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => openStage(island, st)}
                          className={
                            cleared
                              ? "inline-flex items-center gap-1 rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                              : "ed-btn-primary !min-h-8 !px-3 !text-xs"
                          }
                        >
                          {cleared ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>เล่นซ้ำ</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-3.5 w-3.5" />
                              <span>เข้าด่าน</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Island Treasure Chest */}
                <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-amber-900">
                    <Gift className="h-5 w-5 text-amber-600" />
                    <span>หีบสมบัติประจำเกาะ (+{island.chestCoins} Coins)</span>
                  </div>

                  {chestClaimed ? (
                    <span className="text-xs font-semibold text-emerald-700">✓ รับสมบัติแล้ว</span>
                  ) : allCleared ? (
                    <button
                      type="button"
                      onClick={() =>
                        claimAdventureReward({
                          kind: "chest",
                          key: island.key,
                          coinReward: island.chestCoins,
                          xpReward: 50,
                          label: `เปิดหีบสมบัติ: ${island.name}`,
                        })
                      }
                      className="rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-400"
                    >
                      เปิดหีบสมบัติ!
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-800/70">
                      <Lock className="h-3.5 w-3.5" />
                      เคลียร์ทุกด่านในเกาะก่อน
                    </span>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Interactive Stage Solver Modal */}
      {activeStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06152E]/65 p-4 backdrop-blur-xs">
          <div className="ed-card max-h-[92vh] w-full max-w-3xl overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#E1EAFB] pb-4">
              <div>
                <div className="text-xs font-semibold text-[#1364E7]">
                  {activeStage.island.name} · ด่าน {activeStage.stage.code}
                </div>
                <h3 className="font-display text-xl font-semibold text-[#092551]">
                  {activeStage.stage.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveStage(null)}
                className="rounded-xl p-1.5 text-[#7485A4] hover:bg-[#F4F7FD] hover:text-[#092551]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-[#D4E4FC] bg-[#F8FAFF] p-4 text-sm text-[#11264A]">
                {activeStage.stage.prompt}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setShowHint((h) => !h)}
                    className="text-xs font-semibold text-amber-700 hover:underline"
                  >
                    {showHint ? "ซ่อนคำใบ้" : "💡 ขอคำใบ้"}
                  </button>
                  {showHint && (
                    <p className="mt-1 rounded-lg bg-amber-50 p-2 text-xs text-amber-900">
                      {activeStage.stage.hint}
                    </p>
                  )}
                </div>
              </div>

              <div className={`overflow-hidden rounded-2xl border ${theme.borderClass} ${theme.bgClass}`}>
                <div className={`flex items-center justify-between px-4 py-2.5 ${theme.barClass}`}>
                  <span className={`font-mono text-xs font-semibold ${theme.textClass}`}>
                    {activeStage.stage.key}.py
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleRun}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-3 py-1 text-xs font-semibold text-white hover:bg-white/25"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Run</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-400"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>ส่งตรวจ & รับ +{activeStage.stage.coinReward} Coins</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={8}
                  spellCheck={false}
                  className={`w-full bg-transparent p-4 font-mono text-sm focus:outline-none ${theme.textClass}`}
                />

                {(stdout !== null || runErr) && (
                  <div className="border-t border-white/10 bg-black/30 p-3 font-mono text-xs text-[#E4EDFF]">
                    <div className="mb-1 flex items-center gap-1 text-emerald-400">
                      <Terminal className="h-3.5 w-3.5" />
                      <span>Output (Test Case 1):</span>
                    </div>
                    <pre className="whitespace-pre-wrap">{runErr || stdout}</pre>
                  </div>
                )}
              </div>

              {gradeRes && (
                <div
                  className={`rounded-xl border p-3.5 text-xs ${
                    gradeRes.passed
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                      : "border-rose-200 bg-rose-50 text-rose-900"
                  }`}
                >
                  <div className="font-semibold">
                    {gradeRes.passed
                      ? "🎉 เคลียร์ด่านสำเร็จ!"
                      : `ยังไม่ผ่าน (${gradeRes.passedCount}/${gradeRes.totalCount})`}
                  </div>
                  {gradeRes.results.map((r, i) => (
                    <div key={i} className="mt-1 font-mono">
                      {r.passed ? "✓" : "✗"} {r.label} → คาดหวัง &quot;{r.expected}&quot; · ได้ &quot;
                      {r.error || r.actual}&quot;
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

