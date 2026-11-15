"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Layers, Maximize2, X } from "lucide-react";
import type { BlueprintSlideDef, LessonResourceDef } from "@/core/config/curriculum-types";

/**
 * แสดงชุดสไลด์ Blueprint (.webp) แบบสลับหน้าและเปิดดูแบบขยายเต็มจอได้
 */
export function BlueprintSlideDeck({
  slides,
  lessonTitle,
  courseCode,
}: {
  slides: BlueprintSlideDef[];
  lessonTitle: string;
  courseCode?: string;
}) {
  const [openDeck, setOpenDeck] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const safeIdx = Math.min(idx, Math.max(0, slides.length - 1));
  const current = slides[safeIdx];

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setIdx((i) => Math.min(slides.length - 1, i + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, slides.length]);

  if (slides.length === 0) return null;

  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(slides.length - 1, i + 1));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#DCE7FA] bg-white px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#092551] text-white">
            <Layers className="h-4 w-4 text-[#F0742E]" />
          </span>
          <div>
            <div className="text-xs font-bold text-[#092551]">
              {courseCode ? `${courseCode} · ` : ""}สไลด์ประกอบการสอนชุด Blueprint ({slides.length} หน้า)
            </div>
            <div className="text-[11px] text-[#5C7299]">
              เปิดดูสไลด์ประกอบทั้งหน่วยหรือขยายเต็มจอเพื่อทบทวน
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOpenDeck((v) => !v)}
            className="ed-btn-secondary min-h-9 px-3 text-xs"
          >
            {openDeck ? "ซ่อนสไลด์ Blueprint" : `ดูสไลด์ Blueprint (${slides.length})`}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpenDeck(true);
              setModalOpen(true);
            }}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[#092551] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#133A7A]"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            เปิดเต็มจอ
          </button>
        </div>
      </div>

      {openDeck && current && (
        <div className="rounded-2xl border border-[#1E3B6E] bg-[#081A37] p-4 text-white shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2 text-xs">
            <span className="truncate font-semibold text-[#D8E7FF]">
              {current.title ?? `${lessonTitle} — หน้า ${safeIdx + 1}`}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              <span className="font-mono text-[#8BA9DA]">
                {safeIdx + 1} / {slides.length}
              </span>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="rounded-lg bg-white/10 px-2 py-1 text-[11px] font-semibold text-white hover:bg-white/20"
              >
                ขยาย
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#051024]">
            <img
              src={current.src}
              alt={current.title ?? `Slide ${safeIdx + 1}`}
              onClick={() => setModalOpen(true)}
              className="mx-auto max-h-[420px] w-auto cursor-zoom-in object-contain"
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={safeIdx === 0}
              onClick={prev}
              className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              ก่อนหน้า
            </button>

            <div className="flex max-w-full gap-1.5 overflow-x-auto px-1 py-1">
              {slides.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`h-7 min-w-7 rounded-lg px-2 font-mono text-[11px] font-bold transition ${
                    i === safeIdx
                      ? "bg-[#F0742E] text-white"
                      : "bg-white/10 text-[#BFD4F5] hover:bg-white/20"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={safeIdx === slides.length - 1}
              onClick={next}
              className="inline-flex items-center gap-1 rounded-xl bg-[#1364E7] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0A5FE6] disabled:opacity-40"
            >
              ถัดไป
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {modalOpen && current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Blueprint Slide Lightbox"
          className="fixed inset-0 z-50 flex flex-col bg-[#040D1E]/95 p-4 text-white backdrop-blur-sm"
        >
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 pb-3">
            <div className="truncate text-sm font-bold text-[#D8E7FF]">
              {current.title ?? `${lessonTitle} — สไลด์ที่ ${safeIdx + 1}`}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#8BA9DA]">
                {safeIdx + 1} / {slides.length}
              </span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="ปิดมุมมองเต็มจอ"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 items-center justify-center">
            <img
              src={current.src}
              alt={current.title ?? `Slide ${safeIdx + 1}`}
              className="max-h-full max-w-full rounded-xl border border-white/10 object-contain shadow-2xl"
            />
          </div>

          <div className="mx-auto mt-3 flex w-full max-w-6xl items-center justify-between gap-2">
            <button
              type="button"
              disabled={safeIdx === 0}
              onClick={prev}
              className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold hover:bg-white/20 disabled:opacity-35"
            >
              <ChevronLeft className="h-4 w-4" />
              สไลด์ก่อนหน้า
            </button>
            <div className="hidden gap-1 overflow-x-auto sm:flex">
              {slides.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`h-7 min-w-7 rounded-lg px-2 font-mono text-[11px] font-bold ${
                    i === safeIdx ? "bg-[#F0742E] text-white" : "bg-white/10 text-[#BFD4F5]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={safeIdx === slides.length - 1}
              onClick={next}
              className="inline-flex items-center gap-1 rounded-xl bg-[#1364E7] px-4 py-2 text-xs font-bold hover:bg-[#0A5FE6] disabled:opacity-35"
            >
              สไลด์ถัดไป
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * แสดงแถบดาวน์โหลดใบความรู้ ใบงาน และไฟล์ PDF ประจำหน่วย
 */
export function LessonResourcesBar({ resources }: { resources?: LessonResourceDef[] }) {
  if (!resources || resources.length === 0) return null;

  const kindBadge: Record<LessonResourceDef["kind"], string> = {
    knowledge: "ใบความรู้",
    worksheet: "ใบงาน",
    slides: "สไลด์ PDF",
    guide: "คู่มือ",
  };

  return (
    <section className="rounded-2xl border border-[#DCE7FA] bg-white p-5 shadow-xs">
      <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#092551]">
        <FileText className="h-4 w-4 text-[#1364E7]" />
        <span>เอกสารและใบงานดาวน์โหลดประกอบบทเรียน</span>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((res) => (
          <a
            key={res.href}
            href={res.href}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center justify-between gap-2 rounded-xl border border-[#E1EAFB] bg-[#F8FAFF] px-3.5 py-2.5 text-xs transition hover:border-[#1364E7] hover:bg-[#EFF6FF]"
          >
            <span className="truncate font-semibold text-[#092551]">{res.label}</span>
            <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-[#1364E7] ring-1 ring-[#D4E2FA]">
              {kindBadge[res.kind]}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
