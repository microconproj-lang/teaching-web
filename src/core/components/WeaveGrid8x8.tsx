"use client";

import React, { useRef, useState } from "react";
import { PixelNumber } from "@/core/components/PixelNumber";
import { PixelIcon } from "@/core/components/PixelSprite";

/**
 * ลายข้าวหลามตัดเริ่มต้นบนผืนทอ 8×8
 */
const DEFAULT_DIAMOND: number[][] = [
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 1],
  [1, 1, 0, 0, 0, 0, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
];

function cloneDefault(): number[][] {
  return DEFAULT_DIAMOND.map((row) => [...row]);
}

export function WeaveGrid8x8({ tone = "deep" }: { tone?: "deep" | "light" }) {
  const [grid, setGrid] = useState<number[][]>(cloneDefault);
  const [symmetric, setSymmetric] = useState(true);
  const btnRefs = useRef<(HTMLButtonElement | null)[][]>(
    Array.from({ length: 8 }, () => Array(8).fill(null))
  );

  const toggleCell = (r: number, c: number) => {
    setGrid((prev) =>
      prev.map((row, ri) => {
        if (ri !== r) return row;
        const nextRow = [...row];
        const nextVal = nextRow[c] === 1 ? 0 : 1;
        nextRow[c] = nextVal;
        if (symmetric) {
          nextRow[7 - c] = nextVal;
        }
        return nextRow;
      })
    );
  };

  const clearGrid = () => {
    setGrid(Array.from({ length: 8 }, () => Array(8).fill(0)));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    r: number,
    c: number
  ) => {
    let nr = r;
    let nc = c;
    if (e.key === "ArrowRight") nc = (c + 1) % 8;
    else if (e.key === "ArrowLeft") nc = (c + 7) % 8;
    else if (e.key === "ArrowDown") nr = (r + 1) % 8;
    else if (e.key === "ArrowUp") nr = (r + 7) % 8;
    else return;

    e.preventDefault();
    btnRefs.current[nr]?.[nc]?.focus();
  };

  const onDeep = tone === "deep";

  return (
    <div
      className={`notch-lg border-2 p-4 sm:p-5 ${
        onDeep
          ? "on-deep border-cloth/40 bg-cloth-deep text-cloth"
          : "border-cloth-deep bg-paper text-cloth-deep"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
        <span className="font-display text-base font-bold">ผืนทอ 8×8</span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={symmetric}
            onClick={() => setSymmetric((s) => !s)}
            className={`notch inline-flex min-h-9 items-center gap-1.5 border-2 px-3 py-1 text-xs font-semibold cursor-pointer ${
              symmetric
                ? onDeep
                  ? "border-paper bg-paper text-cloth-deep"
                  : "border-cloth-deep bg-cloth-deep text-paper"
                : onDeep
                  ? "border-cloth/50 bg-transparent text-cloth"
                  : "border-cloth-deep bg-paper text-cloth-deep"
            }`}
          >
            <PixelIcon name="symmetry" size={14} />
            <span>ทอแบบสมมาตร: {symmetric ? "เปิด" : "ปิด"}</span>
          </button>

          <button
            type="button"
            onClick={clearGrid}
            className={`notch inline-flex min-h-9 items-center gap-1.5 border-2 px-3 py-1 text-xs font-semibold cursor-pointer ${
              onDeep
                ? "border-cloth/50 bg-transparent text-cloth hover:bg-paper hover:text-cloth-deep"
                : "border-cloth-deep bg-paper text-cloth-deep hover:bg-cloth"
            }`}
          >
            <PixelIcon name="clear" size={14} />
            <span>ล้างผืน</span>
          </button>
        </div>
      </div>

      {/* กริด 8×8 + เลขฐานสองและฐานสิบทางขวาของทุกแถว */}
      <div className="space-y-1.5" role="grid" aria-label="ตารางทอผ้า 8 คูณ 8">
        {grid.map((row, r) => {
          const binaryStr = row.join("");
          const decimalVal = parseInt(binaryStr, 2);
          return (
            <div
              key={r}
              role="row"
              className="flex items-center justify-between gap-3"
            >
              <div className="grid grid-cols-8 gap-1">
                {row.map((bit, c) => {
                  const isOn = bit === 1;
                  return (
                    <button
                      key={c}
                      ref={(el) => {
                        if (!btnRefs.current[r]) btnRefs.current[r] = [];
                        btnRefs.current[r][c] = el;
                      }}
                      type="button"
                      role="switch"
                      aria-checked={isOn}
                      aria-label={`แถว ${r + 1} ช่อง ${c + 1} ${isOn ? "เปิด" : "ปิด"}`}
                      onClick={() => toggleCell(r, c)}
                      onKeyDown={(e) => handleKeyDown(e, r, c)}
                      className={`h-7 w-7 cursor-pointer border sm:h-8 sm:w-8 ${
                        isOn
                          ? "border-paper bg-w1"
                          : onDeep
                            ? "border-cloth/30 bg-cloth-deep hover:border-cloth"
                            : "border-warp bg-cloth hover:border-cloth-deep"
                      }`}
                    />
                  );
                })}
              </div>

              {/* เลขฐานสอง + ฐานสิบแบบ Pixel Numerals */}
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <span
                  className={`hidden sm:inline-flex ${
                    onDeep ? "text-cloth/90" : "text-ink-2"
                  }`}
                  title={`ฐานสอง: ${binaryStr}`}
                >
                  <PixelNumber value={binaryStr} pixelSize={2} gap={1} label={`แถว ${r + 1} ฐานสอง ${binaryStr}`} />
                </span>
                <span
                  className={`inline-flex min-w-12 justify-end px-1.5 py-0.5 ${
                    onDeep ? "bg-paper text-cloth-deep" : "bg-cloth text-cloth-deep"
                  }`}
                  title={`ฐานสิบ: ${decimalVal}`}
                >
                  <PixelNumber
                    value={String(decimalVal).padStart(3, " ")}
                    pixelSize={2}
                    gap={1}
                    label={`แถว ${r + 1} ฐานสิบ ${decimalVal}`}
                  />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className={`mt-3 text-xs ${onDeep ? "text-cloth/80" : "text-ink-2"}`}>
        ใช้ปุ่มลูกศรบนคีย์บอร์ดเลื่อนช่อง และกด Space หรือ Enter เพื่อยกเส้นด้ายขึ้น (1) หรือลง (0)
      </p>
    </div>
  );
}

