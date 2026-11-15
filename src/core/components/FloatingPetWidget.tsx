"use client";

import Link from "next/link";
import { useState } from "react";
import { Cookie, Heart, Sparkles, X } from "lucide-react";
import { getPetSpecies } from "@/core/config/shop";
import { usePlatformState } from "@/core/components/PlatformStateProvider";

/**
 * Floating Virtual Pet Companion มุมขวาล่างสไตล์ python.pcshstrg.ac.th
 */
export function FloatingPetWidget() {
  const { state, petAction } = usePlatformState();
  const [open, setOpen] = useState(false);

  const activePet = state.pets.find((p) => p.isActive) ?? state.pets[0];
  if (!activePet) return null;

  const species = getPetSpecies(activePet.speciesKey);
  const hasCookie = state.inventory.some((i) => i.itemKey === "food-cookie" && i.quantity > 0);
  const isSleepy = activePet.hunger < 45;

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2 sm:right-6 sm:bottom-6">
      {open && (
        <div className="ed-card w-72 overflow-hidden p-4 shadow-2xl">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${species.gradient} text-2xl shadow-sm`}
              >
                {species.emoji}
              </div>
              <div>
                <div className="font-display text-base font-semibold text-[#092551]">
                  {activePet.nickname}
                </div>
                <div className="text-xs text-[#5C7299]">
                  {species.name} · {activePet.trait}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-[#7485A4] hover:bg-[#F4F7FD] hover:text-[#092551]"
              aria-label="ย่อคู่หูสัตว์เลี้ยง"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div>
              <div className="mb-1 flex justify-between font-medium text-[#11264A]">
                <span>ความอิ่ม</span>
                <span>{activePet.hunger}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#E8F0FD]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                  style={{ width: `${activePet.hunger}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between font-medium text-[#11264A]">
                <span>ความสนิท</span>
                <span>{activePet.closeness}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#E8F0FD]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all"
                  style={{ width: `${activePet.closeness}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => petAction("feed", activePet.id, { foodKey: "food-cookie" })}
              disabled={!hasCookie}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
            >
              <Cookie className="h-3.5 w-3.5" />
              <span>{hasCookie ? "ป้อนขนม" : "ขนมหมด"}</span>
            </button>
            <button
              type="button"
              onClick={() => petAction("play", activePet.id)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-100"
            >
              <Heart className="h-3.5 w-3.5" />
              <span>เล่นด้วย</span>
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#E1EAFB] pt-2.5 text-[11px] text-[#5C7299]">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#1364E7]" />
              ผ่านด่านเพิ่มความสนิท!
            </span>
            <Link href="/pets" className="font-semibold text-[#1364E7] hover:underline">
              เปิดห้องสัตว์เลี้ยง →
            </Link>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group relative flex items-center gap-2 rounded-full border border-[#D4E2FA] bg-white p-1.5 shadow-[0_10px_26px_rgba(18,57,109,0.18)] transition hover:-translate-y-0.5 sm:pr-3.5"
        title={`คู่หู: ${activePet.nickname}`}
        aria-label={`คู่หู ${activePet.nickname}`}
      >
        <span
          className={`animate-float-slow flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${species.gradient} text-2xl shadow-inner`}
        >
          {species.emoji}
        </span>
        <div className="hidden text-left sm:block">
          <div className="text-xs font-semibold text-[#092551]">{activePet.nickname}</div>
          <div className="text-[11px] text-[#5C7299]">
            {isSleepy ? "Z z หิวขนม..." : `สนิท ${activePet.closeness}%`}
          </div>
        </div>
      </button>
    </div>
  );
}

