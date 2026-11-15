import React from "react";

/**
 * ตัวเลข Pixel 5×7 (0-9 และสัญลักษณ์หลัก) เรนเดอร์ด้วย SVG <rect> ล้วน ไม่โหลดฟอนต์เพิ่ม
 */
const GLYPHS: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00110", "01000", "10000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  "/": ["00001", "00010", "00010", "00100", "01000", "01000", "10000"],
  "-": ["00000", "00000", "00000", "11110", "00000", "00000", "00000"],
  "+": ["00000", "00100", "00100", "11111", "00100", "00100", "00000"],
  ":": ["00000", "00100", "00100", "00000", "00100", "00100", "00000"],
  "%": ["11001", "11010", "00010", "00100", "01000", "01011", "10011"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
};

export function PixelNumber({
  value,
  pixelSize = 3,
  gap = 2,
  className = "",
  label,
}: {
  value: string | number;
  pixelSize?: number;
  gap?: number;
  className?: string;
  label?: string;
}) {
  const str = String(value);
  const chars = str.split("").map((ch) => GLYPHS[ch] ?? GLYPHS[" "]);
  const charWidth = 5 * pixelSize;
  const stepX = charWidth + gap * pixelSize;
  const totalWidth = Math.max(charWidth, chars.length * stepX - gap * pixelSize);
  const totalHeight = 7 * pixelSize;

  return (
    <svg
      width={totalWidth}
      height={totalHeight}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      shapeRendering="crispEdges"
      className={`inline-block shrink-0 ${className}`}
      role={label ? "img" : undefined}
      aria-label={label ?? str}
    >
      {chars.map((grid, ci) =>
        grid.map((row, r) =>
          row.split("").map((cell, c) =>
            cell === "1" ? (
              <rect
                key={`${ci}-${r}-${c}`}
                x={ci * stepX + c * pixelSize}
                y={r * pixelSize}
                width={pixelSize}
                height={pixelSize}
                fill="currentColor"
              />
            ) : null
          )
        )
      )}
    </svg>
  );
}

