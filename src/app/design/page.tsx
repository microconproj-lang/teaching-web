import Link from "next/link";
import { Code2, Compass, Layers, Palette, Shield, Sparkles, Terminal } from "lucide-react";
import { ServerAppShell } from "@/core/components/ServerAppShell";
import { DesignShowcaseClient } from "@/core/components/DesignShowcaseClient";
import { StitchCellGlyph } from "@/core/components/TeacherHeatmapClient";
import { AVATAR_OPTIONS } from "@/core/avatars";
import { AvatarEmblem } from "@/core/components/AvatarEmblem";
import { BADGE_DEFINITIONS } from "@/core/grading/badges";
import { WORLD_MANIFESTS } from "@/core/config/worlds";

const SWATCHES = [
  { name: "--canvas", label: "Ice Blue Canvas", hex: "#F4F7FD", darkText: true },
  { name: "--surface", label: "Pure White Card", hex: "#FFFFFF", darkText: true },
  { name: "--navy-top", label: "Deep Navy Sidebar", hex: "#071B3B", darkText: false },
  { name: "--ink-heading", label: "Primary Navy Ink", hex: "#092551", darkText: false },
  { name: "--azure", label: "Electric Azure CTA", hex: "#1364E7", darkText: false },
  { name: "--azure-bright", label: "Bright Azure Focus", hex: "#227FF5", darkText: false },
  { name: "--ide-bg", label: "Dark Navy IDE Panel", hex: "#081A37", darkText: false },
  { name: "--ide-ok", label: "Terminal Green Status", hex: "#64DCA2", darkText: true },
  { name: "--reward", label: "Coins & Streak Amber", hex: "#F59E0B", darkText: true },
];

export default function DesignSystemPage() {
  return (
    <ServerAppShell activePath="design">
      <div className="space-y-8">
        <section className="ed-hero p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#1364E7]">
                <Palette className="h-3.5 w-3.5" />
                <span>PCCPL Code · Modern Navy EdTech Design System</span>
              </div>
              <h1 className="mt-2 font-display text-2xl font-bold text-[#092551] sm:text-3xl">
                คู่มือระบบออกแบบและชิ้นส่วน UI
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-[#5C7299]">
                ชุดสี ตัวอักษร Kanit / Prompt / IBM Plex Mono กรอบอวตาร ไอคอน Squircle การ์ด IDE และองค์ประกอบห้องเรียน
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link href="/" className="ed-btn-secondary text-sm">
                <span>กลับหน้าแรก</span>
              </Link>
              <Link href="/dashboard" className="ed-btn-primary text-sm">
                <span>เปิดแดชบอร์ด</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 1. Color Tokens */}
        <section className="ed-card space-y-4 p-6">
          <h2 className="font-display text-xl font-bold text-[#092551]">1. ชุดสีของระบบ (Palette)</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SWATCHES.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between rounded-2xl border border-[#DCE7FA] p-3.5 shadow-xs"
                style={{
                  backgroundColor: s.hex,
                  color: s.darkText ? "#092551" : "#FFFFFF",
                }}
              >
                <div>
                  <div className="text-sm font-bold">{s.label}</div>
                  <div className="text-xs opacity-80">{s.name}</div>
                </div>
                <span className="rounded-lg border border-current/30 px-2 py-0.5 font-mono text-xs font-semibold">
                  {s.hex}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography & Avatars */}
        <section className="ed-card space-y-5 p-6">
          <h2 className="font-display text-xl font-bold text-[#092551]">
            2. ตัวอักษร ไอคอน Squircle และกรอบอวตาร
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-[#E1EAFB] bg-[#F8FAFF] p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#5C7299]">
                Kanit (Display) + Prompt (UI) + IBM Plex Mono (Code)
              </p>
              <p className="ed-h1-gradient font-display text-3xl font-bold">
                เขียนโค้ดอย่างเข้าใจ ตั้งแต่พื้นฐาน
              </p>
              <p className="text-sm text-[#11264A]">
                ระยะบรรทัดโปร่งสบายตา รองรับจอห้องปฏิบัติการคอมพิวเตอร์ โปรเจกเตอร์ และแท็บเล็ต
              </p>
              <pre className="rounded-2xl bg-[#081A37] p-4 font-code text-xs text-[#E4EDFF]">
                {`for step in range(4):\n    print("Step:", step)`}
              </pre>
            </div>

            <div className="space-y-4 rounded-2xl border border-[#E1EAFB] bg-[#F8FAFF] p-5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="squircle-blue flex h-12 w-12 items-center justify-center text-white shadow-sm">
                  <Code2 className="h-6 w-6" />
                </div>
                <div className="squircle-amber flex h-12 w-12 items-center justify-center text-white shadow-sm">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="squircle-purple flex h-12 w-12 items-center justify-center text-white shadow-sm">
                  <Layers className="h-6 w-6" />
                </div>
                <div className="squircle-emerald flex h-12 w-12 items-center justify-center text-white shadow-sm">
                  <Terminal className="h-6 w-6" />
                </div>
                <div className="squircle-rose flex h-12 w-12 items-center justify-center text-white shadow-sm">
                  <Compass className="h-6 w-6" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {AVATAR_OPTIONS.slice(0, 6).map((a, idx) => (
                  <AvatarEmblem
                    key={a.key}
                    avatarKey={a.key}
                    frameKey={idx === 0 ? "azure-ring" : idx === 1 ? "gold-spark" : "none"}
                    size={46}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Teacher Heatmap Accessible Glyphs + Worlds + Badges */}
        <section className="ed-card space-y-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-bold text-[#092551]">
              3. สัญลักษณ์ Heatmap สำหรับครู (แยกออกแม้ปิดสี) และโลกหลักสูตร
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#1364E7]">
              <Shield className="h-3.5 w-3.5" /> Accessible Glyphs Preserved
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-[#E1EAFB] bg-[#F8FAFF] p-4 text-xs font-semibold text-[#092551]">
            <span className="inline-flex items-center gap-2">
              <StitchCellGlyph status="mastered" hasKnot={false} /> 3 ดาว (Mastered)
            </span>
            <span className="inline-flex items-center gap-2">
              <StitchCellGlyph status="passed" hasKnot={false} /> ผ่าน (Passed)
            </span>
            <span className="inline-flex items-center gap-2">
              <StitchCellGlyph status="stuck" hasKnot={false} /> ติดขัดหลายครั้ง (Needs Help)
            </span>
            <span className="inline-flex items-center gap-2">
              <StitchCellGlyph status="none" hasKnot={true} /> ควรถามปากเปล่า (Flagged)
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {WORLD_MANIFESTS.map((w) => (
              <div key={w.key} className="rounded-2xl border border-[#E1EAFB] bg-[#F8FAFF] p-4">
                <div className="text-xs font-bold text-[#1364E7]">World {w.order}</div>
                <div className="mt-1 font-display text-sm font-bold text-[#092551]">{w.title}</div>
                <div className="mt-1 text-xs text-[#5C7299]">{w.subtitle}</div>
              </div>
            ))}
          </div>
        </section>

        <DesignShowcaseClient badgesSample={BADGE_DEFINITIONS.slice(0, 4)} />
      </div>
    </ServerAppShell>
  );
}
