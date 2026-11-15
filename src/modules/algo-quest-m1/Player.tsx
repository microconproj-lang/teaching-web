"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  ChallengeProgressView,
  ModulePlayerProps,
  ProcessTelemetry,
} from "@/core/modules/contract";
import { findWorldForModule } from "@/core/config/worlds";
import { getBadgeDefinition } from "@/core/grading/badges";
import {
  CheckingSeamButton,
  HintKnots,
  StageClearSequence,
  StitchTile,
  WovenBadge,
} from "@/core/components/LoomComponents";
import { PixelIcon } from "@/core/components/PixelSprite";

interface BlockItem {
  id: string;
  text: string;
}

interface ChallengeConfig {
  story?: string;
  blocks?: BlockItem[];
  hint?: string;
  hints?: string[];
  microQuestion?: {
    prompt: string;
    options: string[];
  };
}

interface SubmitResult {
  score: number;
  stars: number;
  passed: boolean;
  feedback: string;
  xpAwarded?: number;
  newBadges?: { key: string; code: string; title: string; iconKey: string; xpBonus: number }[];
}

export default function AlgoQuestPlayer({
  assignmentId,
  moduleKey,
  challenges,
  disablePaste,
  focusMode,
  progress,
  initialChallengeId,
  backHref = "/dashboard",
  unlockAll = false,
}: ModulePlayerProps) {
  const [progressMap, setProgressMap] = useState<Record<string, ChallengeProgressView>>(
    progress ?? {}
  );

  const world = findWorldForModule(moduleKey);

  const initialIdx = useMemo(() => {
    if (initialChallengeId) {
      const matchIdx = challenges.findIndex(
        (c) => c.id === initialChallengeId || c.challengeKey === initialChallengeId
      );
      if (matchIdx !== -1) return matchIdx;
    }
    const firstUnfinished = challenges.findIndex((c) => !(progress ?? {})[c.id]?.passed);
    return firstUnfinished === -1 ? 0 : firstUnfinished;
  }, [challenges, initialChallengeId, progress]);

  const [activeIndex, setActiveIndex] = useState(initialIdx);
  const challenge = challenges[activeIndex];
  const cfg = (challenge?.config ?? {}) as ChallengeConfig;

  const initialBlocks = useMemo(() => cfg.blocks ?? [], [cfg.blocks]);
  const [orderedBlocks, setOrderedBlocks] = useState<BlockItem[]>(initialBlocks);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [hintsUsed, setHintsUsed] = useState(0);
  const [selectedMicro, setSelectedMicro] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [dryRunOutput, setDryRunOutput] = useState<string[] | null>(null);
  const [offlineSaved, setOfflineSaved] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [mobileMissionOpen, setMobileMissionOpen] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const startedAtRef = useRef<number>(Date.now());
  const telemetryRef = useRef<Omit<ProcessTelemetry, "durationSec" | "hintsUsed">>({
    keystrokes: 0,
    pasteChars: 0,
    pasteEvents: 0,
    tabSwitches: 0,
    runCount: 0,
  });

  const draftStorageKey = challenge ? `laicode-draft:${assignmentId}:${challenge.id}` : "";

  const hintSteps = useMemo(() => {
    if (cfg.hints && cfg.hints.length > 0) return cfg.hints.slice(0, 3);
    const mainHint = cfg.hint ?? "สังเกตลำดับเริ่มต้นกับเงื่อนไขก่อนจบขั้นตอน";
    return [
      "ปมที่ 1 (แนวคิด): แยกขั้นเตรียมข้อมูลหรือจุดเริ่มต้นออกจากขั้นทำซ้ำและจุดจบ",
      `ปมที่ 2 (โครงทางแก้): ${mainHint}`,
      "ปมที่ 3 (ใกล้เฉลย): ไล่อ่านคำสั่งจากบรรทัดแรกถึงบรรทัดสุดท้ายทีละก้าว แล้วเช็กว่าไม่มีคำสั่งใดสลับก่อน-หลัง",
    ];
  }, [cfg.hint, cfg.hints]);

  // โหลดแบบร่างจากเครื่องเมื่อเปิดด่าน (รองรับเน็ตหลุด)
  useEffect(() => {
    let nextBlocks = initialBlocks;
    let restored = false;

    if (draftStorageKey && initialBlocks.length > 0) {
      try {
        const raw = localStorage.getItem(draftStorageKey);
        if (raw) {
          const savedIds = JSON.parse(raw) as string[];
          const byId = new Map(initialBlocks.map((b) => [b.id, b]));
          const mapped = savedIds
            .map((id) => byId.get(id))
            .filter((x): x is BlockItem => Boolean(x));
          if (mapped.length === initialBlocks.length) {
            nextBlocks = mapped;
            restored = true;
          }
        }
      } catch {
        // ข้ามหากอ่าน localStorage ไม่ได้
      }
    }

    setOrderedBlocks(nextBlocks);
    setHasDraft(restored);
    setOfflineSaved(false);
    setDryRunOutput(null);
    setResult(null);
    setHintsUsed(0);
    setSelectedMicro("");
    setDragIndex(null);
    setDragOverIndex(null);
    startedAtRef.current = Date.now();
    telemetryRef.current = {
      keystrokes: 0,
      pasteChars: 0,
      pasteEvents: 0,
      tabSwitches: 0,
      runCount: 0,
    };
  }, [challenge?.id, draftStorageKey, initialBlocks]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        telemetryRef.current.tabSwitches += 1;
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  if (!challenge) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center">
        <p className="text-base text-ink-2">ยังไม่มีด่านในชุดภารกิจนี้</p>
        <Link href={backHref} className="btn-notch notch mt-4">
          กลับแผนที่ผ้า
        </Link>
      </div>
    );
  }

  const isUnlocked = (idx: number) =>
    unlockAll || idx === 0 || Boolean(progressMap[challenges[idx - 1]?.id]?.passed);

  const persistDraft = (blocks: BlockItem[]) => {
    if (!draftStorageKey) return;
    try {
      localStorage.setItem(draftStorageKey, JSON.stringify(blocks.map((b) => b.id)));
      setHasDraft(true);
    } catch {
      // ignore storage quota errors
    }
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= orderedBlocks.length || fromIndex === toIndex) return;
    const next = [...orderedBlocks];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setOrderedBlocks(next);
    setDryRunOutput(null);
    telemetryRef.current.keystrokes += 1;
    persistDraft(next);
  };

  const resetOrder = () => {
    setOrderedBlocks(initialBlocks);
    setResult(null);
    setDryRunOutput(null);
    setOfflineSaved(false);
    if (draftStorageKey) {
      try {
        localStorage.removeItem(draftStorageKey);
      } catch {
        // ignore
      }
    }
    setHasDraft(false);
  };

  const handleDryRun = () => {
    telemetryRef.current.runCount += 1;
    setDryRunOutput(
      orderedBlocks.map((b, i) => `${i + 1}. ${b.text}`)
    );
  };

  const submitAnswer = async (microOptionOverride?: string) => {
    setSubmitting(true);
    setOfflineSaved(false);
    telemetryRef.current.runCount += 1;
    const durationSec = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
    const chosenMicro = microOptionOverride ?? selectedMicro;

    const payload = {
      assignmentId,
      challengeId: challenge.id,
      evidence: {
        answer: orderedBlocks.map((b) => b.id),
        telemetry: { ...telemetryRef.current, durationSec, hintsUsed },
        microCheck: cfg.microQuestion
          ? {
              question: cfg.microQuestion.prompt,
              selectedOption: chosenMicro,
              answeredCorrect: false,
            }
          : undefined,
      },
    };

    try {
      const res = await fetch(`/api/modules/${moduleKey}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({
          score: 0,
          stars: 0,
          passed: false,
          feedback: data.error ?? "ส่งคำตอบไม่สำเร็จ ลองกดส่งอีกครั้ง",
        });
        return;
      }

      const r = data as SubmitResult;
      setResult(r);
      if (r.passed) {
        if (draftStorageKey) {
          try {
            localStorage.removeItem(draftStorageKey);
          } catch {
            // ignore
          }
        }
        setHasDraft(false);
        setProgressMap((prev) => ({
          ...prev,
          [challenge.id]: {
            passed: true,
            bestStars: Math.max(prev[challenge.id]?.bestStars ?? 0, r.stars),
          },
        }));
      }
    } catch {
      persistDraft(orderedBlocks);
      setOfflineSaved(true);
      setResult({
        score: 0,
        stars: 0,
        passed: false,
        feedback: "เน็ตหลุด คำตอบถูกเก็บไว้ในเครื่องแล้ว กดส่งอีกครั้งเมื่อกลับมาออนไลน์",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const passedStagesCount = challenges.filter((c) => progressMap[c.id]?.passed).length;
  const remainingStitches = Math.max(0, challenges.length - passedStagesCount);
  const progressPct =
    challenges.length > 0 ? Math.round((passedStagesCount / challenges.length) * 100) : 0;
  const stageCode = `${world.order}-${activeIndex + 1}`;
  const hasNextChallenge = activeIndex < challenges.length - 1;

  return (
    <div className="min-h-screen bg-[#F4F7FD] text-[#092551]">
      {/* แถบหัวด่านสไตล์ Modern EdTech */}
      <header className="sticky top-0 z-20 border-b border-[#DCE7FA] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex shrink-0 items-center rounded-xl bg-gradient-to-r from-[#1364E7] to-[#227FF5] px-2.5 py-1 text-xs font-bold text-white shadow-xs">
              ด่าน {stageCode}
            </span>
            <h1 className="truncate font-display text-lg font-bold sm:text-xl">
              {challenge.title}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            {/* ตัวชี้วัดคำใบ้ 3 ระดับ */}
            <div
              className="hidden items-center gap-2 rounded-full bg-[#F8FAFF] px-3 py-1.5 ring-1 ring-[#E1EAFB] sm:flex"
              aria-label={`คำใบ้ ใช้ไปแล้ว ${hintsUsed} จาก 3 ครั้ง`}
            >
              <span className="text-xs font-semibold text-[#5C7299]">คำใบ้</span>
              {[1, 2, 3].map((k) => (
                <span
                  key={k}
                  className={`inline-flex h-3 w-3 rounded-full border ${
                    k <= hintsUsed
                      ? "border-[#1364E7] bg-[#1364E7]"
                      : "border-[#C8D9F6] bg-white"
                  }`}
                />
              ))}
            </div>

            <Link
              href={backHref}
              className="ed-btn-secondary min-h-10 px-4 text-sm"
            >
              <span>ออกจากการฝึก</span>
            </Link>
          </div>
        </div>

        {/* แถบความก้าวหน้า */}
        <div className="border-t border-[#EBF2FE] bg-[#F8FAFF]">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 text-xs text-[#5C7299]">
            <span className="font-medium">
              {remainingStitches === 0
                ? "ผ่านครบทุกด่านในชุดนี้แล้ว!"
                : `เหลืออีก ${remainingStitches} ด่านในชุดภารกิจนี้`}
            </span>
            <div className="flex items-center gap-3">
              {hasDraft && !offlineSaved && <span className="text-[#1364E7]">บันทึกร่างอัตโนมัติ</span>}
              {focusMode && <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 font-semibold text-[#1364E7]">โหมดตั้งสมาธิ</span>}
              {disablePaste && <span className="rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-800">ห้ามวางข้อความจากภายนอก</span>}
            </div>
          </div>
          <div className="h-1.5 w-full bg-[#E8F1FE]">
            <div
              className="h-full rounded-r-full bg-gradient-to-r from-[#1364E7] to-emerald-500 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6">
        {/* แถบเลือกด่าน */}
        <nav aria-label="ด่านในชุดภารกิจนี้" className="overflow-x-auto pb-1">
          <ol className="flex min-w-max items-center gap-2.5">
            {challenges.map((ch, idx) => {
              const unlocked = isUnlocked(idx);
              const prog = progressMap[ch.id];
              const isCurrent = idx === activeIndex;
              const tileStatus = !unlocked
                ? "locked"
                : prog?.passed
                  ? "passed"
                  : isCurrent
                    ? "active"
                    : "open";
              const stars = Math.min(3, Math.max(0, prog?.bestStars ?? 0)) as 0 | 1 | 2 | 3;

              return (
                <li key={ch.id}>
                  <button
                    type="button"
                    disabled={!unlocked}
                    onClick={() => setActiveIndex(idx)}
                    className={`flex min-h-12 cursor-pointer items-center gap-2.5 rounded-2xl border px-3 py-1.5 text-left transition disabled:cursor-not-allowed disabled:opacity-55 ${
                      isCurrent
                        ? "border-[#1364E7] bg-[#EFF6FF] shadow-xs ring-2 ring-[#1364E7]/20"
                        : "border-[#DCE7FA] bg-white hover:border-[#9FC0F8]"
                    }`}
                  >
                    <StitchTile
                      status={tileStatus}
                      stars={stars}
                      worldColor={world.colorHex}
                      size={30}
                    />
                    <span className="text-xs font-bold text-[#092551]">
                      {world.order}-{idx + 1}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* แจ้งเตือนเน็ตหลุด */}
        {offlineSaved && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
          >
            <div className="flex items-center gap-2">
              <PixelIcon name="warn" size={18} />
              <span>
                อินเทอร์เน็ตขาดการเชื่อมต่อ คำตอบถูกเก็บไว้ในเครื่องแล้ว กดส่งอีกครั้งเมื่อกลับมาออนไลน์
              </span>
            </div>
          </div>
        )}

        {/* มือถือ: ปุ่มดึง/พับภารกิจ */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMissionOpen((v) => !v)}
            className="ed-btn-secondary w-full justify-between"
          >
            <span>รายละเอียดภารกิจและคำใบ้</span>
            <PixelIcon name={mobileMissionOpen ? "up" : "down"} size={16} />
          </button>
        </div>

        {/* โครง 2 คอลัมน์ */}
        <div className="grid items-start gap-6 lg:grid-cols-12">
          <aside
            className={`ed-card space-y-5 p-5 lg:col-span-4 ${
              mobileMissionOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div>
              <h2 className="font-display text-lg font-bold text-[#092551]">โจทย์ภารกิจ</h2>
              {cfg.story && (
                <p className="mt-2 text-sm leading-relaxed text-[#11264A]">{cfg.story}</p>
              )}
            </div>

            <div className="border-t border-[#EBF2FE] pt-4">
              <h3 className="font-display text-sm font-bold text-[#092551]">เป้าหมายที่ต้องทำให้ผ่าน</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs text-[#5C7299]">
                <li>เรียงลำดับขั้นตอนคำสั่งให้ทำงานได้ตามลำดับที่ถูกต้อง</li>
                <li>ตอบคำถามสั้นท้ายด่านและใช้คำใบ้ไม่เกิน 1 ครั้งเพื่อรับ 3 ดาว</li>
              </ul>
            </div>

            <div className="space-y-3 border-t border-[#EBF2FE] pt-4">
              <HintKnots
                usedCount={hintsUsed}
                onRequestHint={(knotNo) => setHintsUsed(knotNo)}
              />

              {hintsUsed > 0 && (
                <div className="space-y-2 rounded-2xl border border-[#DCE7FA] bg-[#F8FAFF] p-3.5 text-sm text-[#092551]">
                  {hintSteps.slice(0, hintsUsed).map((text, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {text}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* พื้นที่จัดลำดับบล็อกคำสั่ง */}
          <section className="ed-card p-5 sm:p-6 lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EBF2FE] pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#092551]">พื้นที่จัดลำดับอัลกอริทึม</h2>
                <p className="text-xs text-[#5C7299]">
                  ลากบล็อกคำสั่งหรือกดปุ่มลูกศรขึ้น–ลง เพื่อจัดลำดับการทำงานตั้งแต่ขั้นแรกจนจบ
                </p>
              </div>
              <button
                type="button"
                onClick={resetOrder}
                className="ed-btn-secondary min-h-10 px-3.5 text-xs"
              >
                <PixelIcon name="clear" size={14} />
                <span>เริ่มเรียงใหม่</span>
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {orderedBlocks.map((block, index) => {
                const isDragging = dragIndex === index;
                const isDragOver = dragOverIndex === index && dragIndex !== index;

                return (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverIndex(index);
                    }}
                    onDragLeave={() => {
                      if (dragOverIndex === index) setDragOverIndex(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragIndex !== null) moveBlock(dragIndex, index);
                      setDragIndex(null);
                      setDragOverIndex(null);
                    }}
                    onDragEnd={() => {
                      setDragIndex(null);
                      setDragOverIndex(null);
                    }}
                    className={`flex cursor-grab items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 transition active:cursor-grabbing ${
                      isDragging
                        ? "border-dashed border-[#9FC0F8] bg-[#EFF6FF] opacity-60"
                        : "border-[#DCE7FA] bg-white shadow-xs hover:border-[#227FF5]"
                    } ${isDragOver ? "ring-2 ring-[#1364E7]" : ""}`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-xs font-bold text-[#1364E7]">
                        {index + 1}
                      </span>
                      <span className="font-code text-sm font-semibold text-[#092551] sm:text-base">
                        {block.text}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => moveBlock(index, index - 1)}
                        disabled={index === 0}
                        aria-label={`เลื่อนขั้นตอน ${block.text} ขึ้น`}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#DCE7FA] bg-[#F8FAFF] text-[#092551] hover:border-[#1364E7] hover:bg-[#EFF6FF] disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m18 15-6-6-6 6" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, index + 1)}
                        disabled={index === orderedBlocks.length - 1}
                        aria-label={`เลื่อนขั้นตอน ${block.text} ลง`}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#DCE7FA] bg-[#F8FAFF] text-[#092551] hover:border-[#1364E7] hover:bg-[#EFF6FF] disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* แถบผลลัพธ์ + ปุ่มลองรัน / ส่ง */}
            <div className="mt-6 border-t border-[#EBF2FE] pt-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <h3 className="font-display text-base font-bold text-[#092551]">ผลลัพธ์การจำลอง</h3>
                  {dryRunOutput ? (
                    <ol className="space-y-1 rounded-2xl bg-[#081A37] p-4 font-code text-xs text-[#64DCA2]">
                      {dryRunOutput.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ol>
                  ) : result && !result.passed ? (
                    <div
                      role="status"
                      className="rounded-2xl border border-red-200 bg-red-50 p-3.5 text-sm font-semibold text-red-700"
                    >
                      ยังไม่ผ่าน: {result.feedback}
                    </div>
                  ) : (
                    <p className="text-xs text-[#5C7299]">
                      กด &ldquo;ลองรันลำดับ&rdquo; เพื่อไล่ตรวจสอบทีละบรรทัด หรือกด &ldquo;ส่งคำตอบ&rdquo; เมื่อมั่นใจแล้ว
                    </p>
                  )}
                </div>

                <div className="flex w-full shrink-0 flex-wrap gap-2.5 sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDryRun}
                    className="ed-btn-secondary flex-1 sm:flex-none"
                  >
                    <PixelIcon name="run" size={16} />
                    <span>ลองรันลำดับ</span>
                  </button>

                  <CheckingSeamButton
                    loading={submitting}
                    label="ส่งคำตอบ"
                    loadingLabel="กำลังตรวจ"
                    onClick={() => submitAnswer()}
                    className="flex-1 sm:flex-none"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ผลลัพธ์เมื่อผ่านด่าน */}
        {result?.passed && (
          <section className="space-y-4">
            <StageClearSequence
              stars={Math.max(1, Math.min(3, result.stars)) as 1 | 2 | 3}
              xpAwarded={result.xpAwarded ?? challenge.xpReward}
              feedback={result.feedback}
              worldColor={world.colorHex}
              hasNextStage={hasNextChallenge}
              onNextStage={() => setActiveIndex((idx) => idx + 1)}
            />

            {result.newBadges && result.newBadges.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {result.newBadges.map((b) => {
                  const def = getBadgeDefinition(b.key);
                  if (!def) return null;
                  return <WovenBadge key={b.key} badge={def} unlocked={true} size="md" />;
                })}
              </div>
            )}
          </section>
        )}

        {/* แผงคำถามยืนยันความเข้าใจ */}
        {cfg.microQuestion && (result?.passed || selectedMicro !== "") && (
          <section
            aria-labelledby="micro-check-heading"
            className="ed-card space-y-4 border-[#9FC0F8] bg-[#EFF6FF]/60 p-5 sm:p-6"
          >
            <div>
              <h2 id="micro-check-heading" className="font-display text-lg font-bold text-[#092551]">
                ตอบอีก 1 ข้อเพื่อยืนยันความเข้าใจ
              </h2>
              <p className="mt-1 text-sm font-semibold text-[#11264A]">
                {cfg.microQuestion.prompt}
              </p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {cfg.microQuestion.options.map((opt) => {
                const isSel = selectedMicro === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedMicro(opt)}
                    className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-2.5 text-left text-sm font-semibold transition ${
                      isSel
                        ? "border-[#1364E7] bg-[#1364E7] text-white shadow-xs"
                        : "border-[#DCE7FA] bg-white text-[#092551] hover:border-[#9FC0F8]"
                    }`}
                  >
                    <span
                      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        isSel ? "border-white bg-white text-[#1364E7]" : "border-[#C8D9F6] bg-[#F8FAFF]"
                      }`}
                    >
                      {isSel && <PixelIcon name="check" size={12} />}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <CheckingSeamButton
                loading={submitting}
                label="บันทึกคำตอบทบทวน"
                loadingLabel="กำลังบันทึก"
                disabled={!selectedMicro}
                onClick={() => submitAnswer(selectedMicro)}
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
