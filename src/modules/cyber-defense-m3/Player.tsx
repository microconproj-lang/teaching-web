"use client";

import type { ModulePlayerProps } from "@/core/modules/contract";
import {
  OrderClassifyModulePlayer,
  type OrderClassifyPlayerTheme,
} from "@/core/components/OrderClassifyModulePlayer";

const V23103_PLAYER_THEME: OrderClassifyPlayerTheme = {
  courseCode: "ว23103",
  navAriaLabel: "ด่านในชุดภารกิจ ว23103 เทคโนโลยีดิจิทัลและนวัตกรรม",
  allDoneText: "ผ่านครบทั้ง 6 ภารกิจ ว23103 เทคโนโลยีดิจิทัลและนวัตกรรมแล้ว!",
  remainingText: (remainingCount) => `เหลืออีก ${remainingCount} ภารกิจ (หน่วย 1–4)`,
  accentBadgeClass: "bg-teal-700 text-white",
  progressBarClass: "bg-gradient-to-r from-[#047857] via-[#0D9488] to-[#1364E7]",
  orderTitle: "พื้นที่จัดลำดับขั้นตอนนวัตกรรม IoT & Data (Process Order)",
  orderSubtitle: "ลากบล็อกหรือกดลูกศรขึ้น–ลง เพื่อเรียงลำดับขั้นตอนการทำงานให้ถูกต้อง",
  orderGoal: "เรียงลำดับกระบวนการพัฒนาแอป IoT, จัดการข้อมูล Dashboard และ Design Thinking ให้ถูกต้อง",
  classifyTitle: "พื้นที่จำแนกข้อมูล กฎหมาย และเครื่องมือดิจิทัล (Classification)",
  classifySubtitle: "คลิกเลือกป้ายหมวดหมู่ที่ถูกต้องให้กับแต่ละสถานการณ์หรือเครื่องมือ",
  classifyGoal: "จำแนกหลัก Fair Use, ความน่าเชื่อถือข้อมูล, เหตุผลวิบัติ และแพลตฟอร์มดิจิทัลให้ตรงหมวดหมู่",
};

export default function CyberDefenseM3Player(props: ModulePlayerProps) {
  return <OrderClassifyModulePlayer {...props} theme={V23103_PLAYER_THEME} />;
}
