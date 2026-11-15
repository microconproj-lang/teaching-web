import type { CourseDef } from "@/core/config/curriculum-types";

export const V23202_COURSE: CourseDef = {
  code: "ว23202",
  slug: "v23202",
  gradeLevel: 3,
  gradeLabel: "ชั้นมัธยมศึกษาปีที่ 3 (เพิ่มเติม)",
  title: "วิศวกรรมซอฟต์แวร์เบื้องต้น (ระบบ IoT)",
  subtitle:
    "โครงงานบูรณาการ Agile/Scrum ครบวงจร: Requirements, System Design, MicroPython บน Pico W, MQTT Broker (Pi 5), WebSocket Web App และการทดสอบจริง",
  semesterLabel: "ม.3 · ว23202 · 9 หน่วย / 18 สัปดาห์",
  status: "active",
  theme: "blueprint-navy",
  tags: ["Software Engineering", "Raspberry Pi Pico W", "MQTT", "Web App", "Agile/Scrum"],
  moduleKey: "iot-se-m3",
  stats: {
    lessonsCount: 9,
    exercisesCount: 15,
    missionsCount: 15,
    slidesCount: 132,
  },
  courseResources: [
    {
      label: "โครงร่างหลักสูตรรายวิชา ว23202 (.docx)",
      kind: "guide",
      href: "/courses/v23202/sheets/course-outline-v23202.docx",
    },
    {
      label: "แผนการจัดการเรียนรู้รายหน่วย 0–8 (.docx)",
      kind: "guide",
      href: "/courses/v23202/sheets/lesson-plans-all-units.docx",
    },
    {
      label: "คู่มือเนื้อหารายหน่วย ครูและนักเรียน (.docx)",
      kind: "guide",
      href: "/courses/v23202/sheets/teacher-student-handbook.docx",
    },
  ],
  units: [
    {
      unitNo: 0,
      title: "UNIT 0 : ปฐมนิเทศและแนวคิดพื้นฐาน SE + IoT",
      description:
        "ทำความเข้าใจ Software Engineering, วงจรชีวิต SDLC, ระบบ IoT รอบตัว, เกมจำลอง Pub/Sub และจัดทีม Scrum (Team Charter)",
      status: "active",
      weekRange: "สัปดาห์ 1–2",
      deliverable: "Team Charter & Concept Map IoT",
      lessonKeys: ["v23202-u0"],
    },
    {
      unitNo: 1,
      title: "UNIT 1 : การรวบรวมและวิเคราะห์ความต้องการ",
      description:
        "เทคนิคสัมภาษณ์ผู้ใช้ (Interview), การเขียน User Story (Connextra), Acceptance Criteria และจัดลำดับด้วย MoSCoW",
      status: "active",
      weekRange: "สัปดาห์ 3–4",
      deliverable: "ชิ้นงานที่ 1: Requirements & Product Backlog (10%)",
      lessonKeys: ["v23202-u1"],
    },
    {
      unitNo: 2,
      title: "UNIT 2 : การออกแบบระบบและสถาปัตยกรรม",
      description:
        "วาดแผนภาพสถาปัตยกรรม Edge–Broker–Web, ออกแบบ MQTT Topic Hierarchy, อ่าน Datasheet เซนเซอร์ และร่าง Wireframe",
      status: "active",
      weekRange: "สัปดาห์ 5–6",
      deliverable: "ชิ้นงานที่ 2: System Design Document (10%)",
      lessonKeys: ["v23202-u2"],
    },
    {
      unitNo: 3,
      title: "UNIT 3 : เตรียมสภาพแวดล้อมพัฒนา (Sprint 0)",
      description:
        "ตั้งค่า Mosquitto MQTT Broker บน Raspberry Pi 5 (TCP 1883 / WebSocket 9001) และเชื่อม Wi-Fi 2.4GHz ด้วย MicroPython บน Pico W",
      status: "active",
      weekRange: "สัปดาห์ 7–8",
      deliverable: "Broker พร้อมใช้งาน & Demo 'Hello MQTT'",
      lessonKeys: ["v23202-u3"],
    },
    {
      unitNo: 4,
      title: "UNIT 4 : Sprint 1 — พัฒนา Edge Device (Pico W)",
      description:
        "ควบคุมขา GPIO อ่านค่าเซนเซอร์ DHT22/LDR/PIR, Publish ข้อมูลขึ้น Broker และเขียน Callback Subscribe สั่ง Actuator + Unit Test",
      status: "active",
      weekRange: "สัปดาห์ 9–11",
      deliverable: "ชิ้นงานที่ 3: Edge Device Prototype (15%)",
      lessonKeys: ["v23202-u4"],
    },
    {
      unitNo: 5,
      title: "UNIT 5 : Sprint 2 — พัฒนาเว็บแอปพลิเคชันควบคุม IoT",
      description:
        "เชื่อมเบราว์เซอร์เข้า MQTT ผ่าน WebSocket (MQTT.js), จัดการ DOM แบบเรียลไทม์ด้วย HTML/CSS/JS และสร้างปุ่มสั่งงาน",
      status: "active",
      weekRange: "สัปดาห์ 12–13",
      deliverable: "ชิ้นงานที่ 4: Web Application ควบคุม IoT (15%)",
      lessonKeys: ["v23202-u5"],
    },
    {
      unitNo: 6,
      title: "UNIT 6 : การทดสอบซอฟต์แวร์ (Software Testing)",
      description:
        "แยกแยะ Unit/Integration/E2E Testing, เขียน Test Case (Input/Expected/Actual), ทดสอบ Edge Case และติดตามบั๊กด้วย Severity & Priority",
      status: "active",
      weekRange: "สัปดาห์ 14",
      deliverable: "ชิ้นงานที่ 5: Test Case & Bug Report (10%)",
      lessonKeys: ["v23202-u6"],
    },
    {
      unitNo: 7,
      title: "UNIT 7 : การส่งมอบและการดูแลรักษา",
      description:
        "เตรียม Deployment (main.py อัตโนมัติ), เขียน User Manual/README, เก็บ Feedback จากผู้ใช้จริง และจัดทำ Change Request",
      status: "active",
      weekRange: "สัปดาห์ 15–16",
      deliverable: "ชิ้นงานที่ 6: ระบบพร้อมใช้งาน & Maintenance Log (10%)",
      lessonKeys: ["v23202-u7"],
    },
    {
      unitNo: 8,
      title: "UNIT 8 : สรุปและนำเสนอผลงาน (Demo Day)",
      description:
        "เล่าเรื่องผลงานด้วยโครงสร้าง STAR, สาธิตระบบสด 3 ส่วน, ทำ Sprint Retrospective รวบยอด, Portfolio และ Peer Evaluation",
      status: "active",
      weekRange: "สัปดาห์ 17–18",
      deliverable: "ชิ้นงานที่ 7–8: Demo Day (15%) & Portfolio (5%)",
      lessonKeys: ["v23202-u8"],
    },
  ],
};
