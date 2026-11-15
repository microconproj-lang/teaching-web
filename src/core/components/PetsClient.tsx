"use client";

import Link from "next/link";
import { useState } from "react";
import { Cookie, Edit3, Heart, PawPrint, ShoppingBag, Sparkles, Star } from "lucide-react";
import { getPetSpecies } from "@/core/config/shop";
import { usePlatformState } from "@/core/components/PlatformStateProvider";

const HABITAT_STYLES: Record<string, { label: string; bg: string }> = {
  "habitat-desk": {
    label: "โต๊ะเขียนโค้ดมินิมอล",
    bg: "from-[#F4FBFF] via-[#E4F3FF] to-[#EBEBFD] text-[#092551]",
  },
  "habitat-coral": {
    label: "เกาะปะการังโค้ด",
    bg: "from-cyan-500 via-teal-500 to-emerald-600 text-white",
  },
  "habitat-cyber": {
    label: "สถานีอวกาศไซเบอร์",
    bg: "from-[#071B3D] via-[#1A103D] to-[#0B387C] text-white",
  },
};

export function PetsClient() {
  const { state, petAction, equipItem } = usePlatformState();
  const activePet = state.pets.find((p) => p.isActive) ?? state.pets[0];
  const [renaming, setRenaming] = useState(false);
  const [nickInput, setNickInput] = useState("");

  const cookieQty = state.inventory.find((i) => i.itemKey === "food-cookie")?.quantity ?? 0;
  const salmonQty = state.inventory.find((i) => i.itemKey === "food-salmon")?.quantity ?? 0;
  const ownedHabitats = state.inventory
    .filter((i) => i.category === "habitat")
    .map((i) => i.itemKey);

  if (!activePet) {
    return (
      <div className="ed-card p-8 text-center">
        <p className="text-sm text-[#5C7299]">ยังไม่มีสัตว์เลี้ยงคู่หู ลองไปฟักไข่ที่ร้านของคุณเหมียวดูสิ!</p>
        <Link href="/shop" className="ed-btn-primary mt-4">
          ไปร้านของคุณเหมียว →
        </Link>
      </div>
    );
  }

  const sp = getPetSpecies(activePet.speciesKey);
  const habitat = HABITAT_STYLES[activePet.habitatKey] ?? HABITAT_STYLES["habitat-desk"];
  const growthLevel = Math.floor(activePet.growthXp / 50) + 1;

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#D4E4FC] bg-white px-6 py-4 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="squircle-rose flex h-11 w-11 items-center justify-center text-white shadow-xs">
            <PawPrint className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-xl font-semibold text-[#092551] sm:text-2xl">
              สัตว์เลี้ยงคู่หูของฉัน
            </h1>
            <p className="text-xs text-[#5C7299]">
              ผ่านแบบฝึกหัดในบทเรียน, Coding Lab หรือแผนที่ล่าสมบัติ จะเพิ่มความสนิทและ Growth ให้อัตโนมัติ
            </p>
          </div>
        </div>

        <Link href="/shop" className="ed-btn-primary !min-h-10 !px-4 !text-xs">
          <ShoppingBag className="h-4 w-4" />
          <span>ซื้อไข่ / อาหารที่ร้านคุณเหมียว</span>
        </Link>
      </section>

      {/* Active Pet Showcase */}
      <div className="grid gap-6 lg:grid-cols-12">
        <section
          className={`relative overflow-hidden rounded-[24px] border border-[#D4E4FC] bg-gradient-to-br p-7 shadow-lg lg:col-span-7 ${habitat.bg}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-black/15 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
              ฉากหลัง: {habitat.label}
            </span>
            <span className="rounded-full bg-white/25 px-3 py-1 font-mono text-xs font-bold uppercase backdrop-blur-xs">
              {activePet.rarity} · เติบโต LV {growthLevel}
            </span>
          </div>

          <div className="my-8 flex flex-col items-center text-center">
            <div
              className={`animate-float-slow flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br ${sp.gradient} text-7xl shadow-xl ring-4 ring-white/60`}
            >
              {sp.emoji}
            </div>

            {renaming ? (
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  maxLength={20}
                  value={nickInput}
                  onChange={(e) => setNickInput(e.target.value)}
                  className="input-thread !w-44 text-center text-sm font-semibold"
                />
                <button
                  type="button"
                  onClick={async () => {
                    await petAction("rename", activePet.id, { nickname: nickInput });
                    setRenaming(false);
                  }}
                  className="ed-btn-primary !min-h-9 !px-3 !text-xs"
                >
                  บันทึก
                </button>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2">
                <h2 className="font-display text-2xl font-semibold">{activePet.nickname}</h2>
                <button
                  type="button"
                  onClick={() => {
                    setNickInput(activePet.nickname);
                    setRenaming(true);
                  }}
                  className="rounded-lg bg-black/10 p-1.5 hover:bg-black/20"
                  title="เปลี่ยนชื่อ"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <p className="mt-1 text-xs opacity-90">
              {sp.name} · นิสัย: {activePet.trait}
            </p>
            <p className="mt-1 max-w-[38ch] text-xs opacity-80">{sp.description}</p>
          </div>

          {/* Habitat Quick Switch */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {(["habitat-desk", ...ownedHabitats] as string[]).map((hk) => (
              <button
                key={hk}
                type="button"
                onClick={() => equipItem("habitat", hk)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  activePet.habitatKey === hk
                    ? "bg-white text-[#092551] shadow-sm"
                    : "bg-black/15 text-current hover:bg-black/25"
                }`}
              >
                {HABITAT_STYLES[hk]?.label ?? hk}
              </button>
            ))}
          </div>
        </section>

        {/* Care Controls & Meters */}
        <section className="ed-card flex flex-col justify-between p-6 lg:col-span-5">
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-[#092551]">
              สถานะและการดูแล
            </h3>

            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-xs font-semibold text-[#11264A]">
                  <span>ความอิ่ม (Hunger)</span>
                  <span>{activePet.hunger}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#E8F0FD]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                    style={{ width: `${activePet.hunger}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs font-semibold text-[#11264A]">
                  <span>ความสนิท (Closeness)</span>
                  <span>{activePet.closeness}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#E8F0FD]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all"
                    style={{ width: `${activePet.closeness}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs font-semibold text-[#11264A]">
                  <span>ค่าการเติบโต (Growth XP)</span>
                  <span>{activePet.growthXp} XP</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#E8F0FD]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-[#1364E7] transition-all"
                    style={{ width: `${(activePet.growthXp % 50) * 2}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                disabled={cookieQty === 0}
                onClick={() => petAction("feed", activePet.id, { foodKey: "food-cookie" })}
                className="flex w-full items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-2">
                  <Cookie className="h-4 w-4 text-amber-600" />
                  <span>ป้อนคุกกี้บิตกรอบ (+25 อิ่ม)</span>
                </span>
                <span className="font-mono">เหลือ {cookieQty} ชิ้น</span>
              </button>

              <button
                type="button"
                disabled={salmonQty === 0}
                onClick={() => petAction("feed", activePet.id, { foodKey: "food-salmon" })}
                className="flex w-full items-center justify-between rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-xs font-semibold text-orange-900 hover:bg-orange-100 disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-orange-600" />
                  <span>ป้อนสเต๊กไบต์พรีเมียม (+55 อิ่ม)</span>
                </span>
                <span className="font-mono">เหลือ {salmonQty} ชิ้น</span>
              </button>

              <button
                type="button"
                onClick={() => petAction("play", activePet.id)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-800 hover:bg-rose-100"
              >
                <Heart className="h-4 w-4" />
                <span>เล่นกับคู่หู (+8 ความสนิท · +10 Growth)</span>
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-[#E1EAFB] bg-[#F8FAFF] p-3 text-xs text-[#5C7299]">
            <Star className="mr-1 inline h-3.5 w-3.5 text-amber-500" />
            คู่หูที่เลือกใช้งานจะปรากฏที่มุมขวาล่างของทุกหน้าในแพลตฟอร์ม
          </div>
        </section>
      </div>

      {/* Pet Collection */}
      <section className="ed-card p-6">
        <h3 className="font-display text-lg font-semibold text-[#092551]">
          คลังสัตว์เลี้ยงของฉัน ({state.pets.length} ตัว)
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {state.pets.map((p) => {
            const pSp = getPetSpecies(p.speciesKey);
            return (
              <div
                key={p.id}
                className={`rounded-2xl border p-4 transition ${
                  p.isActive
                    ? "border-[#1364E7] bg-[#EFF6FF]"
                    : "border-[#E1EAFB] bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${pSp.gradient} text-2xl`}
                  >
                    {pSp.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-[#092551]">{p.nickname}</div>
                    <div className="text-[11px] uppercase text-[#5C7299]">
                      {pSp.name} · {p.rarity}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={p.isActive}
                  onClick={() => petAction("setActive", p.id)}
                  className={`mt-3 w-full rounded-xl py-1.5 text-xs font-semibold ${
                    p.isActive
                      ? "bg-[#1364E7] text-white"
                      : "border border-[#D4E2FA] bg-white text-[#092551] hover:bg-[#F4F7FD]"
                  }`}
                >
                  {p.isActive ? "กำลังพกพาอยู่" : "ตั้งเป็นคู่หูหลัก"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

