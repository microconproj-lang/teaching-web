import React from "react";

export type PixelIconName =
  | "map"
  | "badge"
  | "work"
  | "me"
  | "needle"
  | "lock"
  | "flag"
  | "knot"
  | "run"
  | "send"
  | "classroom"
  | "export"
  | "warn"
  | "check"
  | "close"
  | "settings"
  | "up"
  | "down"
  | "eye"
  | "back"
  | "clear"
  | "symmetry";

/**
 * SVG sprite เดียวสำหรับไอคอนกริด 16×16 ทั้งระบบ (ไม่มีไลบรารีไอคอนสำเร็จรูป ไม่มี emoji)
 */
export function PixelSpriteDefs() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {/* 1. แผนที่ (map) */}
        <symbol id="px-map" viewBox="0 0 16 16">
          <rect x="1" y="2" width="4" height="12" fill="currentColor" opacity="0.28" />
          <rect x="6" y="1" width="4" height="12" fill="currentColor" opacity="0.16" />
          <rect x="11" y="3" width="4" height="12" fill="currentColor" opacity="0.28" />
          <path
            d="M1 2h4v1H2v10h3v1H1V2zm5-1h4v1H6V1zm5 2h4v12h-4v-1h3V4h-3V3zM5 13h5v1H5v-1z"
            fill="currentColor"
          />
          <rect x="3" y="5" width="2" height="2" fill="currentColor" />
          <rect x="7" y="7" width="2" height="2" fill="currentColor" />
          <rect x="11" y="9" width="2" height="2" fill="currentColor" />
        </symbol>

        {/* 2. ตราปัก (badge) */}
        <symbol id="px-badge" viewBox="0 0 16 16">
          <path
            d="M5 1h6v1h2v1h1v2h1v6h-1v2h-1v1h-2v1H5v-1H3v-1H2v-2H1V5h1V3h1V2h2V1zm1 2v1H4v2H3v4h1v2h2v1h4v-1h2v-2h1V6h-1V4h-2V3H6z"
            fill="currentColor"
          />
          <rect x="7" y="5" width="2" height="6" fill="currentColor" />
          <rect x="5" y="7" width="6" height="2" fill="currentColor" />
        </symbol>

        {/* 3. งาน (work) */}
        <symbol id="px-work" viewBox="0 0 16 16">
          <rect x="5" y="1" width="6" height="2" fill="currentColor" />
          <path
            d="M2 3h12v12H2V3zm2 2v8h8V5H4z"
            fill="currentColor"
          />
          <rect x="5" y="7" width="6" height="2" fill="currentColor" />
          <rect x="5" y="10" width="4" height="2" fill="currentColor" />
        </symbol>

        {/* 4. ฉัน (me) */}
        <symbol id="px-me" viewBox="0 0 16 16">
          <rect x="6" y="2" width="4" height="4" fill="currentColor" />
          <rect x="5" y="3" width="6" height="2" fill="currentColor" />
          <rect x="3" y="9" width="10" height="5" fill="currentColor" />
          <rect x="4" y="8" width="8" height="2" fill="currentColor" />
        </symbol>

        {/* 5. เข็ม (needle) */}
        <symbol id="px-needle" viewBox="0 0 16 16">
          <rect x="11" y="1" width="3" height="2" fill="currentColor" />
          <rect x="10" y="3" width="2" height="2" fill="currentColor" />
          <rect x="8" y="5" width="2" height="2" fill="currentColor" />
          <rect x="6" y="7" width="2" height="2" fill="currentColor" />
          <rect x="4" y="9" width="2" height="2" fill="currentColor" />
          <rect x="2" y="11" width="2" height="2" fill="currentColor" />
          <rect x="1" y="13" width="2" height="2" fill="currentColor" />
          <rect x="13" y="2" width="2" height="2" fill="currentColor" />
        </symbol>

        {/* 6. กุญแจ (lock) */}
        <symbol id="px-lock" viewBox="0 0 16 16">
          <path d="M5 2h6v1h1v4h-2V4H6v3H4V3h1V2z" fill="currentColor" />
          <path d="M3 7h10v8H3V7zm4 2v4h2V9H7z" fill="currentColor" />
        </symbol>

        {/* 7. ธง (flag) */}
        <symbol id="px-flag" viewBox="0 0 16 16">
          <rect x="3" y="1" width="2" height="14" fill="currentColor" />
          <rect x="5" y="2" width="8" height="6" fill="currentColor" />
          <rect x="13" y="3" width="1" height="4" fill="currentColor" />
          <rect x="2" y="13" width="4" height="2" fill="currentColor" />
        </symbol>

        {/* 8. ปมคำใบ้ (knot) */}
        <symbol id="px-knot" viewBox="0 0 16 16">
          <rect x="1" y="7" width="4" height="2" fill="currentColor" />
          <rect x="11" y="7" width="4" height="2" fill="currentColor" />
          <path d="M5 4h6v8H5V4zm2 2v4h2V6H7z" fill="currentColor" />
          <rect x="4" y="5" width="1" height="6" fill="currentColor" />
          <rect x="11" y="5" width="1" height="6" fill="currentColor" />
        </symbol>

        {/* 9. รัน (run) */}
        <symbol id="px-run" viewBox="0 0 16 16">
          <rect x="3" y="2" width="2" height="12" fill="currentColor" />
          <rect x="5" y="3" width="2" height="10" fill="currentColor" />
          <rect x="7" y="4" width="2" height="8" fill="currentColor" />
          <rect x="9" y="5" width="2" height="6" fill="currentColor" />
          <rect x="11" y="6" width="2" height="4" fill="currentColor" />
          <rect x="13" y="7" width="1" height="2" fill="currentColor" />
        </symbol>

        {/* 10. ส่ง (send) */}
        <symbol id="px-send" viewBox="0 0 16 16">
          <rect x="1" y="7" width="10" height="2" fill="currentColor" />
          <rect x="9" y="5" width="2" height="6" fill="currentColor" />
          <rect x="7" y="3" width="2" height="2" fill="currentColor" />
          <rect x="7" y="11" width="2" height="2" fill="currentColor" />
          <rect x="11" y="6" width="2" height="4" fill="currentColor" />
          <rect x="13" y="7" width="2" height="2" fill="currentColor" />
        </symbol>

        {/* 11. ห้องเรียน (classroom) */}
        <symbol id="px-classroom" viewBox="0 0 16 16">
          <path d="M1 2h14v9H1V2zm2 2v5h10V4H3z" fill="currentColor" />
          <rect x="4" y="12" width="2" height="3" fill="currentColor" />
          <rect x="10" y="12" width="2" height="3" fill="currentColor" />
          <rect x="5" y="6" width="6" height="1" fill="currentColor" />
        </symbol>

        {/* 12. ส่งออก (export) */}
        <symbol id="px-export" viewBox="0 0 16 16">
          <rect x="7" y="1" width="2" height="8" fill="currentColor" />
          <rect x="5" y="3" width="2" height="2" fill="currentColor" />
          <rect x="9" y="3" width="2" height="2" fill="currentColor" />
          <rect x="3" y="5" width="2" height="2" fill="currentColor" />
          <rect x="11" y="5" width="2" height="2" fill="currentColor" />
          <path d="M2 10h2v3h8v-3h2v5H2v-5z" fill="currentColor" />
        </symbol>

        {/* 13. เตือน (warn) */}
        <symbol id="px-warn" viewBox="0 0 16 16">
          <rect x="7" y="1" width="2" height="2" fill="currentColor" />
          <rect x="5" y="3" width="6" height="2" fill="currentColor" />
          <path d="M4 5h8v2h2v3h1v4H1v-4h1V7h2V5zm3 1v4h2V6H7zm0 5v2h2v-2H7z" fill="currentColor" />
        </symbol>

        {/* 14. ถูก (check) */}
        <symbol id="px-check" viewBox="0 0 16 16">
          <rect x="12" y="3" width="2" height="2" fill="currentColor" />
          <rect x="10" y="5" width="2" height="2" fill="currentColor" />
          <rect x="8" y="7" width="2" height="2" fill="currentColor" />
          <rect x="6" y="9" width="2" height="2" fill="currentColor" />
          <rect x="4" y="11" width="2" height="2" fill="currentColor" />
          <rect x="2" y="9" width="2" height="2" fill="currentColor" />
        </symbol>

        {/* 15. ปิด (close) */}
        <symbol id="px-close" viewBox="0 0 16 16">
          <rect x="3" y="3" width="2" height="2" fill="currentColor" />
          <rect x="11" y="3" width="2" height="2" fill="currentColor" />
          <rect x="5" y="5" width="2" height="2" fill="currentColor" />
          <rect x="9" y="5" width="2" height="2" fill="currentColor" />
          <rect x="7" y="7" width="2" height="2" fill="currentColor" />
          <rect x="5" y="9" width="2" height="2" fill="currentColor" />
          <rect x="9" y="9" width="2" height="2" fill="currentColor" />
          <rect x="3" y="11" width="2" height="2" fill="currentColor" />
          <rect x="11" y="11" width="2" height="2" fill="currentColor" />
        </symbol>

        {/* 16. ตั้งค่า (settings) */}
        <symbol id="px-settings" viewBox="0 0 16 16">
          <rect x="6" y="1" width="4" height="2" fill="currentColor" />
          <rect x="6" y="13" width="4" height="2" fill="currentColor" />
          <rect x="1" y="6" width="2" height="4" fill="currentColor" />
          <rect x="13" y="6" width="2" height="4" fill="currentColor" />
          <path d="M3 3h10v10H3V3zm3 3v4h4V6H6z" fill="currentColor" />
        </symbol>

        {/* เสริม: ขึ้น / ลง / ตา / กลับ / ล้าง / สมมาตร */}
        <symbol id="px-up" viewBox="0 0 16 16">
          <rect x="7" y="3" width="2" height="10" fill="currentColor" />
          <rect x="5" y="5" width="2" height="2" fill="currentColor" />
          <rect x="9" y="5" width="2" height="2" fill="currentColor" />
          <rect x="3" y="7" width="2" height="2" fill="currentColor" />
          <rect x="11" y="7" width="2" height="2" fill="currentColor" />
        </symbol>

        <symbol id="px-down" viewBox="0 0 16 16">
          <rect x="7" y="3" width="2" height="10" fill="currentColor" />
          <rect x="5" y="9" width="2" height="2" fill="currentColor" />
          <rect x="9" y="9" width="2" height="2" fill="currentColor" />
          <rect x="3" y="7" width="2" height="2" fill="currentColor" />
          <rect x="11" y="7" width="2" height="2" fill="currentColor" />
        </symbol>

        <symbol id="px-eye" viewBox="0 0 16 16">
          <path d="M3 4h10v2h2v4h-2v2H3v-2H1V6h2V4zm0 2v4h10V6H3z" fill="currentColor" />
          <rect x="7" y="7" width="2" height="2" fill="currentColor" />
        </symbol>

        <symbol id="px-back" viewBox="0 0 16 16">
          <rect x="5" y="7" width="9" height="2" fill="currentColor" />
          <rect x="5" y="5" width="2" height="6" fill="currentColor" />
          <rect x="3" y="6" width="2" height="4" fill="currentColor" />
          <rect x="1" y="7" width="2" height="2" fill="currentColor" />
        </symbol>

        <symbol id="px-clear" viewBox="0 0 16 16">
          <path d="M2 3h12v2H2V3zm1 3h10v8H3V6zm2 2v4h2V8H5zm4 0v4h2V8H9z" fill="currentColor" />
          <rect x="6" y="1" width="4" height="2" fill="currentColor" />
        </symbol>

        <symbol id="px-symmetry" viewBox="0 0 16 16">
          <rect x="7" y="1" width="2" height="2" fill="currentColor" />
          <rect x="7" y="5" width="2" height="2" fill="currentColor" />
          <rect x="7" y="9" width="2" height="2" fill="currentColor" />
          <rect x="7" y="13" width="2" height="2" fill="currentColor" />
          <rect x="2" y="4" width="3" height="8" fill="currentColor" />
          <rect x="11" y="4" width="3" height="8" fill="currentColor" />
        </symbol>
      </defs>
    </svg>
  );
}

export function PixelIcon({
  name,
  size = 16,
  className = "",
  label,
}: {
  name: PixelIconName;
  size?: number;
  className?: string;
  label?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={`inline-block shrink-0 ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <use href={`#px-${name}`} />
    </svg>
  );
}

export const ALL_REQUIRED_SPRITE_ICONS: { name: PixelIconName; label: string }[] = [
  { name: "map", label: "แผนที่" },
  { name: "badge", label: "ตราปัก" },
  { name: "work", label: "งาน" },
  { name: "me", label: "ฉัน" },
  { name: "needle", label: "เข็ม" },
  { name: "lock", label: "กุญแจ" },
  { name: "flag", label: "ธง" },
  { name: "knot", label: "ปมคำใบ้" },
  { name: "run", label: "รัน" },
  { name: "send", label: "ส่ง" },
  { name: "classroom", label: "ห้องเรียน" },
  { name: "export", label: "ส่งออก" },
  { name: "warn", label: "เตือน" },
  { name: "check", label: "ถูก" },
  { name: "close", label: "ปิด" },
  { name: "settings", label: "ตั้งค่า" },
];

