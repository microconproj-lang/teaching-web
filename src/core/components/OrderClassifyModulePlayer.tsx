"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChallengeProgressView, ModulePlayerProps } from "@/core/modules/contract";
import { findWorldForModule } from "@/core/config/worlds";
import { getBadgeDefinition } from "@/core/grading/badges";
import type {
  ClassifyChallengeConfig,
  OrderChallengeConfig,
  OrderClassifyChallengeConfig,
} from "@/core/grading/order-classify";
import {
  CheckingSeamButton,
  HintKnots,
  StageClearSequence,
  StitchTile,
  WovenBadge,
} from "@/core/components/LoomComponents";
import { PixelIcon } from "@/core/components/PixelSprite";

interface SubmitResult {
  score: number;
  stars: number;
  passed: boolean;
  feedback: string;
  xpAwarded?: number;
  newBadges?: Array<{ key: string; title: string }>;
}

export interface OrderClassifyPlayerTheme {
  courseCode: string;
  navAriaLabel: string;
  allDoneText: string;
  remainingText: (remainingCount: number) => string;
  accentBadgeClass: string;
  progressBarClass: string;
  orderTitle: string;
  orderSubtitle: string;
  orderGoal: string;
  classifyTitle: string;
  classifySubtitle: string;
  classifyGoal: string;
}

/**
 * Shared module player supporting drag-and-drop/arrow block ordering and category classification.
 */
export function OrderClassifyModulePlayer({
  assignmentId,
  moduleKey,
  challenges,
  disablePaste,
  focusMode,
  progress,
  initialChallengeId,
  backHref = "/dashboard",
  unlockAll = false,
  theme,
}: ModulePlayerProps & { theme: OrderClassifyPlayerTheme }) {
  const world = findWorldForModule(moduleKey);

  const initialIdx = useMemo(() => {
    if (initialChallengeId) {
      const target = challenges.findIndex(
        (c) => c.id === initialChallengeId || c.challengeKey === initialChallengeId
      );
      if (target !== -1) return target;
    }
    const idx = challenges.findIndex((c) => !progress?.[c.id]?.passed);
    return idx === -1 ? 0 : idx;
  }, [challenges, progress, initialChallengeId]);

  const [activeIndex, setActiveIndex] = useState(initialIdx);
  const [progressMap, setProgressMap] = useState<Record<string, ChallengeProgressView>>(
    progress ?? {}
  );
  const challenge = challenges[activeIndex];
  const cfg = (challenge?.config ?? {}) as unknown as OrderClassifyChallengeConfig;
  const isClassify = cfg.mode === "classify";

  const initialBlocks = useMemo(
    () => (cfg.mode === "order" ? cfg.blocks : []),
    [cfg]
  );

  const draftStorageKey = challenge
    ? `pccpl_draft_${moduleKey}_${assignmentId}_${challenge.id}`
    : "";

  const [orderedBlocks, setOrderedBlocks] = useState<Array<{ id: string; text: string }>>(
    initialBlocks
  );
  const [classifyMap, setClassifyMap] = useState<Record<string, string>>({});
  const [hasDraft, setHasDraft] = useState(false);
  const [offlineSaved, setOfflineSaved] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [dryRunOutput, setDryRunOutput] = useState<string[] | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [selectedMicro, setSelectedMicro] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [mobileMissionOpen, setMobileMissionOpen] = useState(false);

  const startedAtRef = useRef<number>(Date.now());
  const telemetryRef = useRef({
    keystrokes: 0,
    pasteChars: 0,
    pasteEvents: 0,
    tabSwitches: 0,
    runCount: 0,
  });

  useEffect(() => {
    let restored = false;
    let nextBlocks = initialBlocks;
    let nextClassify: Record<string, string> = {};

    if (draftStorageKey && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(draftStorageKey);
        if (raw) {
          const parsed = JSON.parse(raw) as unknown;
          if (!isClassify && Array.isArray(parsed)) {
            const byId = new Map(initialBlocks.map((b) => [b.id, b]));
            const mapped = parsed
              .map((id) => byId.get(String(id)))
              .filter((x): x is { id: string; text: string } => Boolean(x));
            if (mapped.length === initialBlocks.length) {
              nextBlocks = mapped;
              restored = true;
            }
          } else if (isClassify && parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            nextClassify = parsed as Record<string, string>;
            restored = Object.keys(nextClassify).length > 0;
          }
        }
      } catch {
        // ignore storage errors
      }
    }

    setOrderedBlocks(nextBlocks);
    setClassifyMap(nextClassify);
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
  }, [challenge?.id, draftStorageKey, initialBlocks, isClassify]);

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
        <p className="text-base text-[#5C7299]">ยังไม่มีด่านในชุดภารกิจนี้</p>
        <Link href={backHref} className="ed-btn-primary mt-4 inline-flex">
          กลับแผนที่หลัก
        </Link>
      </div>
    );
  }

  const isUnlocked = (idx: number) =>
    unlockAll || idx === 0 || Boolean(progressMap[challenges[idx - 1]?.id]?.passed);

  const persistDraft = (data: string[] | Record<string, string>) => {
    if (!draftStorageKey) return;
    try {
      localStorage.setItem(draftStorageKey, JSON.stringify(data));
      setHasDraft(true);
    } catch {
      // ignore storage quota
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
    persistDraft(next.map((b) => b.id));
  };

  const assignCategory = (itemId: string, catId: string) => {
    const next = { ...classifyMap, [itemId]: catId };
    setClassifyMap(next);
    setDryRunOutput(null);
    telemetryRef.current.keystrokes += 1;
    persistDraft(next);
  };

  const resetWork = () => {
    setOrderedBlocks(initialBlocks);
    setClassifyMap({});
    setDryRunOutput(null);
    setResult(null);
    if (draftStorageKey && typeof window !== "undefined") {
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
    if (!isClassify) {
      setDryRunOutput(orderedBlocks.map((b, i) => `${i + 1}. ${b.text}`));
      return;
    }
    const classifyCfg = cfg as ClassifyChallengeConfig;
    const lines = classifyCfg.items.map((item) => {
      const cat = classifyCfg.categories.find((c) => c.id === classifyMap[item.id]);
      return `[${cat ? cat.label : "ยังไม่เลือกหมวด"}] ${item.text}`;
    });
    setDryRunOutput(lines);
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
        answer: isClassify ? classifyMap : orderedBlocks.map((b) => b.id),
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
      persistDraft(isClassify ? classifyMap : orderedBlocks.map((b) => b.id));
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

  const passedCount = challenges.filter((c) => progressMap[c.id]?.passed).length;
  const remainingCount = Math.max(0, challenges.length - passedCount);
  const progressPct =
    challenges.length > 0 ? Math.round((passedCount / challenges.length) * 100) : 0;
  const stageCode = `${world.order}-${activeIndex + 1}`;
  const hasNextChallenge = activeIndex < challenges.length - 1;
  const hintSteps = cfg.hints ?? [];
  const classifyCfg = isClassify ? (cfg as ClassifyChallengeConfig) : null;
  const orderCfg = !isClassify ? (cfg as OrderChallengeConfig) : null;
  const allItemsClassified = classifyCfg
    ? classifyCfg.items.every((it) => Boolean(classifyMap[it.id]))
    : true;

  return (
    <div className="min-h-screen bg-[#F4F7FD] text-[#092551]">
      <header className="sticky top-0 z-20 border-b border-[#DCE7FA] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className={`inline-flex shrink-0 items-center rounded-xl px-2.5 py-1 text-xs font-bold shadow-xs ${theme.accentBadgeClass}`}>
              {theme.courseCode} · ด่าน {stageCode}
            </span>
            <h1 className="truncate font-display text-lg font-bold sm:text-xl">
              {challenge.title}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-[#F8FAFF] px-3 py-1.5 ring-1 ring-[#E1EAFB] sm:flex">
              <span className="text-xs font-semibold text-[#5C7299]">คำใบ้</span>
              {[1, 2, 3].map((k) => (
                <span
                  key={k}
                  className={`inline-flex h-3 w-3 rounded-full border ${
                    k <= hintsUsed
                      ? "border-[#F0742E] bg-[#F0742E]"
                      : "border-[#C8D9F6] bg-white"
                  }`}
                />
              ))}
            </div>
            <Link href={backHref} className="ed-btn-secondary min-h-10 px-4 text-sm">
              ออกจากการฝึก
            </Link>
          </div>
        </div>

        <div className="border-t border-[#EBF2FE] bg-[#F8FAFF]">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 text-xs text-[#5C7299]">
            <span className="font-medium">
              {remainingCount === 0 ? theme.allDoneText : theme.remainingText(remainingCount)}
            </span>
            <div className="flex items-center gap-3">
              {hasDraft && !offlineSaved && <span className="text-[#1364E7]">บันทึกร่างอัตโนมัติ</span>}
              {focusMode && (
                <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 font-semibold text-[#1364E7]">
                  โหมดตั้งสมาธิ
                </span>
              )}
              {disablePaste && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-800">
                  ห้ามวางข้อความจากภายนอก
                </span>
              )}
            </div>
          </div>
          <div className="h-1.5 w-full bg-[#E8F1FE]">
            <div
              className={`h-full rounded-r-full transition-all ${theme.progressBarClass}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6">
        <nav aria-label={theme.navAriaLabel} className="overflow-x-auto pb-1">
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
                      {(ch.config as { unitCode?: string }).unitCode
                        ?.replace(/^unit\s*0(?=\d)/i, "U")
                        .replace(/^unit\s*/i, "U") ?? `U${ch.orderIndex}`}{" "}
                      ({world.order}-{idx + 1})
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {offlineSaved && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
          >
            <div className="flex items-center gap-2">
              <PixelIcon name="warn" size={18} />
              <span>อินเทอร์เน็ตขาดการเชื่อมต่อ คำตอบถูกเก็บไว้ในเครื่องแล้ว</span>
            </div>
          </div>
        )}

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

        <div className="grid items-start gap-6 lg:grid-cols-12">
          <aside
            className={`ed-card space-y-5 p-5 lg:col-span-4 ${
              mobileMissionOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div>
              <div className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-bold ${theme.accentBadgeClass}`}>
                {cfg.unitCode}
              </div>
              <h2 className="mt-2 font-display text-lg font-bold text-[#092551]">สถานการณ์จำลอง</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#11264A]">{cfg.story}</p>
            </div>

            <div className="border-t border-[#EBF2FE] pt-4">
              <h3 className="font-display text-sm font-bold text-[#092551]">เป้าหมายความสำเร็จ</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs text-[#5C7299]">
                <li>{isClassify ? theme.classifyGoal : theme.orderGoal}</li>
                <li>ตอบคำถามสั้นท้ายด่านและใช้คำใบ้ไม่เกิน 1 ครั้งเพื่อรับ 3 ดาว</li>
              </ul>
            </div>

            <div className="space-y-3 border-t border-[#EBF2FE] pt-4">
              <HintKnots usedCount={hintsUsed} onRequestHint={(n) => setHintsUsed(n)} />
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

          <section className="ed-card p-5 sm:p-6 lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EBF2FE] pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#092551]">
                  {isClassify ? theme.classifyTitle : theme.orderTitle}
                </h2>
                <p className="text-xs text-[#5C7299]">
                  {isClassify ? theme.classifySubtitle : theme.orderSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={resetWork}
                className="ed-btn-secondary min-h-10 px-3.5 text-xs"
              >
                <PixelIcon name="clear" size={14} />
                <span>เริ่มใหม่</span>
              </button>
            </div>

            {orderCfg && (
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
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#092551] text-xs font-bold text-white">
                          {index + 1}
                        </span>
                        <span className="text-sm font-semibold text-[#092551]">{block.text}</span>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => moveBlock(index, index - 1)}
                          disabled={index === 0}
                          aria-label={`เลื่อน ${block.text} ขึ้น`}
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#DCE7FA] bg-[#F8FAFF] text-[#092551] hover:border-[#1364E7] disabled:opacity-30"
                        >
                          <PixelIcon name="up" size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlock(index, index + 1)}
                          disabled={index === orderedBlocks.length - 1}
                          aria-label={`เลื่อน ${block.text} ลง`}
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#DCE7FA] bg-[#F8FAFF] text-[#092551] hover:border-[#1364E7] disabled:opacity-30"
                        >
                          <PixelIcon name="down" size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {classifyCfg && (
              <div className="mt-4 space-y-3">
                {classifyCfg.items.map((item) => {
                  const chosen = classifyMap[item.id];
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[#DCE7FA] bg-white p-4 shadow-xs"
                    >
                      <div className="text-sm font-bold text-[#092551]">{item.text}</div>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {classifyCfg.categories.map((cat) => {
                          const active = chosen === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => assignCategory(item.id, cat.id)}
                              className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                                active
                                  ? "border-[#092551] bg-[#092551] text-white shadow-xs"
                                  : `${cat.badgeCls} opacity-85 hover:opacity-100`
                              }`}
                            >
                              {cat.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 border-t border-[#EBF2FE] pt-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <h3 className="font-display text-base font-bold text-[#092551]">ผลตรวจสอบเบื้องต้น</h3>
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
                      {isClassify && !allItemsClassified
                        ? "กรุณาเลือกหมวดหมู่ให้ครบทุกรายการก่อนกดส่งคำตอบ"
                        : "กด 'จำลองผล' เพื่อทบทวนคำตอบ หรือกด 'ส่งคำตอบ' เพื่อบันทึกคะแนน"}
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
                    <span>จำลองผล</span>
                  </button>

                  <CheckingSeamButton
                    loading={submitting}
                    label="ส่งคำตอบ"
                    loadingLabel="กำลังตรวจ"
                    disabled={isClassify && !allItemsClassified}
                    onClick={() => submitAnswer()}
                    className="flex-1 sm:flex-none"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

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
