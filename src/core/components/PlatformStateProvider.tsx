"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getPetSpecies, rollPetFromEgg, SHOP_ITEMS } from "@/core/config/shop";
import type { ArenaMode } from "@/core/db/schema";
import type { PetView, PlatformClientState } from "@/core/platform/types";

const GUEST_STORAGE_KEY = "pccpl-platform-state-v1";

interface PlatformContextValue {
  state: PlatformClientState;
  toast: { id: number; ok: boolean; text: string } | null;
  clearToast: () => void;
  buyItem: (itemKey: string, nickname?: string) => Promise<{ ok: boolean; hatchedPet?: PetView; error?: string }>;
  equipItem: (kind: "theme" | "frame" | "effect" | "habitat", itemKey: string) => Promise<boolean>;
  petAction: (
    action: "feed" | "play" | "rename" | "setActive",
    petId: string,
    opts?: { foodKey?: string; nickname?: string }
  ) => Promise<boolean>;
  completeLessonCheck: (params: {
    lessonKey: string;
    checkKey: string;
    lastSlide: number;
    coinReward: number;
    xpReward: number;
    label: string;
  }) => Promise<number>;
  claimAdventureReward: (params: {
    kind: "stage" | "chest";
    key: string;
    coinReward: number;
    xpReward: number;
    label: string;
  }) => Promise<number>;
  saveLabFile: (title: string, code: string, fileId?: string) => Promise<void>;
  deleteLabFile: (fileId: string) => Promise<void>;
  recordLabSolve: (problemKey: string, coinReward: number, title: string) => Promise<number>;
  recordArenaResult: (params: {
    problemKey: string;
    code: string;
    mode: ArenaMode;
    durationSec: number;
    passed: boolean;
    apDelta: number;
    coinReward: number;
    title: string;
  }) => Promise<{ grantedCoins: number }>;
  resetGuestProgress: () => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

export function PlatformStateProvider({
  initialState,
  children,
}: {
  initialState: PlatformClientState;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<PlatformClientState>(initialState);
  const [toast, setToast] = useState<{ id: number; ok: boolean; text: string } | null>(null);

  const showToast = useCallback((ok: boolean, text: string) => {
    setToast({ id: Date.now(), ok, text });
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(t);
  }, [toast]);

  const useLocalPersistence = !state.authenticated || !state.dbConnected;

  // Hydrate guest/offline overrides from localStorage
  useEffect(() => {
    if (!useLocalPersistence) return;
    try {
      const raw = localStorage.getItem(GUEST_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<PlatformClientState>;
      setState((prev) => ({
        ...prev,
        coins: typeof saved.coins === "number" ? saved.coins : prev.coins,
        xp: typeof saved.xp === "number" ? saved.xp : prev.xp,
        ap: typeof saved.ap === "number" ? saved.ap : prev.ap,
        equippedThemeKey: saved.equippedThemeKey ?? prev.equippedThemeKey,
        equippedFrameKey: saved.equippedFrameKey ?? prev.equippedFrameKey,
        equippedEffectKey: saved.equippedEffectKey ?? prev.equippedEffectKey,
        inventory: Array.isArray(saved.inventory) ? saved.inventory : prev.inventory,
        coinLogs: Array.isArray(saved.coinLogs) ? saved.coinLogs : prev.coinLogs,
        pets: Array.isArray(saved.pets) && saved.pets.length > 0 ? saved.pets : prev.pets,
        labFiles: Array.isArray(saved.labFiles) && saved.labFiles.length > 0 ? saved.labFiles : prev.labFiles,
        lessonChecks: saved.lessonChecks ?? prev.lessonChecks,
        clearedAdventureKeys: saved.clearedAdventureKeys ?? prev.clearedAdventureKeys,
        claimedIslandChests: saved.claimedIslandChests ?? prev.claimedIslandChests,
        solvedLabKeys: saved.solvedLabKeys ?? prev.solvedLabKeys,
        solvedArenaKeys: saved.solvedArenaKeys ?? prev.solvedArenaKeys,
      }));
    } catch {
      // ignore corrupted local storage
    }
  }, [useLocalPersistence]);

  const commitLocal = useCallback(
    (updater: (prev: PlatformClientState) => PlatformClientState) => {
      setState((prev) => {
        const next = updater(prev);
        if (!next.authenticated || !next.dbConnected) {
          try {
            localStorage.setItem(
              GUEST_STORAGE_KEY,
              JSON.stringify({
                coins: next.coins,
                xp: next.xp,
                ap: next.ap,
                equippedThemeKey: next.equippedThemeKey,
                equippedFrameKey: next.equippedFrameKey,
                equippedEffectKey: next.equippedEffectKey,
                inventory: next.inventory,
                coinLogs: next.coinLogs,
                pets: next.pets,
                labFiles: next.labFiles,
                lessonChecks: next.lessonChecks,
                clearedAdventureKeys: next.clearedAdventureKeys,
                claimedIslandChests: next.claimedIslandChests,
                solvedLabKeys: next.solvedLabKeys,
                solvedArenaKeys: next.solvedArenaKeys,
              })
            );
          } catch {
            // ignore quota error
          }
        }
        return next;
      });
    },
    []
  );

  const buyItem = useCallback(
    async (itemKey: string, nickname?: string) => {
      const item = SHOP_ITEMS.find((i) => i.key === itemKey);
      if (!item) return { ok: false, error: "ไม่พบสินค้า" };
      if (state.coins < item.price) {
        const msg = `Coins ไม่พอ (มี ${state.coins} แต่ต้องใช้ ${item.price} Coins)`;
        showToast(false, msg);
        return { ok: false, error: msg };
      }

      if (item.category !== "egg" && item.category !== "food") {
        if (state.inventory.some((inv) => inv.itemKey === itemKey)) {
          showToast(false, "คุณเป็นเจ้าของไอเทมชิ้นนี้แล้ว");
          return { ok: false, error: "เป็นเจ้าของแล้ว" };
        }
      }

      const res = await fetch("/api/shop/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemKey, nickname }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(false, data.error ?? "ซื้อไม่สำเร็จ");
        return { ok: false, error: data.error };
      }

      let hatchedPet: PetView | undefined;
      if (item.category === "egg") {
        if (data.newPet) {
          hatchedPet = data.newPet as PetView;
        } else {
          const sp = rollPetFromEgg(itemKey);
          hatchedPet = {
            id: `pet-${Date.now()}`,
            speciesKey: sp.key,
            nickname: nickname?.trim() || sp.name,
            rarity: sp.rarity,
            growthXp: 15,
            hunger: 90,
            closeness: 40,
            trait: sp.traitDefault,
            habitatKey: "habitat-desk",
            isActive: false,
          };
        }
      }

      commitLocal((prev) => {
        const nextInv = [...prev.inventory];
        if (item.category !== "egg") {
          const idx = nextInv.findIndex((x) => x.itemKey === item.key);
          if (idx >= 0) {
            nextInv[idx] = { ...nextInv[idx], quantity: nextInv[idx].quantity + 1 };
          } else {
            nextInv.push({ itemKey: item.key, category: item.category, quantity: 1 });
          }
        }
        return {
          ...prev,
          coins: typeof data.coins === "number" ? data.coins : prev.coins - item.price,
          inventory: nextInv,
          pets: hatchedPet ? [...prev.pets, hatchedPet] : prev.pets,
          coinLogs: [
            {
              id: `log-${Date.now()}`,
              sourceType: "shop_purchase",
              amount: -item.price,
              description: `ซื้อ ${item.title}`,
              createdAt: new Date().toISOString(),
            },
            ...prev.coinLogs,
          ],
        };
      });

      if (hatchedPet) {
        const sp = getPetSpecies(hatchedPet.speciesKey);
        showToast(true, `ฟักไข่สำเร็จ! ได้รับ ${sp.emoji} "${hatchedPet.nickname}" (${hatchedPet.rarity})`);
      } else {
        showToast(true, `ซื้อ ${item.title} เรียบร้อยแล้ว`);
      }

      return { ok: true, hatchedPet };
    },
    [commitLocal, showToast, state.coins, state.inventory]
  );

  const equipItem = useCallback(
    async (kind: "theme" | "frame" | "effect" | "habitat", itemKey: string) => {
      const res = await fetch("/api/shop/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, itemKey }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        showToast(false, d.error ?? "สวมใส่ไม่สำเร็จ");
        return false;
      }

      commitLocal((prev) => ({
        ...prev,
        equippedThemeKey: kind === "theme" ? itemKey : prev.equippedThemeKey,
        equippedFrameKey: kind === "frame" ? itemKey : prev.equippedFrameKey,
        equippedEffectKey: kind === "effect" ? itemKey : prev.equippedEffectKey,
        pets:
          kind === "habitat"
            ? prev.pets.map((p) => (p.isActive ? { ...p, habitatKey: itemKey } : p))
            : prev.pets,
      }));
      showToast(true, "บันทึกการตกแต่งเรียบร้อย");
      return true;
    },
    [commitLocal, showToast]
  );

  const petAction = useCallback(
    async (
      action: "feed" | "play" | "rename" | "setActive",
      petId: string,
      opts?: { foodKey?: string; nickname?: string }
    ) => {
      if (action === "feed") {
        const foodKey = opts?.foodKey ?? "food-cookie";
        const inv = state.inventory.find((i) => i.itemKey === foodKey);
        if (!inv || inv.quantity <= 0) {
          showToast(false, "ไม่มีอาหารในคลัง กดซื้อที่ร้านคุณเหมียวก่อนนะ!");
          return false;
        }
      }

      const res = await fetch("/api/pets/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, petId, ...opts }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        showToast(false, d.error ?? "ดำเนินการไม่สำเร็จ");
        return false;
      }

      commitLocal((prev) => {
        let nextInv = prev.inventory;
        if (action === "feed") {
          const fk = opts?.foodKey ?? "food-cookie";
          nextInv = prev.inventory
            .map((i) => (i.itemKey === fk ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0);
        }
        const isPremium = opts?.foodKey === "food-salmon";
        const nextPets = prev.pets.map((p) => {
          if (action === "setActive") {
            return { ...p, isActive: p.id === petId };
          }
          if (p.id !== petId) return p;
          if (action === "rename" && opts?.nickname?.trim()) {
            return { ...p, nickname: opts.nickname.trim() };
          }
          if (action === "play") {
            return {
              ...p,
              closeness: Math.min(100, p.closeness + 8),
              growthXp: p.growthXp + 10,
              hunger: Math.max(0, p.hunger - 4),
            };
          }
          if (action === "feed") {
            return {
              ...p,
              hunger: Math.min(100, p.hunger + (isPremium ? 55 : 25)),
              closeness: Math.min(100, p.closeness + (isPremium ? 20 : 10)),
              growthXp: p.growthXp + (isPremium ? 30 : 12),
            };
          }
          return p;
        });

        return { ...prev, inventory: nextInv, pets: nextPets };
      });

      if (action === "feed") showToast(true, "งั่มๆ อิ่มอร่อย! ค่าความสนิทและ Growth เพิ่มขึ้นแล้ว");
      if (action === "play") showToast(true, "เล่นกับคู่หูสนุกจัง! ค่าความสนิท +8");
      if (action === "setActive") showToast(true, "สลับคู่หูประจำตัวเรียบร้อย");
      return true;
    },
    [commitLocal, showToast, state.inventory]
  );

  const completeLessonCheck = useCallback(
    async ({
      lessonKey,
      checkKey,
      lastSlide,
      coinReward,
      xpReward,
      label,
    }: {
      lessonKey: string;
      checkKey: string;
      lastSlide: number;
      coinReward: number;
      xpReward: number;
      label: string;
    }) => {
      const alreadyDone = (state.lessonChecks[lessonKey] ?? []).includes(checkKey);

      const res = await fetch("/api/lessons/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonKey, completedCheckKey: checkKey, lastSlide }),
      });
      const data = await res.json().catch(() => ({}));
      const earned = alreadyDone
        ? 0
        : typeof data.grantedCoins === "number"
          ? data.grantedCoins
          : coinReward;

      commitLocal((prev) => {
        const cur = prev.lessonChecks[lessonKey] ?? [];
        const updatedChecks = cur.includes(checkKey) ? cur : [...cur, checkKey];
        const boost = !alreadyDone && earned > 0;
        return {
          ...prev,
          lessonChecks: { ...prev.lessonChecks, [lessonKey]: updatedChecks },
          coins: boost ? prev.coins + earned : prev.coins,
          xp: boost ? prev.xp + xpReward : prev.xp,
          pets: boost
            ? prev.pets.map((p) =>
                p.isActive ? { ...p, closeness: Math.min(100, p.closeness + 6), growthXp: p.growthXp + 6 } : p
              )
            : prev.pets,
          coinLogs: boost
            ? [
                {
                  id: `log-${Date.now()}`,
                  sourceType: "lesson_exercise",
                  amount: earned,
                  description: `ผ่านกิจกรรมบทเรียน: ${label}`,
                  createdAt: new Date().toISOString(),
                },
                ...prev.coinLogs,
              ]
            : prev.coinLogs,
        };
      });

      if (earned > 0) showToast(true, `ผ่านกิจกรรม! รับ +${earned} Coins และสัตว์เลี้ยงสนิทขึ้น +6`);
      return earned;
    },
    [commitLocal, showToast, state.lessonChecks]
  );

  const claimAdventureReward = useCallback(
    async ({
      kind,
      key,
      coinReward,
      xpReward,
      label,
    }: {
      kind: "stage" | "chest";
      key: string;
      coinReward: number;
      xpReward: number;
      label: string;
    }) => {
      const already =
        kind === "stage" ? state.clearedAdventureKeys.includes(key) : state.claimedIslandChests.includes(key);

      const res = await fetch("/api/adventure/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, key }),
      });
      const data = await res.json().catch(() => ({}));
      const earned = already
        ? 0
        : typeof data.grantedCoins === "number"
          ? data.grantedCoins
          : coinReward;

      commitLocal((prev) => {
        const boost = !already && earned > 0;
        return {
          ...prev,
          clearedAdventureKeys:
            kind === "stage" && !prev.clearedAdventureKeys.includes(key)
              ? [...prev.clearedAdventureKeys, key]
              : prev.clearedAdventureKeys,
          claimedIslandChests:
            kind === "chest" && !prev.claimedIslandChests.includes(key)
              ? [...prev.claimedIslandChests, key]
              : prev.claimedIslandChests,
          coins: boost ? prev.coins + earned : prev.coins,
          xp: boost ? prev.xp + xpReward : prev.xp,
          pets: boost
            ? prev.pets.map((p) =>
                p.isActive ? { ...p, closeness: Math.min(100, p.closeness + 8), growthXp: p.growthXp + 8 } : p
              )
            : prev.pets,
          coinLogs: boost
            ? [
                {
                  id: `log-${Date.now()}`,
                  sourceType: "adventure_chest",
                  amount: earned,
                  description: label,
                  createdAt: new Date().toISOString(),
                },
                ...prev.coinLogs,
              ]
            : prev.coinLogs,
        };
      });

      if (earned > 0) showToast(true, `ปลดล็อกรางวัล! +${earned} Coins · +${xpReward} XP`);
      return earned;
    },
    [commitLocal, showToast, state.claimedIslandChests, state.clearedAdventureKeys]
  );

  const saveLabFile = useCallback(
    async (title: string, code: string, fileId?: string) => {
      const res = await fetch("/api/lab/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_file", title, code, fileId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(false, data.error ?? "บันทึกไฟล์ไม่สำเร็จ");
        return;
      }
      const saved = data.file as { id: string; title: string; code: string; updatedAt: string };
      commitLocal((prev) => {
        const exists = prev.labFiles.some((f) => f.id === saved.id);
        const nextFiles = exists
          ? prev.labFiles.map((f) => (f.id === saved.id ? { ...f, title: saved.title, code: saved.code, updatedAt: saved.updatedAt } : f))
          : [{ id: saved.id, title: saved.title, language: "python" as const, code: saved.code, updatedAt: saved.updatedAt }, ...prev.labFiles];
        return { ...prev, labFiles: nextFiles };
      });
      showToast(true, `บันทึกไฟล์ ${title} เรียบร้อย`);
    },
    [commitLocal, showToast]
  );

  const deleteLabFile = useCallback(
    async (fileId: string) => {
      await fetch("/api/lab/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_file", fileId }),
      });
      commitLocal((prev) => ({
        ...prev,
        labFiles: prev.labFiles.filter((f) => f.id !== fileId),
      }));
    },
    [commitLocal]
  );

  const recordLabSolve = useCallback(
    async (problemKey: string, coinReward: number, title: string) => {
      const already = state.solvedLabKeys.includes(problemKey);
      const earned = already ? 0 : coinReward;
      commitLocal((prev) => ({
        ...prev,
        solvedLabKeys: already ? prev.solvedLabKeys : [...prev.solvedLabKeys, problemKey],
        coins: prev.coins + earned,
        xp: prev.xp + (already ? 0 : 25),
        pets:
          earned > 0
            ? prev.pets.map((p) =>
                p.isActive ? { ...p, closeness: Math.min(100, p.closeness + 6), growthXp: p.growthXp + 6 } : p
              )
            : prev.pets,
        coinLogs:
          earned > 0
            ? [
                {
                  id: `log-${Date.now()}`,
                  sourceType: "lesson_exercise",
                  amount: earned,
                  description: `ผ่านโจทย์ Coding Lab: ${title}`,
                  createdAt: new Date().toISOString(),
                },
                ...prev.coinLogs,
              ]
            : prev.coinLogs,
      }));
      if (earned > 0) showToast(true, `ตรวจผ่านทุก Test! +${earned} Coins · +25 XP`);
      return earned;
    },
    [commitLocal, showToast, state.solvedLabKeys]
  );

  const recordArenaResult = useCallback(
    async ({
      problemKey,
      code,
      mode,
      durationSec,
      passed,
      apDelta,
      coinReward,
      title,
    }: {
      problemKey: string;
      code: string;
      mode: ArenaMode;
      durationSec: number;
      passed: boolean;
      apDelta: number;
      coinReward: number;
      title: string;
    }) => {
      const res = await fetch("/api/arena/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemKey, code, mode, durationSec }),
      });
      const data = await res.json().catch(() => ({}));
      const already = state.solvedArenaKeys.includes(problemKey);
      const grantedCoins = passed
        ? already
          ? 0
          : typeof data.grantedCoins === "number"
            ? data.grantedCoins
            : coinReward
        : 0;

      commitLocal((prev) => ({
        ...prev,
        ap: typeof data.newAp === "number" ? data.newAp : Math.max(800, prev.ap + apDelta),
        coins: prev.coins + grantedCoins,
        xp: prev.xp + (grantedCoins > 0 ? 35 : 0),
        solvedArenaKeys:
          passed && !prev.solvedArenaKeys.includes(problemKey)
            ? [...prev.solvedArenaKeys, problemKey]
            : prev.solvedArenaKeys,
        coinLogs:
          grantedCoins > 0
            ? [
                {
                  id: `log-${Date.now()}`,
                  sourceType: "arena_match",
                  amount: grantedCoins,
                  description: `พิชิต Arena: ${title}`,
                  createdAt: new Date().toISOString(),
                },
                ...prev.coinLogs,
              ]
            : prev.coinLogs,
      }));

      if (passed) {
        showToast(
          true,
          `ชนะการประลอง! AP ${apDelta >= 0 ? "+" : ""}${apDelta}${grantedCoins > 0 ? ` · +${grantedCoins} Coins` : ""}`
        );
      } else if (apDelta < 0) {
        showToast(false, `ยังไม่ผ่านทุกเคส (AP ${apDelta}) ลองปรับโค้ดแล้วสู้ใหม่!`);
      }
      return { grantedCoins };
    },
    [commitLocal, showToast, state.solvedArenaKeys]
  );

  const resetGuestProgress = useCallback(() => {
    try {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    } catch {
      // ignore
    }
    setState(initialState);
    showToast(true, "รีเซ็ตข้อมูลโหมดทดลองเริ่มต้นใหม่แล้ว");
  }, [initialState, showToast]);

  return (
    <PlatformContext.Provider
      value={{
        state,
        toast,
        clearToast,
        buyItem,
        equipItem,
        petAction,
        completeLessonCheck,
        claimAdventureReward,
        saveLabFile,
        deleteLabFile,
        recordLabSolve,
        recordArenaResult,
        resetGuestProgress,
      }}
    >
      {children}
      {toast && (
        <div
          role="status"
          className={`fixed top-20 right-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium shadow-xl transition-all ${
            toast.ok
              ? "border-emerald-200 bg-white text-[#092551] shadow-emerald-900/10"
              : "border-rose-200 bg-rose-50 text-rose-900 shadow-rose-900/10"
          }`}
        >
          <span className="text-lg">{toast.ok ? "✅" : "⚠️"}</span>
          <span className="flex-1">{toast.text}</span>
          <button
            type="button"
            onClick={clearToast}
            className="text-xs text-[#7485A4] hover:text-[#092551]"
          >
            ปิด
          </button>
        </div>
      )}
    </PlatformContext.Provider>
  );
}

export function usePlatformState() {
  const ctx = useContext(PlatformContext);
  if (!ctx) {
    throw new Error("usePlatformState must be used inside PlatformStateProvider");
  }
  return ctx;
}

