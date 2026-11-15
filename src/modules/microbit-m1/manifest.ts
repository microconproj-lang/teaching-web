import type { ModuleManifest } from "@/core/modules/contract";

export const microbitM1Manifest: ModuleManifest = {
  moduleKey: "microbit-m1",
  version: "1.0.0",
  title: "ภารกิจวิทยาการคำนวณ micro:bit (ว21202)",
  description:
    "ฝึกคิดเชิงออกแบบ อัลกอริทึม ตัวแปร เงื่อนไข ลูป พิกัด LED 5×5 บูลีน ฐานสอง วิทยุ อาเรย์ และเซนเซอร์ความเร่ง ครบทั้ง 13 หน่วย (ม.1)",
  runtimeType: "native",
  targetGrades: [1],
  competencyTags: [
    "ว21202",
    "micro:bit",
    "MakeCode",
    "Coordinates",
    "Booleans",
    "Binary",
    "Radio",
    "Arrays",
    "Accelerometer",
  ],
  worldKey: "world-5",
};
