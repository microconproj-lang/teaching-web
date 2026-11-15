export interface PlayerLevelInfo {
  level: number;
  rankTitle: string;
  rankBadgeClass: string;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
}

export const RANK_TIERS = [
  { minLevel: 1, title: "นักสำรวจเริ่มต้น", badgeClass: "bg-sky-100 text-sky-800 border-sky-200" },
  { minLevel: 2, title: "นักสำรวจข้อมูล", badgeClass: "bg-blue-100 text-blue-800 border-blue-200" },
  { minLevel: 3, title: "นักล่าอัลกอริทึม", badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  { minLevel: 4, title: "นักผจญภัยโค้ด", badgeClass: "bg-violet-100 text-violet-800 border-violet-200" },
  { minLevel: 5, title: "ผู้พิทักษ์ไซเบอร์", badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { minLevel: 6, title: "ปรมาจารย์โค้ด", badgeClass: "bg-amber-100 text-amber-800 border-amber-200" },
] as const;

export interface ArenaTierInfo {
  name: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
  minAp: number;
  gradient: string;
  badgeClass: string;
}

export const ARENA_TIERS: ArenaTierInfo[] = [
  {
    name: "Bronze",
    minAp: 0,
    gradient: "from-amber-600 to-orange-700",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
  },
  {
    name: "Silver",
    minAp: 1100,
    gradient: "from-slate-400 to-slate-600",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
  },
  {
    name: "Gold",
    minAp: 1300,
    gradient: "from-yellow-400 to-amber-500",
    badgeClass: "bg-yellow-50 text-yellow-800 border-yellow-300",
  },
  {
    name: "Platinum",
    minAp: 1550,
    gradient: "from-cyan-400 to-blue-600",
    badgeClass: "bg-cyan-50 text-cyan-800 border-cyan-200",
  },
  {
    name: "Diamond",
    minAp: 1850,
    gradient: "from-indigo-500 to-purple-600",
    badgeClass: "bg-indigo-50 text-indigo-800 border-indigo-200",
  },
];

/**
 * คำนวณเลเวลและยศสายวิทยาการคำนวณจาก XP สะสม (ทุก 150 XP = 1 เลเวล)
 */
export function getPlayerLevelInfo(totalXp: number): PlayerLevelInfo {
  const safeXp = Math.max(0, Math.floor(totalXp));
  const xpPerLevel = 150;
  const level = Math.floor(safeXp / xpPerLevel) + 1;
  const xpInCurrentLevel = safeXp % xpPerLevel;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpPerLevel) * 100));
  const tierIdx = Math.min(RANK_TIERS.length - 1, Math.floor((level - 1) / 2));
  const tier = RANK_TIERS[tierIdx];

  return {
    level,
    rankTitle: tier.title,
    rankBadgeClass: tier.badgeClass,
    xpInCurrentLevel,
    xpForNextLevel: xpPerLevel,
    progressPercent,
  };
}

export function getArenaTierInfo(ap: number): ArenaTierInfo {
  let active = ARENA_TIERS[0];
  for (const tier of ARENA_TIERS) {
    if (ap >= tier.minAp) active = tier;
  }
  return active;
}
