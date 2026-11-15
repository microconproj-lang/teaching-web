import type { PetRarity, ShopItemCategory } from "@/core/db/schema";

export interface EditorThemeDef {
  key: string;
  name: string;
  price: number;
  bgClass: string;
  barClass: string;
  borderClass: string;
  textClass: string;
  accentHex: string;
  previewSwatches: [string, string, string];
}

export const EDITOR_THEMES: EditorThemeDef[] = [
  {
    key: "navy-pro",
    name: "Deep Navy Studio (เริ่มต้น)",
    price: 0,
    bgClass: "bg-[#081A37]",
    barClass: "bg-[#0A1730]",
    borderClass: "border-[#3F6EA8]",
    textClass: "text-[#E4EDFF]",
    accentHex: "#64DCA2",
    previewSwatches: ["#081A37", "#1364E7", "#64DCA2"],
  },
  {
    key: "emerald-matrix",
    name: "Emerald Matrix",
    price: 45,
    bgClass: "bg-[#071F1B]",
    barClass: "bg-[#041411]",
    borderClass: "border-[#10B981]/50",
    textClass: "text-[#D1FAE5]",
    accentHex: "#34D399",
    previewSwatches: ["#071F1B", "#10B981", "#A7F3D0"],
  },
  {
    key: "synthwave-violet",
    name: "Synthwave Galaxy",
    price: 60,
    bgClass: "bg-[#1A103D]",
    barClass: "bg-[#120A2C]",
    borderClass: "border-[#8B5CF6]/55",
    textClass: "text-[#EDE9FE]",
    accentHex: "#F472B6",
    previewSwatches: ["#1A103D", "#8B5CF6", "#F472B6"],
  },
  {
    key: "amber-terminal",
    name: "Retro Amber Terminal",
    price: 55,
    bgClass: "bg-[#1E1608]",
    barClass: "bg-[#140E04]",
    borderClass: "border-[#F59E0B]/50",
    textClass: "text-[#FEF3C7]",
    accentHex: "#FBBF24",
    previewSwatches: ["#1E1608", "#F59E0B", "#FEF08A"],
  },
  {
    key: "arctic-paper",
    name: "Arctic Light Code",
    price: 50,
    bgClass: "bg-[#F8FBFF]",
    barClass: "bg-[#E8F1FE]",
    borderClass: "border-[#93C5FD]",
    textClass: "text-[#092551]",
    accentHex: "#1364E7",
    previewSwatches: ["#F8FBFF", "#1364E7", "#092551"],
  },
];

export interface ProfileFrameDef {
  key: string;
  name: string;
  price: number;
  ringClass: string;
}

export const PROFILE_FRAMES: ProfileFrameDef[] = [
  { key: "none", name: "กรอบมาตรฐาน", price: 0, ringClass: "ring-2 ring-white" },
  {
    key: "azure-ring",
    name: "วงแหวน Azure",
    price: 35,
    ringClass: "ring-4 ring-[#227FF5] ring-offset-2 ring-offset-white",
  },
  {
    key: "gold-spark",
    name: "มงกุฎทองคำ",
    price: 75,
    ringClass: "ring-4 ring-amber-400 ring-offset-2 ring-offset-amber-50",
  },
  {
    key: "cyber-neon",
    name: "ออร่าไซเบอร์",
    price: 90,
    ringClass: "ring-4 ring-emerald-400 ring-offset-2 ring-offset-[#081A37]",
  },
];

export interface PetSpeciesDef {
  key: string;
  name: string;
  emoji: string;
  rarity: PetRarity;
  traitDefault: string;
  description: string;
  gradient: string;
}

export const PET_SPECIES: PetSpeciesDef[] = [
  {
    key: "shiba-script",
    name: "ชิบะสคริปต์",
    emoji: "🐶",
    rarity: "common",
    traitDefault: "ชอบช่วยตรวจ Syntax",
    description: "น้องหมาคู่ใจนักเขียนโค้ด หลับปุ๋ยที่มุมจอระหว่างคิดอัลกอริทึม",
    gradient: "from-amber-200 to-orange-300",
  },
  {
    key: "meow-loop",
    name: "เหมียวลูป",
    emoji: "🐱",
    rarity: "common",
    traitDefault: "ขี้อายแต่นับรอบแม่น",
    description: "ผู้ช่วยจากร้านคุณเหมียว ชอบนั่งทับคีย์บอร์ดเมื่อโค้ดไม่ยอมออกลูป",
    gradient: "from-pink-200 to-rose-300",
  },
  {
    key: "bunny-byte",
    name: "บันนี่ไบต์",
    emoji: "🐰",
    rarity: "rare",
    traitDefault: "กระโดดไวแบบ O(log n)",
    description: "กระต่ายความเร็วแสงที่ถนัดการค้นหาข้อมูลแบบ Binary Search",
    gradient: "from-sky-200 to-indigo-300",
  },
  {
    key: "owl-cipher",
    name: "นกฮูกไซเฟอร์",
    emoji: "🦉",
    rarity: "epic",
    traitDefault: "ตาไวจับบั๊กกลางดึก",
    description: "ผู้เฝ้าหอคอยไซเบอร์ ชำนาญการถอดรหัสลับและจับผิดลิงก์ปลอม",
    gradient: "from-purple-300 to-violet-400",
  },
  {
    key: "dragon-py",
    name: "มังกรไพธอน",
    emoji: "🐉",
    rarity: "legendary",
    traitDefault: "พ่นไฟรันผ่านทุก Test",
    description: "สัตว์เลี้ยงในตำนานของ PCCPL ปลุกพลังความมั่นใจในสนาม Code Arena",
    gradient: "from-emerald-300 to-cyan-400",
  },
];

export interface ShopItemDef {
  key: string;
  title: string;
  description: string;
  category: ShopItemCategory;
  price: number;
  icon: string;
  badgeText?: string;
  /** อัตราสุ่มโปร่งใสสำหรับไข่สัตว์เลี้ยง */
  dropRates?: { rarity: PetRarity; label: string; chance: number }[];
}

export const SHOP_ITEMS: ShopItemDef[] = [
  {
    key: "egg-basic",
    title: "ไข่สัตว์เลี้ยงพื้นฐาน",
    description: "ฟักคู่หูสายโค้ดได้ทันที พร้อมชื่อสุ่มสุดน่ารัก",
    category: "egg",
    price: 40,
    icon: "🥚",
    badgeText: "ยอดนิยม",
    dropRates: [
      { rarity: "common", label: "Common", chance: 75 },
      { rarity: "rare", label: "Rare", chance: 22 },
      { rarity: "epic", label: "Epic", chance: 3 },
    ],
  },
  {
    key: "egg-explorer",
    title: "ไข่นักสำรวจ Azure",
    description: "เพิ่มโอกาสได้สัตว์เลี้ยง Rare และ Epic สูงขึ้น",
    category: "egg",
    price: 85,
    icon: "💎",
    badgeText: "คุ้มค่า",
    dropRates: [
      { rarity: "common", label: "Common", chance: 35 },
      { rarity: "rare", label: "Rare", chance: 45 },
      { rarity: "epic", label: "Epic", chance: 17 },
      { rarity: "legendary", label: "Legendary", chance: 3 },
    ],
  },
  {
    key: "egg-legendary",
    title: "ไข่ไพธอนในตำนาน",
    description: "การันตีระดับ Rare ขึ้นไป และมีสิทธิ์พบมังกรไพธอน!",
    category: "egg",
    price: 180,
    icon: "✨",
    badgeText: "Limited",
    dropRates: [
      { rarity: "rare", label: "Rare", chance: 40 },
      { rarity: "epic", label: "Epic", chance: 40 },
      { rarity: "legendary", label: "Legendary", chance: 20 },
    ],
  },
  {
    key: "food-cookie",
    title: "คุกกี้บิตกรอบ",
    description: "เพิ่มความอิ่ม +25 และความสนิท +10 ให้สัตว์เลี้ยง",
    category: "food",
    price: 15,
    icon: "🍪",
  },
  {
    key: "food-salmon",
    title: "สเต๊กไบต์พรีเมียม",
    description: "เพิ่มความอิ่ม +55, ความสนิท +20 และ Growth XP +30",
    category: "food",
    price: 35,
    icon: "🍣",
  },
  {
    key: "habitat-coral",
    title: "ที่อยู่: เกาะปะการังโค้ด",
    description: "ฉากหลังห้องสัตว์เลี้ยงธีมทะเลใสหมู่เกาะโครงสร้างข้อมูล",
    category: "habitat",
    price: 55,
    icon: "🏝️",
  },
  {
    key: "habitat-cyber",
    title: "ที่อยู่: สถานีอวกาศไซเบอร์",
    description: "ฉากหลังห้องสัตว์เลี้ยงสไตล์หอคอยคอมพิวเตอร์อนาคต",
    category: "habitat",
    price: 70,
    icon: "🛸",
  },
  ...EDITOR_THEMES.filter((t) => t.price > 0).map((t) => ({
    key: t.key,
    title: `ธีม IDE: ${t.name}`,
    description: "เปลี่ยนสีพื้นหลังและแถบไฮไลต์ใน Coding Lab และบทเรียน",
    category: "theme" as const,
    price: t.price,
    icon: "🎨",
  })),
  ...PROFILE_FRAMES.filter((f) => f.price > 0).map((f) => ({
    key: f.key,
    title: `กรอบโปรไฟล์: ${f.name}`,
    description: "ตกแต่งกรอบรอบรูปอวาตาร์บน Topbar และตารางอันดับ",
    category: "frame" as const,
    price: f.price,
    icon: "🖼️",
  })),
  {
    key: "effect-starlight",
    title: "เอฟเฟกต์ฉลอง: ประกายดาว",
    description: "เอฟเฟกต์แสงดาวเมื่อรันผ่านโจทย์ใน Coding Lab และ Arena",
    category: "effect",
    price: 45,
    icon: "🌟",
  },
];

export function getEditorTheme(key: string | null | undefined): EditorThemeDef {
  return EDITOR_THEMES.find((t) => t.key === key) ?? EDITOR_THEMES[0];
}

export function getProfileFrame(key: string | null | undefined): ProfileFrameDef {
  return PROFILE_FRAMES.find((f) => f.key === key) ?? PROFILE_FRAMES[0];
}

export function getPetSpecies(key: string | null | undefined): PetSpeciesDef {
  return PET_SPECIES.find((p) => p.key === key) ?? PET_SPECIES[0];
}

export function rollPetFromEgg(eggKey: string): PetSpeciesDef {
  const item = SHOP_ITEMS.find((i) => i.key === eggKey);
  const rates = item?.dropRates ?? [{ rarity: "common" as PetRarity, label: "Common", chance: 100 }];
  const roll = Math.random() * 100;
  let acc = 0;
  let chosenRarity: PetRarity = rates[0].rarity;
  for (const r of rates) {
    acc += r.chance;
    if (roll <= acc) {
      chosenRarity = r.rarity;
      break;
    }
  }
  const pool = PET_SPECIES.filter((p) => p.rarity === chosenRarity);
  if (pool.length === 0) return PET_SPECIES[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

