"use client";

import type { ModulePlayerProps } from "@/core/modules/contract";
import {
  OrderClassifyModulePlayer,
  type OrderClassifyPlayerTheme,
} from "@/core/components/OrderClassifyModulePlayer";

const MICROBIT_PLAYER_THEME: OrderClassifyPlayerTheme = {
  courseCode: "ว21202",
  navAriaLabel: "ด่านในชุดภารกิจ ว21202 micro:bit",
  allDoneText: "ผ่านครบทั้ง 13 หน่วย ว21202 micro:bit แล้ว!",
  remainingText: (remainingCount) => `เหลืออีก ${remainingCount} ด่าน (Unit 01–13)`,
  accentBadgeClass: "bg-[#065F46] text-emerald-200",
  progressBarClass: "bg-gradient-to-r from-[#064E3B] via-[#059669] to-[#34D399]",
  orderTitle: "พื้นที่จัดลำดับอัลกอริทึมและกระบวนการ (Algorithm & Process)",
  orderSubtitle: "ลากบล็อกหรือกดลูกศรขึ้น–ลง เพื่อเรียงลำดับการทำงานของ micro:bit ให้ถูกต้อง",
  orderGoal: "เรียงลำดับขั้นตอน MakeCode และหลักวิทยาการคำนวณให้ถูกต้อง",
  classifyTitle: "พื้นที่จำแนกข้อมูลและฮาร์ดแวร์ (CS Classification)",
  classifySubtitle: "คลิกเลือกป้ายหมวดหมู่ที่ถูกต้องให้กับแต่ละรายการ",
  classifyGoal: "จำแนกองค์ประกอบ ตัวแปร พิกัด หรือเซนเซอร์ให้ตรงหมวดหมู่",
};

export default function MicrobitM1Player(props: ModulePlayerProps) {
  return <OrderClassifyModulePlayer {...props} theme={MICROBIT_PLAYER_THEME} />;
}
