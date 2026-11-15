"use client";

import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, Compass, Crown, ShieldCheck, Sparkles } from "lucide-react";
import { ADVENTURE_ISLANDS, INTERACTIVE_LESSONS, LAB_PROBLEMS } from "@/core/config/curriculum";
import { BADGE_DEFINITIONS } from "@/core/grading/badges";
import { getPlayerLevelInfo, RANK_TIERS } from "@/core/grading/level";
import { usePlatformState } from "@/core/components/PlatformStateProvider";

export function ProgressDashboardClient() {
  const { state, resetGuestProgress } = usePlatformState();
  const levelInfo = getPlayerLevelInfo(state.xp);

  // คำนวณ Mastery % จากกิจกรรม/ภารกิจที่ผ่านจริงเท่านั้น (ไม่นับการเปิดดูสไลด์เฉยๆ)
  const totalLessonChecks = INTERACTIVE_LESSONS.reduce(
    (sum, l) => sum + l.slides.filter((s) => s.quiz || s.mission).length,
    0
  );
  const doneLessonChecks = Object.values(state.lessonChecks).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  const totalAdventure = ADVENTURE_ISLANDS.reduce((sum, i) => sum + i.stages.length, 0);
  const totalTrackable = totalLessonChecks + LAB_PROBLEMS.length + totalAdventure;
  const totalDone =
    doneLessonChecks + state.solvedLabKeys.length + state.clearedAdventureKeys.length;
  const masteryPct = totalTrackable > 0 ? Math.round((totalDone / totalTrackable) * 100) : 0;

  // หาบทเรียนที่ยังไม่ผ่านเพื่อชี้ไปปุ่ม "ทำต่อเลย"
  const nextLesson =
    INTERACTIVE_LESSONS.find((l) => {
      const checks = l.slides.filter((s) => s.quiz || s.mission).length;
      const done = (state.lessonChecks[l.key] ?? []).length;
      return done < checks;
    }) ?? INTERACTIVE_LESSONS[0];

  return (
    <div className="space-y-6">
      {/* Hero Summary */}
      <section className="ed-hero p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0A5FE6]">
              <Award className="h-3.5 w-3.5" />
              <span>ความก้าวหน้าและยศการเรียนรู้</span>
            </div>
            <h1 className="font-display text-2xl font-semibold text-[#092551] sm:text-3xl">
              {state.fullName} · {levelInfo.rankTitle} (LV {levelInfo.level})
            </h1>
            <p className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-1 text-xs font-medium text-amber-900">
              <ShieldCheck className="h-4 w-4 text-amber-600" />
              <span>
                เก็บแบบฝึกและภารกิจให้ครบเพื่อเลื่อนขั้น · การเปิดดูสไลด์อย่างเดียวไม่เพิ่ม % ความก้าวหน้า
              </span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="rounded-2xl border border-[#D4E4FC] bg-white px-6 py-4 text-right shadow-xs">
              <div className="text-xs text-[#5C7299]">ความสำเร็จโดยรวม (Mastery)</div>
              <div className="font-display text-3xl font-bold text-[#1364E7]">{masteryPct}%</div>
              <div className="text-xs text-[#5C7299]">
                ผ่านแล้ว {totalDone} / {totalTrackable} ภารกิจจริง
              </div>
            </div>

            {!state.authenticated && (
              <button
                type="button"
                onClick={resetGuestProgress}
                className="text-xs font-semibold text-[#5C7299] underline hover:text-rose-600"
              >
                รีเซ็ตข้อมูลทดลอง (Guest)
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Next Action + XP Bar */}
      <div className="grid gap-5 lg:grid-cols-12">
        <section className="ed-card space-y-4 p-6 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-[#092551]">
              ทำต่อเลย · ภารกิจถัดไปของเธอ
            </h2>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${levelInfo.rankBadgeClass}`}>
              LV {levelInfo.level} · {state.xp} XP
            </span>
          </div>

          <div className="rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
            <div className="text-xs font-semibold text-[#0A5FE6]">
              ม.{nextLesson.gradeLevel} · หน่วยที่ {nextLesson.unitNo}
            </div>
            <div className="font-display mt-1 text-xl font-semibold text-[#092551]">
              {nextLesson.title}
            </div>
            <p className="mt-1 text-xs text-[#5C7299]">{nextLesson.subtitle}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/lessons/${nextLesson.key}`} className="ed-btn-primary !min-h-10 !text-xs">
                <span>ทำต่อเลย</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              {state.authenticated && (
                <Link href="/portfolio" className="ed-btn-secondary !min-h-10 !text-xs">
                  ดูงานที่ครูมอบหมาย & ตราปักทางการ →
                </Link>
              )}
            </div>
          </div>

          {/* 6 Rank Tiers Roadmap */}
          <div>
            <div className="mb-2 text-xs font-semibold text-[#5C7299]">ระดับยศสายวิทยาการคำนวณ (6 ระดับ)</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {RANK_TIERS.map((tier) => {
                const unlocked = levelInfo.level >= tier.minLevel * 2 - 1 || tier.minLevel === 1;
                return (
                  <div
                    key={tier.title}
                    className={`rounded-xl border px-3 py-2 text-xs ${
                      unlocked
                        ? "border-[#D4E4FC] bg-white font-semibold text-[#092551]"
                        : "border-dashed border-[#D4E2FA] bg-[#F8FAFF] text-[#7485A4]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Crown className={`h-3.5 w-3.5 ${unlocked ? "text-amber-500" : "text-slate-300"}`} />
                      <span>{tier.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Per-Lesson Checklist Breakdown */}
        <section className="ed-card space-y-3 p-6 lg:col-span-5">
          <h2 className="font-display text-lg font-semibold text-[#092551]">
            ความคืบหน้ารายบทเรียน ({INTERACTIVE_LESSONS.length} บท)
          </h2>
          <div className="max-h-[420px] space-y-2.5 overflow-y-auto pr-1">
            {INTERACTIVE_LESSONS.map((l) => {
              const checks = l.slides.filter((s) => s.quiz || s.mission);
              const doneKeys = state.lessonChecks[l.key] ?? [];
              const allDone = checks.length > 0 && doneKeys.length >= checks.length;
              return (
                <Link
                  key={l.key}
                  href={`/lessons/${l.key}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#E1EAFB] bg-[#F8FAFF] p-3 hover:border-[#9FC0F8]"
                >
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold text-[#092551]">
                      {l.courseCode ? `${l.courseCode} · ` : ""}ม.{l.gradeLevel} · {l.title}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      {checks.map((c) => {
                        const k = c.quiz?.checkKey ?? c.mission?.checkKey ?? "";
                        const ok = doneKeys.includes(k);
                        return (
                          <span
                            key={k}
                            className={`h-2.5 w-5 rounded-full ${ok ? "bg-emerald-500" : "bg-[#D4E2FA]"}`}
                          />
                        );
                      })}
                      <span className="ml-1 font-mono text-[11px] text-[#5C7299]">
                        {doneKeys.length}/{checks.length}
                      </span>
                    </div>
                  </div>
                  {allDone ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#1364E7]" />
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* Badges Shelf */}
      <section className="ed-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-[#092551]">
            เหรียญรางวัลแห่งความพยายาม (Badges)
          </h2>
          <Link href="/adventure" className="inline-flex items-center gap-1 text-xs font-semibold text-[#1364E7] hover:underline">
            <Compass className="h-3.5 w-3.5" />
            ไปลุยเก็บดาวเพิ่มในแผนที่ล่าสมบัติ →
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {BADGE_DEFINITIONS.map((b) => (
            <div key={b.key} className="rounded-2xl border border-[#E1EAFB] bg-[#F8FAFF] p-4">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-[#1364E7] shadow-xs">
                  {b.code}
                </span>
                <span className="text-xs font-semibold text-amber-600">+{b.xpBonus} XP</span>
              </div>
              <div className="font-display mt-2 flex items-center gap-1.5 text-sm font-semibold text-[#092551]">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>{b.title}</span>
              </div>
              <p className="mt-1 text-xs text-[#5C7299]">{b.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

