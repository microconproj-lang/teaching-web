import type { PetRarity, ShopItemCategory } from "@/core/db/schema";

export interface PetView {
  id: string;
  speciesKey: string;
  nickname: string;
  rarity: PetRarity;
  growthXp: number;
  hunger: number;
  closeness: number;
  trait: string;
  habitatKey: string;
  isActive: boolean;
}

export interface CoinLogView {
  id: string;
  sourceType: string;
  amount: number;
  description: string;
  createdAt: string;
}

export interface LabFileView {
  id: string;
  title: string;
  language: "python" | "pseudocode";
  code: string;
  updatedAt: string;
}

export interface PlatformClientState {
  loaded: boolean;
  authenticated: boolean;
  dbConnected: boolean;
  userId?: string;
  fullName: string;
  email?: string;
  role: "guest" | "student" | "teacher" | "admin";
  roomName?: string;
  studentNumber?: number;
  coins: number;
  xp: number;
  ap: number;
  avatarKey: string;
  equippedThemeKey: string;
  equippedFrameKey: string;
  equippedEffectKey: string;
  inventory: { itemKey: string; category: ShopItemCategory; quantity: number }[];
  coinLogs: CoinLogView[];
  pets: PetView[];
  labFiles: LabFileView[];
  /** key = lessonKey, value = array of completed checkKeys (quizzes + coding missions) */
  lessonChecks: Record<string, string[]>;
  /** passed stage keys on Treasure Map */
  clearedAdventureKeys: string[];
  /** claimed island chest keys */
  claimedIslandChests: string[];
  /** passed Lab problem keys */
  solvedLabKeys: string[];
  /** passed Arena challenge keys */
  solvedArenaKeys: string[];
}

export function buildGuestDefaultState(): PlatformClientState {
  return {
    loaded: true,
    authenticated: false,
    dbConnected: false,
    fullName: "ผู้เยี่ยมชม (Guest)",
    role: "guest",
    coins: 120,
    xp: 60,
    ap: 1000,
    avatarKey: "vector-node",
    equippedThemeKey: "navy-pro",
    equippedFrameKey: "none",
    equippedEffectKey: "confetti",
    inventory: [
      { itemKey: "navy-pro", category: "theme", quantity: 1 },
      { itemKey: "food-cookie", category: "food", quantity: 2 },
    ],
    coinLogs: [
      {
        id: "guest-welcome",
        sourceType: "starter_gift",
        amount: 120,
        description: "Coins เริ่มต้นสำหรับทดลองระบบร้านค้าและสัตว์เลี้ยง (โหมดทดลอง)",
        createdAt: new Date().toISOString(),
      },
    ],
    pets: [
      {
        id: "guest-pet-1",
        speciesKey: "shiba-script",
        nickname: "ปุกปุย",
        rarity: "common",
        growthXp: 35,
        hunger: 82,
        closeness: 48,
        trait: "ชอบช่วยตรวจ Syntax",
        habitatKey: "habitat-desk",
        isActive: true,
      },
    ],
    labFiles: [
      {
        id: "guest-file-1",
        title: "hello_pccpl.py",
        language: "python",
        code: `name = "PCCPL Student"\nscores = [18, 20, 19]\nprint(f"สวัสดี {name}")\nprint("คะแนนเฉลี่ย:", sum(scores) / len(scores))\n`,
        updatedAt: new Date().toISOString(),
      },
    ],
    lessonChecks: {},
    clearedAdventureKeys: [],
    claimedIslandChests: [],
    solvedLabKeys: [],
    solvedArenaKeys: [],
  };
}

