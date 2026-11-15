"use client";

import type { ModulePlayerProps } from "@/core/modules/contract";
import {
  OrderClassifyModulePlayer,
  type OrderClassifyPlayerTheme,
} from "@/core/components/OrderClassifyModulePlayer";

const IOT_PLAYER_THEME: OrderClassifyPlayerTheme = {
  courseCode: "ว23202",
  navAriaLabel: "ด่านในชุดภารกิจ ว23202",
  allDoneText: "ผ่านครบทั้ง 9 หน่วย ว23202 แล้ว!",
  remainingText: (remainingCount) => `เหลืออีก ${remainingCount} ด่าน (หน่วย 0–8)`,
  accentBadgeClass: "bg-[#092551] text-[#F0742E]",
  progressBarClass: "bg-gradient-to-r from-[#092551] via-[#1364E7] to-[#F0742E]",
  orderTitle: "พื้นที่จัดลำดับขั้นตอนวิศวกรรม (Architecture Sequence)",
  orderSubtitle: "ลากบล็อกหรือกดลูกศรขึ้น–ลง เพื่อเรียงลำดับจากขั้นแรกจนถึงขั้นสุดท้าย",
  orderGoal: "จัดเรียงขั้นตอนสถาปัตยกรรมและการพัฒนาให้ถูกต้องตามลำดับ",
  classifyTitle: "พื้นที่จำแนกกลุ่ม (Engineering Classification)",
  classifySubtitle: "คลิกเลือกป้ายหมวดหมู่ที่เหมาะสมที่สุดให้กับแต่ละรายการ",
  classifyGoal: "จำแนกทุกรายการให้ตรงหมวดหมู่ทางวิศวกรรมซอฟต์แวร์",
};

export default function IotSeM3Player(props: ModulePlayerProps) {
  return <OrderClassifyModulePlayer {...props} theme={IOT_PLAYER_THEME} />;
}
