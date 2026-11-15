import type { ModuleDefinition } from "@/core/modules/contract";

/**
 * แม่แบบสำหรับเพิ่ม Module ใหม่ในอนาคต
 * ขั้นตอน:
 * 1. คัดลอกโฟลเดอร์ _template เป็นชื่อ module ใหม่ เช่น src/modules/logic-gate-m2
 * 2. สร้าง Player.tsx และตรรกะตรวจคะแนนใน gradeSubmission
 * 3. ลงทะเบียนใน src/core/modules/registry.ts
 */
export const templateModule: ModuleDefinition = {
  manifest: {
    moduleKey: "template-module",
    version: "1.0.0",
    title: "Template Module",
    description: "แม่แบบสำหรับสร้างบทเรียน/เกมใหม่",
    runtimeType: "native",
    targetGrades: [1, 2, 3],
    competencyTags: [],
  },
  loadPlayer: async () => {
    throw new Error("Template module is not playable directly.");
  },
  gradeSubmission: ({ maxScore }) => ({
    score: 0,
    maxScore,
    stars: 0,
    passed: false,
    feedback: "Not implemented",
    reviewFlag: "none",
    reviewReasons: [],
  }),
};

