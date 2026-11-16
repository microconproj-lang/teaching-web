import type { ModuleManifest } from "@/core/modules/contract";
import { BADGE_DEFINITIONS } from "@/core/grading/badges";

export const algoQuestManifest: ModuleManifest = {
  moduleKey: "algo-quest-m1",
  version: "1.1.0",
  title: "ลำดับขั้นตอน ตรรกะ และวงจรออกแบบ Tinkercad (ว21103 · ม.1)",
  description:
    "ฝึกแยกส่วนปัญหา จัดลำดับคำสั่ง และออกแบบการต่อวงจร Micro:bit + LED + ตัวต้านทานบน Tinkercad อย่างปลอดภัย (หน่วยที่ 1 และหน่วยที่ 5)",
  runtimeType: "native",
  targetGrades: [1],
  competencyTags: ["ว21103", "ว 4.1 ม.1/4", "ว 4.1 ม.1/5", "ว 4.2 ม.1/1", "Tinkercad", "Micro:bit", "Algorithm"],
  worldKey: "world-1",
  badges: BADGE_DEFINITIONS.map((b) => ({
    key: b.key,
    title: b.title,
    description: b.description,
    pixelGrid: b.pixelGrid,
  })),
};
