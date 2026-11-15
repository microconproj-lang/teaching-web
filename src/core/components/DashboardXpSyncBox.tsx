"use client";

import { getPlayerLevelInfo } from "@/core/grading/level";
import { usePlatformState } from "@/core/components/PlatformStateProvider";

/**
 * กล่องแสดง XP และ Level บน /dashboard ให้ซิงค์ข้อมูล Guest localStorage แบบเรียลไทม์
 */
export function DashboardXpSyncBox({
  serverXp,
  isAuthenticated,
}: {
  serverXp: number;
  isAuthenticated: boolean;
}) {
  const { state } = usePlatformState();
  const effectiveXp = isAuthenticated ? Math.max(serverXp, state.xp) : state.xp;
  const info = getPlayerLevelInfo(effectiveXp);

  return (
    <div className="rounded-2xl border border-[#DCE7FA] bg-white/90 p-4 lg:col-span-5">
      <div className="flex items-center justify-between text-xs font-bold text-[#092551]">
        <span>
          ความคืบหน้าระดับปัจจุบัน (LV.{info.level} · {info.rankTitle})
        </span>
        <span className="text-[#1364E7]">
          {info.xpInCurrentLevel} / {info.xpForNextLevel} XP ({info.progressPercent}%)
        </span>
      </div>
      <div className="mt-2.5 h-3 overflow-hidden rounded-full bg-[#E8F1FE]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#1364E7] to-[#227FF5] transition-all"
          style={{ width: `${info.progressPercent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-[#5C7299]">
        สะสมแล้วรวม {effectiveXp.toLocaleString()} XP · ทำแบบฝึกหัดผ่านเพื่อเก็บ XP และ Coins
      </p>
    </div>
  );
}

