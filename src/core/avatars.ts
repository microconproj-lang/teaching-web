export interface AvatarOption {
  key: string;
  label: string;
  emoji: string;
  gradient: string;
  threadHex: string;
  /** ลายทอ 8×8 คงไว้เพื่อ backward-compatibility กับส่วนที่ยังใช้อ้างอิง */
  pattern: string[];
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    key: "vector-node",
    label: "นักสำรวจโค้ด",
    emoji: "🚀",
    gradient: "from-sky-400 to-blue-600",
    threadHex: "#1364E7",
    pattern: [
      "...++...",
      "..+##+..",
      ".+#..#+.",
      "+#.##.#+",
      "+#.##.#+",
      ".+#..#+.",
      "..+##+..",
      "...++...",
    ],
  },
  {
    key: "binary-core",
    label: "แกนไบนารี",
    emoji: "💻",
    gradient: "from-cyan-400 to-teal-600",
    threadHex: "#0891B2",
    pattern: [
      "+......+",
      "#+....+#",
      ".#+..+#.",
      "..+##+..",
      ".+#..#+.",
      "#+....+#",
      "+......+",
      "########",
    ],
  },
  {
    key: "signal-wave",
    label: "สายฟ้าไพธอน",
    emoji: "⚡",
    gradient: "from-amber-400 to-orange-500",
    threadHex: "#F59E0B",
    pattern: [
      "++......",
      "##++....",
      "..##++..",
      "....##++",
      "++......",
      "##++....",
      "..##++..",
      "....##++",
    ],
  },
  {
    key: "circuit-hex",
    label: "จอมเวทลอจิก",
    emoji: "🔮",
    gradient: "from-purple-400 to-violet-600",
    threadHex: "#8B5CF6",
    pattern: [
      "++..##..",
      "++..##..",
      "..++..##",
      "..++..##",
      "##..++..",
      "##..++..",
      "..##..++",
      "..##..++",
    ],
  },
  {
    key: "logic-gate",
    label: "วิศวกรวงจร",
    emoji: "⚙️",
    gradient: "from-emerald-400 to-green-600",
    threadHex: "#10B981",
    pattern: [
      "..+..+..",
      "..+..+..",
      "++#++#++",
      "..#..#..",
      "..#..#..",
      "++#++#++",
      "..+..+..",
      "..+..+..",
    ],
  },
  {
    key: "orbital-sat",
    label: "ดาวเทียมไซเบอร์",
    emoji: "🛰️",
    gradient: "from-indigo-400 to-blue-700",
    threadHex: "#4F46E5",
    pattern: [
      "...##...",
      "..#++#..",
      ".#+..+#.",
      "#+.##.+#",
      "#+.##.+#",
      ".#+..+#.",
      "..#++#..",
      "...##...",
    ],
  },
  {
    key: "pixel-matrix",
    label: "แมวนักเขียนโค้ด",
    emoji: "🐱",
    gradient: "from-rose-400 to-pink-600",
    threadHex: "#EC4899",
    pattern: [
      ".+....+.",
      "+#+..+#+",
      ".+.##.+.",
      "..#++#..",
      "..#++#..",
      ".+.##.+.",
      "+#+..+#+",
      ".+....+.",
    ],
  },
  {
    key: "cipher-ring",
    label: "ผู้พิทักษ์เกราะ",
    emoji: "🛡️",
    gradient: "from-emerald-500 to-cyan-600",
    threadHex: "#0D9488",
    pattern: [
      "++++++++",
      "+......+",
      "+.####.+",
      "+.#++#.+",
      "+.#++#.+",
      "+.####.+",
      "+......+",
      "++++++++",
    ],
  },
  {
    key: "prism-delta",
    label: "คริสตัลข้อมูล",
    emoji: "💎",
    gradient: "from-sky-500 to-indigo-600",
    threadHex: "#2563EB",
    pattern: [
      "++....++",
      ".++..++.",
      "..####..",
      "...##...",
      "...##...",
      "..####..",
      ".++..++.",
      "++....++",
    ],
  },
  {
    key: "packet-pulse",
    label: "หุ่นยนต์น้อย",
    emoji: "🤖",
    gradient: "from-fuchsia-500 to-purple-600",
    threadHex: "#A855F7",
    pattern: [
      "##....##",
      "##.++.##",
      "..+##+..",
      ".+#..#+.",
      ".+#..#+.",
      "..+##+..",
      "##.++.##",
      "##....##",
    ],
  },
  {
    key: "kernel-spark",
    label: "เข็มทิศอัลกอริทึม",
    emoji: "🧭",
    gradient: "from-orange-400 to-red-500",
    threadHex: "#EA580C",
    pattern: [
      "+.#..#.+",
      ".+#..#+.",
      "##.##.##",
      "...++...",
      "...++...",
      "##.##.##",
      ".+#..#+.",
      "+.#..#.+",
    ],
  },
  {
    key: "radar-sweep",
    label: "มังกรนักรันโค้ด",
    emoji: "🐉",
    gradient: "from-teal-400 to-emerald-600",
    threadHex: "#059669",
    pattern: [
      "..++++..",
      ".+####+.",
      "+#....#+",
      "+#.++.#+",
      "+#.++.#+",
      "+#....#+",
      ".+####+.",
      "..++++..",
    ],
  },
];

export const DEFAULT_AVATAR_KEY = "vector-node";

export function getAvatar(key: string | null | undefined): AvatarOption {
  return AVATAR_OPTIONS.find((a) => a.key === key) ?? AVATAR_OPTIONS[0];
}

export function isValidAvatarKey(key: unknown): key is string {
  return typeof key === "string" && AVATAR_OPTIONS.some((a) => a.key === key);
}
