import type { ModuleManifest } from "@/core/modules/contract";
import { BADGE_DEFINITIONS } from "@/core/grading/badges";

export const algoQuestManifest: ModuleManifest = {
  moduleKey: "algo-quest-m1",
  version: "1.0.0",
  title: "ลำดับขั้นตอนและตรรกะ (ม.1)",
  description:
    "ฝึกแยกส่วนปัญหา จัดลำดับคำสั่ง และแก้โจทย์ตรรกะทีละตะเข็บ พร้อมชุดข้อมูลเฉพาะตัวของเธอ",
  runtimeType: "native",
  targetGrades: [1],
  competencyTags: ["ว 4.2 ม.1/1", "Algorithm", "Computational Thinking"],
  worldKey: "world-1",
  badges: BADGE_DEFINITIONS.map((b) => ({
    key: b.key,
    title: b.title,
    description: b.description,
    pixelGrid: b.pixelGrid,
  })),
};
