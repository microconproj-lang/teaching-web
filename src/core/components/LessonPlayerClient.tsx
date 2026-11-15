"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ListTree,
  Maximize2,
  Minimize2,
  Play,
  Sparkles,
  Terminal,
} from "lucide-react";
import type { InteractiveLessonDef } from "@/core/config/curriculum";
import { getEditorTheme } from "@/core/config/shop";
import { gradePythonChallenge, runPythonCode, type PythonGradeResult } from "@/core/python/runner";
import { LessonVisualizer } from "@/core/components/LessonVisualizers";
import { BlueprintSlideDeck, LessonResourcesBar } from "@/core/components/BlueprintSlideDeck";
import { usePlatformState } from "@/core/components/PlatformStateProvider";

export function LessonPlayerClient({ lesson }: { lesson: InteractiveLessonDef }) {
  const { state, completeLessonCheck } = usePlatformState();
  const [slideIdx, setSlideIdx] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [theater, setTheater] = useState(false);

  // Quiz state
  const [selectedOpt, setSelectedOpt] = useState<Record<string, number>>({});
  const [quizChecked, setQuizChecked] = useState<Record<string, boolean>>({});

  // Mission IDE state
  const currentSlide = lesson.slides[slideIdx];
  const theme = getEditorTheme(state.equippedThemeKey);
  const [missionCode, setMissionCode] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const s of lesson.slides) {
      if (s.mission) map[s.id] = s.mission.starterCode;
    }
    return map;
  });
  const [hintCount, setHintCount] = useState<Record<string, number>>({});
  const [runStdout, setRunStdout] = useState<string | null>(null);
  const [runErr, setRunErr] = useState<string | null>(null);
  const [gradeRes, setGradeRes] = useState<PythonGradeResult | null>(null);

  const completedChecks = state.lessonChecks[lesson.key] ?? [];

  const goSlide = (idx: number) => {
    setSlideIdx(idx);
    setRunStdout(null);
    setRunErr(null);
    setGradeRes(null);
    setTocOpen(false);
  };

  const handleCheckQuiz = async () => {
    if (!currentSlide.quiz) return;
    const choice = selectedOpt[currentSlide.id];
    if (choice === undefined) return;
    setQuizChecked((p) => ({ ...p, [currentSlide.id]: true }));
    if (choice === currentSlide.quiz.correctIndex) {
      await completeLessonCheck({
        lessonKey: lesson.key,
        checkKey: currentSlide.quiz.checkKey,
        lastSlide: slideIdx,
        coinReward: currentSlide.quiz.coinReward,
        xpReward: 15,
        label: currentSlide.title,
      });
    }
  };

  const handleRunMission = () => {
    if (!currentSlide.mission) return;
    const code = missionCode[currentSlide.id] ?? "";
    const stdinSample = currentSlide.mission.testCases[0]?.stdin ?? [];
    const res = runPythonCode(code, stdinSample);
    setRunStdout(res.stdout.join("\n") || "(ไม่มีข้อความออก)");
    setRunErr(res.error);
  };

  const handleGradeMission = async () => {
    if (!currentSlide.mission) return;
    const code = missionCode[currentSlide.id] ?? "";
    const graded = gradePythonChallenge(code, currentSlide.mission.testCases);
    setGradeRes(graded);
    if (graded.passed) {
      await completeLessonCheck({
        lessonKey: lesson.key,
        checkKey: currentSlide.mission.checkKey,
        lastSlide: slideIdx,
        coinReward: currentSlide.mission.coinReward,
        xpReward: currentSlide.mission.xpReward,
        label: currentSlide.title,
      });
    }
  };

  return (
    <div
      className={
        theater
          ? "fixed inset-0 z-50 flex flex-col bg-[#F4F7FD] p-4 sm:p-6"
          : "space-y-4"
      }
    >
      {/* Theater-style Deep Navy Header Bar (matches lesson.php) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#071B3B] to-[#0A2857] px-5 py-3.5 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            href="/lessons"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-white/10 px-3 text-xs font-semibold text-[#E4EDFF] hover:bg-white/20"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>บทเรียนทั้งหมด</span>
          </Link>
          <div>
            <div className="text-[11px] font-medium text-sky-300">
              {lesson.courseCode ? `${lesson.courseCode} · ` : ""}ม.{lesson.gradeLevel} · หน่วยที่ {lesson.unitNo}
            </div>
            <h1 className="font-display text-base font-semibold sm:text-lg">{lesson.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            สไลด์ {slideIdx + 1} / {lesson.slides.length}
          </span>
          <button
            type="button"
            onClick={() => setTocOpen((v) => !v)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-white/10 px-3 text-xs font-semibold hover:bg-white/20"
          >
            <ListTree className="h-4 w-4" />
            <span className="hidden sm:inline">สารบัญ</span>
          </button>
          <button
            type="button"
            onClick={() => setTheater((t) => !t)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20"
            title={theater ? "ออกจากเต็มจอ" : "โหมดเต็มจอ (Theater)"}
          >
            {theater ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Segmented Slide Progress Bar */}
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${lesson.slides.length}, minmax(0, 1fr))` }}>
        {lesson.slides.map((s, idx) => {
          const checkKey = s.quiz?.checkKey ?? s.mission?.checkKey;
          const isCleared = checkKey ? completedChecks.includes(checkKey) : idx <= slideIdx;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => goSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === slideIdx
                  ? "bg-[#1364E7] ring-2 ring-[#1364E7]/25"
                  : isCleared
                    ? "bg-emerald-500"
                    : "bg-[#D4E2FA] hover:bg-[#9FC0F8]"
              }`}
              title={`สไลด์ ${idx + 1}: ${s.title}`}
            />
          );
        })}
      </div>

      {/* Optional Table of Contents Drawer */}
      {tocOpen && (
        <div className="ed-card grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-4">
          {lesson.slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goSlide(idx)}
              className={`rounded-xl border px-3 py-2 text-left text-xs font-medium transition ${
                idx === slideIdx
                  ? "border-[#1364E7] bg-[#EFF6FF] font-semibold text-[#092551]"
                  : "border-[#E1EAFB] bg-white text-[#5C7299] hover:bg-[#F8FAFF]"
              }`}
            >
              <span className="mr-1.5 font-mono text-[#1364E7]">{idx + 1}.</span>
              {s.title}
            </button>
          ))}
        </div>
      )}

      {/* Slide Content Card */}
      <section className="ed-card flex-1 overflow-y-auto p-6 sm:p-8">
        <div className="mx-auto max-w-4xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-[#1364E7]/10 px-3 py-1 text-xs font-semibold text-[#0A5FE6]">
              {currentSlide.kind === "concept"
                ? "เนื้อหาแนวคิด"
                : currentSlide.kind === "visualizer"
                  ? "Interactive Visualizer"
                  : currentSlide.kind === "quiz"
                    ? "แบบฝึกเช็กความเข้าใจ"
                    : "ภารกิจลงมือเขียนโค้ด"}
            </span>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-[#092551] sm:text-3xl">
              {currentSlide.title}
            </h2>
            {currentSlide.subtitle && (
              <p className="mt-1 text-sm text-[#5C7299]">{currentSlide.subtitle}</p>
            )}
          </div>

          <div className="space-y-3 text-sm leading-relaxed text-[#11264A] sm:text-base">
            {currentSlide.body.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {currentSlide.imageUrl && (
            <figure className="overflow-hidden rounded-2xl border border-[#DCE7FA] bg-[#081A37] p-2.5 shadow-sm">
              <img
                src={currentSlide.imageUrl}
                alt={currentSlide.imageCaption ?? currentSlide.title}
                className="mx-auto max-h-[360px] w-auto rounded-xl object-contain"
              />
              {currentSlide.imageCaption && (
                <figcaption className="mt-2 px-2 text-center text-xs font-medium text-[#BFD4F5]">
                  {currentSlide.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {currentSlide.codeSnippet && (
            <pre className="overflow-x-auto rounded-2xl border border-[#3F6EA8] bg-[#081A37] p-4 font-mono text-sm leading-relaxed text-[#E4EDFF]">
              <code>{currentSlide.codeSnippet}</code>
            </pre>
          )}

          {currentSlide.callout && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
              💡 <strong>เคล็ดลับ:</strong> {currentSlide.callout}
            </div>
          )}

          {/* Visualizer */}
          {currentSlide.visualizerType && (
            <LessonVisualizer type={currentSlide.visualizerType} />
          )}

          {/* Quiz */}
          {currentSlide.quiz && (() => {
            const q = currentSlide.quiz;
            const picked = selectedOpt[currentSlide.id];
            const isChecked = quizChecked[currentSlide.id];
            const isCorrect = isChecked && picked === q.correctIndex;
            const alreadyDone = completedChecks.includes(q.checkKey);

            return (
              <div className="space-y-4 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
                <div className="font-display text-base font-semibold text-[#092551]">
                  {q.question}
                </div>
                <div className="space-y-2">
                  {q.options.map((opt, idx) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setSelectedOpt((p) => ({ ...p, [currentSlide.id]: idx }));
                        setQuizChecked((p) => ({ ...p, [currentSlide.id]: false }));
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                        picked === idx
                          ? "border-[#1364E7] bg-[#EFF6FF] font-semibold text-[#092551]"
                          : "border-[#E1EAFB] bg-white text-[#11264A] hover:border-[#9FC0F8]"
                      }`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCheckQuiz}
                    disabled={picked === undefined}
                    className="ed-btn-primary !min-h-10 !px-5 !text-xs"
                  >
                    <span>ตรวจคำตอบ (+{q.coinReward} Coins)</span>
                  </button>
                  {alreadyDone && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      เก็บคำถามข้อนี้แล้ว
                    </span>
                  )}
                </div>

                {isChecked && (
                  <div
                    className={`rounded-xl border p-3.5 text-xs font-medium ${
                      isCorrect
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : "border-rose-200 bg-rose-50 text-rose-900"
                    }`}
                  >
                    {isCorrect ? "✅ ถูกต้อง! " : "❌ ยังไม่ตรง ลองดูคำอธิบาย: "}
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Inline Coding Mission */}
          {currentSlide.mission && (() => {
            const m = currentSlide.mission;
            const usedHints = hintCount[currentSlide.id] ?? 0;
            const alreadyDone = completedChecks.includes(m.checkKey);

            return (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-4 text-sm text-[#11264A]">
                  <strong>โจทย์:</strong> {m.prompt}
                </div>

                <div className={`overflow-hidden rounded-2xl border ${theme.borderClass} ${theme.bgClass} shadow-lg`}>
                  <div className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 ${theme.barClass}`}>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                      <span className={`ml-2 font-mono text-xs font-semibold ${theme.textClass}`}>
                        {m.filename}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setHintCount((p) => ({
                            ...p,
                            [currentSlide.id]: Math.min(m.hints.length, (p[currentSlide.id] ?? 0) + 1),
                          }))
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-amber-300 hover:bg-white/20"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span>ขอคำใบ้ ({usedHints}/{m.hints.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRunMission}
                        className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-3 py-1 text-xs font-semibold text-white hover:bg-white/25"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span>Run Code</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleGradeMission}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-400"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>ตรวจภารกิจ (+{m.coinReward} Coins)</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={missionCode[currentSlide.id] ?? ""}
                    onChange={(e) =>
                      setMissionCode((p) => ({ ...p, [currentSlide.id]: e.target.value }))
                    }
                    rows={7}
                    spellCheck={false}
                    className={`w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed focus:outline-none ${theme.textClass}`}
                  />

                  {(runStdout !== null || runErr) && (
                    <div className="border-t border-white/10 bg-black/30 p-3 font-mono text-xs text-[#E4EDFF]">
                      <div className="mb-1 flex items-center gap-1.5 text-emerald-400">
                        <Terminal className="h-3.5 w-3.5" />
                        <span>Output (ตัวอย่างทดสอบที่ 1):</span>
                      </div>
                      <pre className="whitespace-pre-wrap">{runErr ? runErr : runStdout}</pre>
                    </div>
                  )}
                </div>

                {usedHints > 0 && (
                  <div className="space-y-1 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                    {m.hints.slice(0, usedHints).map((h, i) => (
                      <div key={i}>
                        <strong>คำใบ้ {i + 1}:</strong> {h}
                      </div>
                    ))}
                  </div>
                )}

                {gradeRes && (
                  <div
                    className={`rounded-2xl border p-4 text-xs ${
                      gradeRes.passed
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : "border-rose-200 bg-rose-50 text-rose-900"
                    }`}
                  >
                    <div className="font-semibold">
                      {gradeRes.passed
                        ? `ผ่านครบ ${gradeRes.passedCount}/${gradeRes.totalCount} กรณีทดสอบ!`
                        : `ผ่าน ${gradeRes.passedCount}/${gradeRes.totalCount} กรณีทดสอบ`}
                    </div>
                    <ul className="mt-2 space-y-1">
                      {gradeRes.results.map((r, i) => (
                        <li key={i} className="font-mono">
                          {r.passed ? "✓" : "✗"} {r.label} → คาดหวัง &quot;{r.expected}&quot; · ได้ &quot;{r.error || r.actual}&quot;
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {alreadyDone && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>บันทึกการผ่านภารกิจนี้แล้ว</span>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Theater Footer Controls */}
      <div className="flex items-center justify-between rounded-2xl border border-[#E1EAFB] bg-white px-5 py-3 shadow-xs">
        <button
          type="button"
          disabled={slideIdx === 0}
          onClick={() => goSlide(slideIdx - 1)}
          className="ed-btn-secondary !min-h-10 !px-4 !text-xs disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>สไลด์ก่อนหน้า</span>
        </button>

        <div className="text-xs font-medium text-[#5C7299]">
          ทำครบทุกกิจกรรมเพื่อรับ Coins & เพิ่มความสนิทกับสัตว์เลี้ยง
        </div>

        <button
          type="button"
          disabled={slideIdx === lesson.slides.length - 1}
          onClick={() => goSlide(slideIdx + 1)}
          className="ed-btn-primary !min-h-10 !px-4 !text-xs disabled:opacity-40"
        >
          <span>สไลด์ถัดไป</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {lesson.blueprintSlides && lesson.blueprintSlides.length > 0 && (
        <BlueprintSlideDeck
          slides={lesson.blueprintSlides}
          lessonTitle={lesson.title}
          courseCode={lesson.courseCode}
        />
      )}

      <LessonResourcesBar resources={lesson.resources} />
    </div>
  );
}

