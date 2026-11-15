"use client";

import { useState } from "react";
import { Award, CheckCircle2, HelpCircle, Play } from "lucide-react";
import type { BadgeDefinition } from "@/core/grading/badges";

export function DesignShowcaseClient({
  badgesSample,
}: {
  badgesSample: BadgeDefinition[];
}) {
  const [hints, setHints] = useState(1);
  const [testToast, setTestToast] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <section className="ed-card space-y-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-bold text-[#092551]">
            4. ชิ้นส่วนโต้ตอบ (Buttons, Hints, Inputs, Badges)
          </h2>
          {testToast && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {testToast}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="ed-btn-primary"
            onClick={() => setTestToast("รันโค้ดจำลองสำเร็จ (+10 XP)")}
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Primary Azure Button</span>
          </button>
          <button
            type="button"
            className="ed-btn-secondary"
            onClick={() => setHints((h) => (h >= 3 ? 0 : h + 1))}
          >
            <HelpCircle className="h-4 w-4 text-[#1364E7]" />
            <span>คำใบ้ ({hints}/3)</span>
          </button>
          <input
            type="text"
            placeholder="ตัวอย่างช่องกรอก Modern EdTech Input..."
            className="input-thread max-w-xs"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {badgesSample.map((b) => (
            <div
              key={b.key}
              className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/40 p-3.5"
            >
              <div className="squircle-amber flex h-10 w-10 shrink-0 items-center justify-center text-white">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#092551]">{b.title}</div>
                <div className="mt-0.5 text-[11px] text-[#5C7299]">{b.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
