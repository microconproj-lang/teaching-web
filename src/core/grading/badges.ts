export type BadgeIconKey = "rocket" | "star" | "brain" | "shield" | "trophy";

export interface BadgeDefinition {
  key: string;
  code: string;
  title: string;
  description: string;
  iconKey: BadgeIconKey;
  accent: "cobalt" | "lime" | "orange";
  xpBonus: number;
  /** ลาย pixel art 12×12 ('.' = ว่าง, '+' = --cloth-deep, '#' = --reward) */
  pixelGrid: string[];
}

/**
 * ตราปักสะสมความพยายามและทักษะ — เก็บลาย 12×12 เป็น string array ในโค้ดเพื่อเรนเดอร์เป็น SVG <rect>
 */
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    key: "first-mission",
    code: "BDG-01",
    title: "เข็มแรก",
    description: "ทอภารกิจแรกสำเร็จด้วยตัวเอง",
    iconKey: "rocket",
    accent: "cobalt",
    xpBonus: 10,
    pixelGrid: [
      "........++..",
      ".......+##+.",
      "......+#++..",
      ".....+##+...",
      "....+##+....",
      "...+##+.....",
      "..+##+......",
      ".+##+.......",
      ".++.........",
      "...##.......",
      ".....###....",
      "........###.",
    ],
  },
  {
    key: "perfect-star",
    code: "BDG-02",
    title: "ปักแน่นสามดาว",
    description: "ปักด่านใดด่านหนึ่งได้ครบ 3 ดาว",
    iconKey: "star",
    accent: "lime",
    xpBonus: 20,
    pixelGrid: [
      ".....++.....",
      "....+##+....",
      "...+#++#+...",
      "..+#+##+#+..",
      ".+#+#++#+#+.",
      "+#+#+##+#+#+",
      "+#+#+##+#+#+",
      ".+#+#++#+#+.",
      "..+#+##+#+..",
      "...+#++#+...",
      "....+##+....",
      ".....++.....",
    ],
  },
  {
    key: "zero-hint",
    code: "BDG-03",
    title: "ไม่ผูกปมเลย",
    description: "ผ่านด่านโดยไม่ขอคำใบ้สักปมเดียว",
    iconKey: "brain",
    accent: "cobalt",
    xpBonus: 20,
    pixelGrid: [
      "............",
      "....++++....",
      "...+....+...",
      "++++....++++",
      "#++++++++++#",
      "............",
      "..########..",
      ".#+......+#.",
      ".#+..##..+#.",
      "..########..",
      "............",
      "++++++++++++",
    ],
  },
  {
    key: "never-give-up",
    code: "BDG-04",
    title: "แกะตะเข็บใหม่",
    description: "ลองแก้และรันซ้ำตั้งแต่ 3 ครั้งขึ้นไปจนผ่าน",
    iconKey: "shield",
    accent: "orange",
    xpBonus: 20,
    pixelGrid: [
      "...++++++...",
      "..+######+..",
      ".+#......#+.",
      ".+#..++..#+.",
      "....+##+....",
      "..++####++..",
      ".+##....##+.",
      ".+#..++..#+.",
      ".+#......#+.",
      "..+######+..",
      "...++++++...",
      "............",
    ],
  },
  {
    key: "quest-complete",
    code: "BDG-05",
    title: "ทอครบทั้งผืน",
    description: "ทอผ่านครบทุกด่านในชุดภารกิจ",
    iconKey: "trophy",
    accent: "lime",
    xpBonus: 30,
    pixelGrid: [
      "++++++++++++",
      "+##++##++##+",
      "+##++##++##+",
      "++++++++++++",
      ".+########+.",
      ".+########+.",
      "..++++++++..",
      "....+##+....",
      "....+##+....",
      "..++++++++..",
      ".+########+.",
      "++++++++++++",
    ],
  },
];

export function getBadgeDefinition(key: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find((b) => b.key === key);
}
