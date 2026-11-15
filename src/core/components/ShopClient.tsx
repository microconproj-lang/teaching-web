"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Coins, History, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { SHOP_ITEMS, type ShopItemDef } from "@/core/config/shop";
import type { ShopItemCategory } from "@/core/db/schema";
import { usePlatformState } from "@/core/components/PlatformStateProvider";

export function ShopClient() {
  const { state, buyItem, equipItem } = usePlatformState();
  const [cat, setCat] = useState<"all" | ShopItemCategory | "history">("all");
  const [petNickname, setPetNickname] = useState("");
  const [buyingKey, setBuyingKey] = useState<string | null>(null);

  const visibleItems =
    cat === "all" || cat === "history"
      ? SHOP_ITEMS
      : SHOP_ITEMS.filter((i) => i.category === cat);

  const isOwned = (item: ShopItemDef) => {
    if (item.category === "egg" || item.category === "food") return false;
    return state.inventory.some((inv) => inv.itemKey === item.key);
  };

  const isEquipped = (item: ShopItemDef) => {
    if (item.category === "theme") return state.equippedThemeKey === item.key;
    if (item.category === "frame") return state.equippedFrameKey === item.key;
    if (item.category === "effect") return state.equippedEffectKey === item.key;
    if (item.category === "habitat") {
      return state.pets.some((p) => p.isActive && p.habitatKey === item.key);
    }
    return false;
  };

  const handleBuy = async (item: ShopItemDef) => {
    setBuyingKey(item.key);
    try {
      await buyItem(item.key, item.category === "egg" ? petNickname : undefined);
      if (item.category === "egg") setPetNickname("");
    } finally {
      setBuyingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner ร้านของคุณเหมียว */}
      <section className="ed-hero overflow-hidden p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-800 shadow-xs">
              <ShoppingBag className="h-3.5 w-3.5 text-amber-500" />
              <span>ร้านของคุณเหมียว · Meow Cosmetic Shop</span>
            </div>
            <h1 className="font-display text-2xl font-semibold text-[#092551] sm:text-3xl">
              แลก Coins ตกแต่งธีมโค้ดและคู่หูสัตว์เลี้ยง
            </h1>
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="h-4 w-4" />
              <span>ของทุกชิ้นเป็นของตกแต่งเพื่อความสนุก ไม่มีผลกับคะแนนเรียนหรือเกรดในรายวิชา</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="rounded-2xl border border-amber-200 bg-white px-5 py-3 text-right shadow-xs">
              <div className="text-xs text-[#5C7299]">ยอด Coins คงเหลือ</div>
              <div className="font-display text-2xl font-semibold text-amber-600">
                🪙 {state.coins.toLocaleString()} Coins
              </div>
            </div>
            <Link href="/pets" className="text-xs font-semibold text-[#1364E7] hover:underline">
              ไปห้องดูแลสัตว์เลี้ยงของฉัน →
            </Link>
          </div>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-[#E1EAFB] bg-white p-2 shadow-xs">
        {[
          { key: "all" as const, label: "สินค้าทั้งหมด" },
          { key: "egg" as const, label: "🥚 ไข่สัตว์เลี้ยง" },
          { key: "food" as const, label: "🍪 อาหารสัตว์เลี้ยง" },
          { key: "habitat" as const, label: "🏝️ ที่อยู่สัตว์เลี้ยง" },
          { key: "theme" as const, label: "🎨 ธีม Code Editor" },
          { key: "frame" as const, label: "🖼️ กรอบโปรไฟล์ & เอฟเฟกต์" },
          { key: "history" as const, label: "📜 ประวัติ Coins" },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setCat(t.key)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              cat === t.key
                ? "bg-[#1364E7] text-white shadow-xs"
                : "text-[#5C7299] hover:bg-[#F4F7FD] hover:text-[#092551]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {cat === "history" ? (
        <section className="ed-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[#E1EAFB] bg-[#F8FAFF] px-6 py-4">
            <History className="h-4 w-4 text-[#1364E7]" />
            <h2 className="font-display text-lg font-semibold text-[#092551]">
              ประวัติรับ-จ่าย Coins ล่าสุด
            </h2>
          </div>
          <div className="divide-y divide-[#E1EAFB]">
            {state.coinLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between gap-4 px-6 py-3.5 text-sm">
                <div>
                  <div className="font-medium text-[#092551]">{log.description}</div>
                  <div className="text-xs text-[#7485A4]">
                    {new Date(log.createdAt).toLocaleString("th-TH")}
                  </div>
                </div>
                <span
                  className={`font-mono font-bold ${
                    log.amount >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {log.amount >= 0 ? `+${log.amount}` : log.amount} 🪙
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <>
          {(cat === "all" || cat === "egg") && (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#D4E4FC] bg-white px-5 py-3.5 text-xs">
              <span className="font-semibold text-[#092551]">ตั้งชื่อล่วงหน้าหากฟักไข่สัตว์เลี้ยง:</span>
              <input
                type="text"
                maxLength={20}
                value={petNickname}
                onChange={(e) => setPetNickname(e.target.value)}
                placeholder="เว้นว่างเพื่อใช้ชื่อสายพันธุ์อัตโนมัติ"
                className="input-thread !min-h-9 !max-w-xs text-xs"
              />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems
              .filter((item) => cat !== "frame" || item.category === "frame" || item.category === "effect")
              .map((item) => {
                const owned = isOwned(item);
                const equipped = isEquipped(item);
                const qtyInBag =
                  state.inventory.find((i) => i.itemKey === item.key)?.quantity ?? 0;

                return (
                  <div key={item.key} className="ed-card flex flex-col justify-between p-5">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4F7FD] text-2xl shadow-xs">
                          {item.icon}
                        </span>
                        <div className="flex flex-col items-end gap-1">
                          {item.badgeText && (
                            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                              {item.badgeText}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 font-mono text-xs font-bold text-amber-900">
                            <Coins className="h-3 w-3 text-amber-500" />
                            {item.price}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-display text-base font-semibold text-[#092551]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-[#5C7299]">
                          {item.description}
                        </p>
                      </div>

                      {item.dropRates && (
                        <div className="rounded-xl border border-[#E1EAFB] bg-[#F8FAFF] p-2.5 text-[11px]">
                          <div className="font-semibold text-[#092551]">อัตราสุ่มโปร่งใส:</div>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {item.dropRates.map((dr) => (
                              <span
                                key={dr.rarity}
                                className="rounded-md bg-white px-2 py-0.5 font-mono text-[10px] text-[#35517D]"
                              >
                                {dr.label} {dr.chance}%
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 border-t border-[#E1EAFB] pt-3.5">
                      {equipped ? (
                        <div className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-xs font-semibold text-emerald-800">
                          <Check className="h-4 w-4" />
                          <span>กำลังใช้งานอยู่</span>
                        </div>
                      ) : owned && (item.category === "theme" || item.category === "frame" || item.category === "effect" || item.category === "habitat") ? (
                        <button
                          type="button"
                          onClick={() => equipItem(item.category as "theme" | "frame" | "effect" | "habitat", item.key)}
                          className="ed-btn-secondary w-full !min-h-10 !text-xs"
                        >
                          สวมใส่ / ใช้งาน
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={buyingKey !== null || state.coins < item.price}
                          onClick={() => handleBuy(item)}
                          className="ed-btn-primary w-full !min-h-10 !text-xs"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>
                            {buyingKey === item.key
                              ? "กำลังดำเนินการ..."
                              : item.category === "egg"
                                ? `ฟักไข่ (${item.price} Coins)`
                                : qtyInBag > 0
                                  ? `ซื้อเพิ่ม (มีแล้ว ${qtyInBag})`
                                  : `แลกด้วย ${item.price} Coins`}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}

