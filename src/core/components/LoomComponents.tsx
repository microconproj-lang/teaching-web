"use client";

import React, { useEffect, useState } from "react";
import { BRAND_NAME } from "@/core/config/brand";
import type { BadgeDefinition } from "@/core/grading/badges";
import { PixelNumber } from "@/core/components/PixelNumber";
import { PixelIcon } from "@/core/components/PixelSprite";

/* ============================================================================
 * 1. BrandWordmark (ชื่อแบรนด์ + สัญลักษณ์ตะเข็บ 8×8)
 * ============================================================================ */
export function BrandWordmark({
  onDeep = false,
  compact = false,
}: {
  onDeep?: boolean;
  compact?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={`notch inline-flex h-10 w-10 items-center justify-center border-2 ${
          onDeep ? "border-paper bg-paper text-cloth-deep" : "border-cloth-deep bg-cloth-deep text-paper"
        }`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 8 8" width={24} height={24} shapeRendering="crispEdges">
          <rect x="3" y="0" width="2" height="2" fill="currentColor" />
          <rect x="2" y="2" width="1" height="1" fill="currentColor" />
          <rect x="5" y="2" width="1" height="1" fill="currentColor" />
          <rect x="1" y="3" width="6" height="2" fill="#EF5DA8" />
          <rect x="2" y="5" width="1" height="1" fill="currentColor" />
          <rect x="5" y="5" width="1" height="1" fill="currentColor" />
          <rect x="3" y="6" width="2" height="2" fill="currentColor" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-2xl font-bold ${
            onDeep ? "text-cloth" : "text-cloth-deep"
          }`}
        >
          {BRAND_NAME}
        </span>
        {!compact && (
          <span
            className={`mt-1 text-xs ${onDeep ? "text-cloth/80" : "text-ink-2"}`}
          >
            วิทยาการคำนวณ ม.1–ม.3
          </span>
        )}
      </span>
    </span>
  );
}

/* ============================================================================
 * 2. StitchTile (ช่องทอและดาว 3 ระดับตามความหนาแน่นของการปัก — ข้อ 8.1)
 * ============================================================================ */
export type StitchTileStatus = "locked" | "open" | "active" | "passed";

export function StitchTile({
  status,
  stars = 0,
  worldColor = "var(--w1)",
  stageCode,
  size = 56,
  selected = false,
}: {
  status: StitchTileStatus;
  stars?: 0 | 1 | 2 | 3;
  worldColor?: string;
  stageCode?: string;
  size?: number;
  selected?: boolean;
}) {
  const starText =
    status === "locked"
      ? "ยังไม่เปิด"
      : status === "passed"
        ? `ผ่านแล้ว ${stars} ดาว`
        : status === "active"
          ? "ด่านปัจจุบัน"
          : "เปิดแล้ว ยังไม่ทำ";

  const ariaLabel = stageCode ? `ด่าน ${stageCode} ${starText}` : starText;

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className="relative inline-flex flex-col items-center"
    >
      {/* เข็มอยู่เหนือช่องเมื่อกำลังทำ */}
      {status === "active" && (
        <span
          className="mb-1 inline-flex items-center justify-center bg-cloth-deep px-1.5 py-0.5 text-paper"
          aria-hidden="true"
        >
          <PixelIcon name="needle" size={16} />
        </span>
      )}

      <span
        className={`relative inline-flex items-center justify-center bg-paper ${
          selected ? "outline-[3px] outline-cloth-deep" : ""
        }`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          shapeRendering="crispEdges"
          aria-hidden="true"
        >
          {/* พื้นช่อง */}
          <rect x="0" y="0" width="24" height="24" fill="#FFFFFF" />

          {status === "locked" ? (
            <>
              {/* เส้นประสีจาง --warp */}
              <rect
                x="1"
                y="1"
                width="22"
                height="22"
                fill="#E8EEF9"
                stroke="#AEB9D6"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
              {/* ไอคอนกุญแจ pixel ตรงกลาง */}
              <rect x="9" y="6" width="6" height="2" fill="#4A5686" />
              <rect x="8" y="8" width="2" height="3" fill="#4A5686" />
              <rect x="14" y="8" width="2" height="3" fill="#4A5686" />
              <rect x="7" y="11" width="10" height="7" fill="#4A5686" />
              <rect x="11" y="13" width="2" height="3" fill="#FFFFFF" />
            </>
          ) : (
            <>
              {/* ขอบทึบสีโลก + รูเข็ม 4 มุม */}
              <rect
                x="1"
                y="1"
                width="22"
                height="22"
                fill="#FFFFFF"
                stroke={worldColor}
                strokeWidth="2"
              />
              <rect x="3" y="3" width="2" height="2" fill="#1B2760" />
              <rect x="19" y="3" width="2" height="2" fill="#1B2760" />
              <rect x="3" y="19" width="2" height="2" fill="#1B2760" />
              <rect x="19" y="19" width="2" height="2" fill="#1B2760" />

              {/* 1 ดาว: ตะเข็บวนรอบช่อง (ring) สีชมพูฝาง --reward */}
              {status === "passed" && stars >= 1 && (
                <rect
                  x="5"
                  y="5"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="#EF5DA8"
                  strokeWidth="2"
                  strokeDasharray="2 1"
                />
              )}

              {/* 2 ดาว: ring + ปักหมากรุกครึ่งช่อง */}
              {status === "passed" && stars === 2 && (
                <g fill="#EF5DA8">
                  <rect x="7" y="12" width="2" height="2" />
                  <rect x="11" y="12" width="2" height="2" />
                  <rect x="15" y="12" width="2" height="2" />
                  <rect x="9" y="14" width="2" height="2" />
                  <rect x="13" y="14" width="2" height="2" />
                  <rect x="7" y="16" width="2" height="2" />
                  <rect x="11" y="16" width="2" height="2" />
                  <rect x="15" y="16" width="2" height="2" />
                </g>
              )}

              {/* 3 ดาว: ปักเต็มช่องเป็นลายข้าวหลามตัด สี --reward */}
              {status === "passed" && stars === 3 && (
                <g fill="#EF5DA8">
                  <rect x="11" y="6" width="2" height="2" />
                  <rect x="9" y="8" width="6" height="2" />
                  <rect x="7" y="10" width="10" height="2" />
                  <rect x="6" y="12" width="12" height="2" />
                  <rect x="7" y="14" width="10" height="2" />
                  <rect x="9" y="16" width="6" height="2" />
                  <rect x="11" y="18" width="2" height="2" />
                  <rect x="11" y="11" width="2" height="2" fill="#1B2760" />
                </g>
              )}
            </>
          )}
        </svg>
      </span>

      {/* คำกำกับเพื่อให้แยกสถานะได้โดยไม่พึ่งสีอย่างเดียว */}
      <span className="mt-1 text-xs font-semibold text-cloth-deep">
        {stageCode ? `${stageCode} · ` : ""}
        {status === "locked"
          ? "ล็อก"
          : status === "passed"
            ? `${stars} ดาว`
            : status === "active"
              ? "กำลังทอ"
              : "รอทอ"}
      </span>
    </span>
  );
}

/* ============================================================================
 * 3. ThreadXPBar (หลอดด้าย XP — 20 ขีด ไม่ใช่แถบมน ข้อ 8.2)
 * ============================================================================ */
export function ThreadXPBar({
  level,
  xpInLevel,
  xpForNext,
  totalXp,
  onDeep = false,
}: {
  level: number;
  xpInLevel: number;
  xpForNext: number;
  totalXp: number;
  onDeep?: boolean;
}) {
  const ratio = xpForNext > 0 ? Math.max(0, Math.min(1, xpInLevel / xpForNext)) : 0;
  const filledTicks = Math.round(ratio * 20);

  return (
    <div
      className="space-y-2"
      aria-label={`หลอดด้าย XP เลเวล ${level} มี ${xpInLevel} จาก ${xpForNext}`}
    >
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className={onDeep ? "text-cloth" : "text-cloth-deep"}>
          หลอดด้าย{" "}
          <strong className="font-semibold">{totalXp}</strong> XP
        </span>
        <span className={onDeep ? "text-cloth/80" : "text-ink-2"}>
          {xpInLevel}/{xpForNext}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="grid flex-1 grid-cols-20 gap-0.5 border-2 border-cloth-deep bg-paper p-1"
          role="progressbar"
          aria-valuenow={filledTicks}
          aria-valuemin={0}
          aria-valuemax={20}
        >
          {Array.from({ length: 20 }).map((_, idx) => (
            <span
              key={idx}
              className={`h-4 ${idx < filledTicks ? "bg-reward" : "bg-warp/45"}`}
            />
          ))}
        </div>

        <span
          className="inline-flex shrink-0 items-center gap-1 border-2 border-cloth-deep bg-paper px-2 py-1 text-cloth-deep"
          title={`เลเวลถัดไป: ${level + 1}`}
        >
          <span className="text-xs font-semibold">ถัดไป</span>
          <PixelNumber value={level + 1} pixelSize={2} label={`เลเวล ${level + 1}`} />
        </span>
      </div>
    </div>
  );
}

/* ============================================================================
 * 4. WovenBadge (ตราปัก 12×12 ขอบเย็บแปดเหลี่ยม — ข้อ 8.3)
 * ============================================================================ */
export function WovenBadge({
  badge,
  unlocked,
  unlockedAt,
  size = "md",
}: {
  badge: Pick<BadgeDefinition, "key" | "title" | "description" | "pixelGrid" | "xpBonus">;
  unlocked: boolean;
  unlockedAt?: Date | string | null;
  size?: "sm" | "md" | "lg";
}) {
  const artPx = size === "sm" ? 48 : size === "lg" ? 84 : 64;
  const padCls = size === "sm" ? "p-2.5" : size === "lg" ? "p-5" : "p-4";

  return (
    <div
      className={`notch-octagon border-2 border-dashed ${padCls} ${
        unlocked
          ? "border-cloth-deep bg-paper text-cloth-deep"
          : "border-warp bg-cloth text-ink-2"
      }`}
    >
      <div className={size === "sm" ? "flex items-center gap-3" : "flex items-start gap-4"}>
        <div
          className={`notch-octagon flex shrink-0 items-center justify-center border-2 border-dashed p-1.5 ${
            unlocked ? "border-reward bg-cloth" : "border-warp bg-cloth-band-subtle"
          }`}
          style={{ width: artPx + 14, height: artPx + 14 }}
        >
          <svg
            viewBox="0 0 12 12"
            width={artPx}
            height={artPx}
            shapeRendering="crispEdges"
            aria-hidden="true"
          >
            {badge.pixelGrid.map((row, r) =>
              row.split("").map((cell, c) => {
                if (cell === ".") return null;
                const fill = unlocked
                  ? cell === "#"
                    ? "#EF5DA8"
                    : "#1B2760"
                  : "#AEB9D6";
                return <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill={fill} />;
              })
            )}
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-cloth-deep">{badge.title}</h3>
            <span
              className={`px-2 py-0.5 text-xs font-semibold ${
                unlocked ? "bg-reward text-cloth-deep" : "bg-warp/40 text-ink-2"
              }`}
            >
              {unlocked ? "เย็บติดแล้ว" : "ยังไม่ปลด"}
            </span>
          </div>

          {size !== "sm" && (
            <p className="mt-1 max-w-[38ch] text-sm text-ink-2">{badge.description}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-2">
            <span>+{badge.xpBonus} XP</span>
            {unlocked && unlockedAt && (
              <span>
                ได้เมื่อ {new Date(unlockedAt).toLocaleDateString("th-TH")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 5. HintKnots (ปมคำใบ้ 3 ปมบนเส้นด้าย — ข้อ 8.4)
 * ============================================================================ */
export function HintKnots({
  usedCount,
  onRequestHint,
  interactive = true,
}: {
  usedCount: number;
  onRequestHint?: (knotIndex: number) => void;
  interactive?: boolean;
}) {
  const clamped = Math.max(0, Math.min(3, usedCount));
  const nextKnot = Math.min(3, clamped + 1);
  const knotLabels = ["แนวคิด", "โครงทางแก้", "ใกล้เฉลย"];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3" aria-label={`ปมคำใบ้ ใช้ไปแล้ว ${clamped} จาก 3 ปม`}>
        <span className="text-sm font-semibold text-cloth-deep">ปม</span>
        <div className="relative flex flex-1 items-center justify-between">
          {/* เส้นด้ายเชื่อม 3 ปม */}
          <span
            className="absolute left-2 right-2 top-1/2 h-0.5 -translate-y-1/2 bg-warp"
            aria-hidden="true"
          />
          {[1, 2, 3].map((knotNo) => {
            const tied = knotNo <= clamped;
            return (
              <span
                key={knotNo}
                className="relative z-10 inline-flex items-center gap-1.5 bg-paper pr-2 text-xs font-semibold"
              >
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center border-2 ${
                    tied
                      ? "border-cloth-deep bg-cloth-deep text-paper"
                      : "border-cloth-deep bg-paper text-cloth-deep"
                  }`}
                  aria-label={`ปมที่ ${knotNo} ${tied ? "ผูกแล้ว" : "ยังไม่ผูก"}`}
                >
                  {tied ? <PixelIcon name="knot" size={12} /> : knotNo}
                </span>
                <span className="hidden text-ink-2 sm:inline">{knotLabels[knotNo - 1]}</span>
              </span>
            );
          })}
        </div>
      </div>

      {interactive && onRequestHint && (
        <button
          type="button"
          onClick={() => onRequestHint(nextKnot)}
          disabled={clamped >= 3}
          className="btn-notch-outline notch w-full text-sm"
        >
          <PixelIcon name="knot" size={16} />
          {clamped >= 3 ? "ใช้คำใบ้ครบทั้ง 3 ปมแล้ว" : `ขอคำใบ้ปมที่ ${nextKnot}`}
        </button>
      )}
    </div>
  );
}

/* ============================================================================
 * 6. CheckingSeamButton (ปุ่มส่ง/ตรวจพร้อมตะเข็บวิ่ง 3 ขีด "กำลังตรวจ")
 * ============================================================================ */
export function CheckingSeamButton({
  loading,
  label = "ส่ง",
  loadingLabel = "กำลังตรวจ",
  onClick,
  disabled = false,
  className = "",
  icon = "send",
}: {
  loading: boolean;
  label?: string;
  loadingLabel?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: "send" | "run" | "check";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className={`btn-notch notch ${className}`}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1" aria-hidden="true">
            <span className="seam-dash-1 inline-block h-1.5 w-2.5 bg-paper" />
            <span className="seam-dash-2 inline-block h-1.5 w-2.5 bg-paper" />
            <span className="seam-dash-3 inline-block h-1.5 w-2.5 bg-paper" />
          </span>
          <span>{loadingLabel}</span>
        </span>
      ) : (
        <>
          <PixelIcon name={icon} size={16} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

/* ============================================================================
 * 7. PinWeaveInput (ช่องทอ 6 ช่องสำหรับ PIN ประจำคาบของครู — ข้อ 8.5)
 * ============================================================================ */
export function PinWeaveInput({
  value,
  onChange,
  label = "รหัส PIN ประจำคาบ 6 หลัก",
}: {
  value: string;
  onChange: (next: string) => void;
  label?: string;
}) {
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");

  const updateAt = (index: number, char: string, target: HTMLInputElement) => {
    const clean = char.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    onChange(next.join(""));
    if (clean && index < 5) {
      const parent = target.parentElement;
      const inputs = parent?.querySelectorAll("input");
      inputs?.[index + 1]?.focus();
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-cloth-deep">{label}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {digits.map((digit, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            aria-label={`หลักที่ ${i + 1}`}
            onChange={(e) => updateAt(i, e.target.value, e.currentTarget)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !digits[i] && i > 0) {
                const inputs = e.currentTarget.parentElement?.querySelectorAll("input");
                inputs?.[i - 1]?.focus();
              }
            }}
            className="notch h-12 w-11 border-2 border-dashed border-cloth-deep bg-paper text-center font-display text-xl font-bold text-cloth-deep focus:border-solid focus:border-[3px] focus:outline-none"
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
 * 8. StageClearSequence ("เย็บเสร็จ" 0–1.5s เคารพ prefers-reduced-motion — ข้อ 6.3)
 * ============================================================================ */
export function StageClearSequence({
  stars,
  xpAwarded,
  feedback,
  worldColor = "var(--w1)",
  hasNextStage,
  onNextStage,
}: {
  stars: 1 | 2 | 3;
  xpAwarded: number;
  feedback: string;
  worldColor?: string;
  hasNextStage: boolean;
  onNextStage?: () => void;
}) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const [displayXp, setDisplayXp] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setPhase(3);
      setDisplayXp(xpAwarded);
      return;
    }

    setPhase(0);
    setDisplayXp(0);
    const t1 = window.setTimeout(() => setPhase(1), 400);
    const t2 = window.setTimeout(() => setPhase(2), 900);
    const t3 = window.setTimeout(() => setPhase(3), 1300);

    const stepMs = 45;
    const xpInterval = window.setInterval(() => {
      setDisplayXp((prev) => {
        if (prev >= xpAwarded) return xpAwarded;
        const step = Math.max(1, Math.ceil(xpAwarded / 8));
        return Math.min(xpAwarded, prev + step);
      });
    }, stepMs);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearInterval(xpInterval);
    };
  }, [stars, xpAwarded]);

  const skipSequence = () => {
    setPhase(3);
    setDisplayXp(xpAwarded);
  };

  const spoolWidthPct = phase >= 2 ? 100 : phase >= 1 ? 45 : 10;

  return (
    <div
      onClick={skipSequence}
      role="status"
      aria-live="polite"
      className="notch-lg cursor-pointer border-2 border-cloth-deep bg-paper p-5"
      title="แตะเพื่อดูผลทันที"
    >
      <div className="flex flex-wrap items-center gap-5">
        {/* SVG 0-400ms เส้นเย็บวนรอบช่อง + 400-900ms เติมลายตามดาว */}
        <div className="relative shrink-0">
          <svg
            viewBox="0 0 48 48"
            width={68}
            height={68}
            shapeRendering="crispEdges"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="44" height="44" fill="#E8EEF9" />
            <rect
              x="2"
              y="2"
              width="44"
              height="44"
              fill="none"
              stroke={worldColor}
              strokeWidth="4"
              className={phase < 3 ? "animate-stitch-perimeter" : ""}
            />
            {phase >= 1 && (
              <g fill="#EF5DA8">
                <rect x="8" y="8" width="32" height="32" fill="none" stroke="#EF5DA8" strokeWidth="3" />
                {stars >= 2 && (
                  <>
                    <rect x="14" y="24" width="4" height="4" />
                    <rect x="22" y="24" width="4" height="4" />
                    <rect x="30" y="24" width="4" height="4" />
                    <rect x="18" y="30" width="4" height="4" />
                    <rect x="26" y="30" width="4" height="4" />
                  </>
                )}
                {stars === 3 && (
                  <>
                    <rect x="22" y="12" width="4" height="4" />
                    <rect x="18" y="16" width="12" height="4" />
                    <rect x="14" y="20" width="20" height="4" />
                    <rect x="18" y="34" width="12" height="4" />
                  </>
                )}
              </g>
            )}
          </svg>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-cloth-deep">
              ผ่านแล้ว ทอเพิ่มอีก 1 แถว
            </h3>
            <span className="bg-reward px-2.5 py-0.5 text-sm font-semibold text-cloth-deep">
              ได้ {stars} ดาว
            </span>
          </div>

          <p className="max-w-[45ch] text-sm text-ink-2">{feedback}</p>

          {/* 900-1300ms เลข XP pixel นับขึ้น + หลอดด้ายยืด */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="inline-flex items-center gap-1.5 border-2 border-cloth-deep bg-cloth px-2.5 py-1">
              <span className="text-xs font-semibold">+XP</span>
              <PixelNumber value={displayXp} pixelSize={3} label={`ได้ ${xpAwarded} XP`} />
            </span>

            <div className="h-3 w-36 border-2 border-cloth-deep bg-cloth p-0.5" aria-hidden="true">
              <div
                className="h-full bg-reward transition-all duration-300"
                style={{ width: `${spoolWidthPct}%` }}
              />
            </div>

            {phase >= 3 && hasNextStage && onNextStage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNextStage();
                }}
                className="btn-notch notch ml-auto text-sm"
              >
                <PixelIcon name="needle" size={16} />
                <span>เดินเข็มไปด่านถัดไป</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

