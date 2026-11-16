import type { CourseDef } from "@/core/config/curriculum-types";

export const V23103_COURSE: CourseDef = {
  code: "ว23103",
  slug: "v23103",
  gradeLevel: 3,
  gradeLabel: "ชั้นมัธยมศึกษาปีที่ 3 (พื้นฐาน)",
  title: "เทคโนโลยีดิจิทัลและนวัตกรรม",
  subtitle:
    "การเปลี่ยนแปลงเทคโนโลยี & ลิขสิทธิ์โดยชอบธรรม, แอปพลิเคชัน IoT (Wokwi / Blynk / micro:bit), Data Cleansing & Dashboard (Google Sheets / ThingsBoard / Looker Studio) และ Design Thinking (70/30 คะแนน)",
  semesterLabel: "ม.3 · ภาคเรียนที่ 1/2569 · ว23103 (4 หน่วย / 20 สัปดาห์)",
  status: "active",
  theme: "teal-shield",
  tags: [
    "นวัตกรรม & สื่อ",
    "IoT App (Wokwi/Blynk)",
    "Data Cleansing & Dashboard",
    "Design Thinking",
    "ว 4.1 & ว 4.2 ม.3",
  ],
  moduleKey: "cyber-defense-m3",
  stats: { lessonsCount: 6, exercisesCount: 8, missionsCount: 11, slidesCount: 20 },
  courseResources: [
    {
      label: "แผนการจัดการเรียนรู้และแผนการประเมินผลฉบับย่อ ว23103 (.pdf)",
      kind: "guide",
      href: "/courses/v23103/sheets/course-plan-v23103.pdf",
    },
  ],
  units: [
    {
      unitNo: 1,
      title: "UNIT 1 : เทคโนโลยีดิจิทัล นวัตกรรม และการรู้เท่าทันสื่อ",
      weekRange: "สัปดาห์ 1–2 (คาบ 1–4)",
      description:
        "ความหมายและการเปลี่ยนแปลงของเทคโนโลยี วิเคราะห์ผลกระทบต่อชีวิตประจำวัน รู้เท่าทันสื่อ เหตุผลวิบัติ กฎหมายคอมพิวเตอร์ ทรัพย์สินทางปัญญา การใช้ลิขสิทธิ์โดยชอบธรรม (Fair Use) และความมั่นคงไซเบอร์ (ว 4.1 ม.3/1, ว 4.2 ม.3/3–4)",
      deliverable: "งานที่ 1.1–1.2 (10 คะแนน) & Infographic Mind Map ผลกระทบเทคโนโลยี",
      status: "active",
      lessonKeys: ["v23103-u1-innovation", "m3-phishing-defense", "m3-caesar-cipher"],
    },
    {
      unitNo: 2,
      title: "UNIT 2 : การพัฒนาแอปพลิเคชัน IoT และการเขียนโปรแกรมควบคุม",
      weekRange: "สัปดาห์ 3–9 (คาบ 5–18) · สอบกลางภาคปฏิบัติ 10%",
      description:
        "พื้นฐานไมโครคอนโทรลเลอร์ การใช้ข้อมูลและทรัพยากรเขียนโปรแกรมควบคุมเซนเซอร์ เชื่อมโยงแอปพลิเคชัน IoT ผ่าน Wokwi, Blynk และ MakeCode micro:bit (ว 4.2 ม.3/1, ว 4.1 ม.3/5)",
      deliverable: "งานที่ 2.1–2.3 (20 คะแนน) + สอบย่อยกลางภาคปฏิบัติควบคุมฮาร์ดแวร์ (10 คะแนน)",
      status: "active",
      lessonKeys: ["v23103-u2-iot-app"],
    },
    {
      unitNo: 3,
      title: "UNIT 3 : การจัดการและวิเคราะห์ข้อมูลเพื่อการตัดสินใจ (Data & Dashboard)",
      weekRange: "สัปดาห์ 11–13 (คาบ 21–26) · สอบปลายภาคปฏิบัติ 10%",
      description:
        "รวบรวมข้อมูลปฐมภูมิ/ทุติยภูมิ, Data Cleansing, ประเมินความน่าเชื่อถือและแหล่งต้นตอข้อมูล พร้อมสร้าง Dashboard ด้วย Google Sheets, ThingsBoard และ Looker Studio (ว 4.2 ม.3/2–3)",
      deliverable: "งานที่ 3.1–3.4 (20 คะแนน): Data Cleansing & Dashboard + นำเสนอปลายภาค (10 คะแนน)",
      status: "active",
      lessonKeys: ["v23103-u3-data-dashboard"],
    },
    {
      unitNo: 4,
      title: "UNIT 4 : การแก้ปัญหาด้วยกระบวนการคิดเชิงออกแบบ (Design Thinking)",
      weekRange: "สัปดาห์ 14–19 (คาบ 27–38) · สอบปลายภาคปฏิบัติ 10%",
      description:
        "ระบุปัญหาชุมชนในงานเกษตร อาหาร พลังงาน และขนส่ง ประยุกต์ใช้ Design Thinking พัฒนานวัตกรรม ทดสอบ ประเมินผล ระบุข้อบกพร่อง และนำเสนอผลงาน (ว 4.1 ม.3/2–4)",
      deliverable: "งานที่ 4.1–4.3 (20 คะแนน): นวัตกรรมชุมชน + นำเสนอปลายภาค (10 คะแนน)",
      status: "active",
      lessonKeys: ["v23103-u4-design-thinking"],
    },
  ],
};
