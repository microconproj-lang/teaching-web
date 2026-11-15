import type { ModuleManifest } from "@/core/modules/contract";

export const iotSeM3Manifest: ModuleManifest = {
  moduleKey: "iot-se-m3",
  version: "1.0.0",
  title: "ภารกิจวิศวกรรมซอฟต์แวร์ & IoT (ว23202)",
  description:
    "ฝึกวางแผน Agile/Scrum จัดลำดับ MoSCoW ออกแบบสถาปัตยกรรม Edge–Broker–Web คัดแยกบั๊ก QA และเตรียมส่งมอบระบบ IoT ครบทั้ง 9 หน่วย (ม.3)",
  runtimeType: "native",
  targetGrades: [3],
  competencyTags: ["ว23202", "Software Engineering", "IoT", "MQTT", "Agile/Scrum", "QA Testing"],
  worldKey: "world-4",
};
