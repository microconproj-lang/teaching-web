import type { CourseDef } from "@/core/config/curriculum-types";

export const V21103_COURSE: CourseDef = {
  code: "ว21103",
  slug: "v21103",
  gradeLevel: 1,
  gradeLabel: "ชั้นมัธยมศึกษาปีที่ 1",
  title: "เทคโนโลยีและวิทยาการคำนวณ",
  subtitle:
    "พื้นฐานอัลกอริทึม รหัสฐานสอง และกระบวนการทางเทคโนโลยีเพื่อการออกแบบ (Micro:bit, Breadboard, LED, ตัวต้านทาน และโปรแกรมจำลอง Tinkercad)",
  semesterLabel: "ม.1 · ภาคเรียนที่ 1/2569 · ว21103",
  status: "active",
  theme: "white-azure",
  tags: ["อัลกอริทึม", "เลขฐานสอง", "Tinkercad", "Micro:bit", "ว 4.1 ม.1/4–5"],
  moduleKey: "algo-quest-m1",
  stats: { lessonsCount: 4, exercisesCount: 6, missionsCount: 8, slidesCount: 15 },
  courseResources: [
    {
      label: "แผนการจัดการเรียนรู้ หน่วยที่ 5: โปรแกรมจำลองและออกแบบ (.pdf)",
      kind: "guide",
      href: "/courses/v21103/sheets/unit-05-lesson-plan.pdf",
    },
  ],
  units: [
    {
      unitNo: 1,
      title: "UNIT 1 : อัลกอริทึมและการคิดเชิงคำนวณ",
      description:
        "จัดลำดับขั้นตอนการทำงาน แก้ปัญหาทีละขั้น และถอดความหมายเลขฐานสอง 0 กับ 1",
      status: "active",
      lessonKeys: ["m1-algo-intro", "m1-binary-logic"],
    },
    {
      unitNo: 2,
      title: "UNIT 2 : วงจรตรรกะและการเขียนผังงาน",
      description: "ประตูตรรกะ AND / OR / NOT และจำลองเงื่อนไขในชีวิตจริง",
      status: "coming_soon",
      lessonKeys: [],
    },
    {
      unitNo: 5,
      title: "UNIT 5 : กระบวนการทางเทคโนโลยีเพื่อการออกแบบ (Tinkercad & Micro:bit)",
      weekRange: "12 ชั่วโมง (แผนนี้ 2 ชม.)",
      description:
        "หลักการทำงานของ Micro:bit, Breadboard, LED และตัวต้านทาน การใช้โปรแกรมจำลอง Tinkercad ออกแบบวงจรและ Block-based coding อย่างปลอดภัย (ว 4.1 ม.1/4–5)",
      deliverable: "ใบงาน 5.1: ระบบเปิด-ปิดไฟ LED อัตโนมัติด้วยเซนเซอร์วัดแสงบน Micro:bit (ผ่าน ≥ 80%)",
      status: "active",
      lessonKeys: ["v21103-u5-circuit", "v21103-u5-autolight"],
    },
  ],
};
