import type { CourseDef } from "@/core/config/curriculum-types";

export const V21202_COURSE: CourseDef = {
  code: "ว21202",
  slug: "v21202",
  gradeLevel: 1,
  gradeLabel: "ชั้นมัธยมศึกษาปีที่ 1 (เพิ่มเติม)",
  title: "วิทยาการคำนวณและโครงงาน micro:bit",
  subtitle:
    "หลักสูตร Microsoft MakeCode micro:bit ครบ 13 หน่วย: Design Thinking, ตัวแปร, เงื่อนไข, ลูป, พิกัด LED 5×5, ตรรกะบูลีน, ฐานสอง, วิทยุไร้สาย, อาเรย์ และเซนเซอร์ความเร่ง",
  semesterLabel: "ม.1 (เพิ่มเติม) · เปิดเรียนครบทั้ง 13 หน่วย & สไลด์ 404 หน้า",
  status: "active",
  theme: "microbit-emerald",
  tags: ["micro:bit", "MakeCode", "5×5 LED", "Radio", "Accelerometer", "Python Sim"],
  moduleKey: "microbit-m1",
  stats: { lessonsCount: 13, exercisesCount: 13, missionsCount: 13, slidesCount: 404 },
  courseResources: [
    {
      label: "คู่มือครู Unit 1: Making (.docx)",
      kind: "knowledge",
      href: "/courses/v21202/sheets/unit-01-educator-guide.docx",
    },
    {
      label: "ใบงานนักเรียน Unit 1: Making (.docx)",
      kind: "worksheet",
      href: "/courses/v21202/sheets/unit-01-student-workbook.docx",
    },
    {
      label: "คู่มือครู Unit 13: Final Project (.docx)",
      kind: "guide",
      href: "/courses/v21202/sheets/unit-13-educator-guide.docx",
    },
  ],
  units: [
    {
      unitNo: 1,
      title: "Unit 01 : Making & Design Thinking (การสร้างสรรค์ด้วย micro:bit)",
      weekRange: "สัปดาห์ที่ 1–2",
      description:
        "รู้จักบอร์ด micro:bit, กระบวนการคิดเชิงออกแบบ (Design Thinking), สภาพแวดล้อม MakeCode และสร้างสัตว์เลี้ยงดิจิทัล micro:pet",
      deliverable: "ต้นแบบ micro:pet และบันทึกการสะท้อนคิด (Reflection Diary)",
      status: "active",
      lessonKeys: ["v21202-u1"],
    },
    {
      unitNo: 2,
      title: "Unit 02 : Algorithms & Events (อัลกอริทึม เหตุการณ์ และ Input/Output)",
      weekRange: "สัปดาห์ที่ 3",
      description:
        "องค์ประกอบคอมพิวเตอร์ 4 ส่วน (Processor, Memory, Inputs, Outputs), Event Handler บนปุ่ม A / B / A+B และโครงงาน Fidget Cube",
      deliverable: "โปรแกรม Happy/Sad Face & Fidget Cube",
      status: "active",
      lessonKeys: ["v21202-u2"],
    },
    {
      unitNo: 3,
      title: "Unit 03 : Variables & Data Types (ตัวแปรและชนิดข้อมูล)",
      weekRange: "สัปดาห์ที่ 4",
      description:
        "ความต่างระหว่างค่าคงที่และตัวแปร, ชนิดข้อมูล 5 แบบ (Number, String, Boolean, Sprite, Array) และการสร้างตัวนับคะแนนเป่ายิ้งฉุบ",
      deliverable: "โครงงาน Everything Counts (เครื่องนับก้าว/กระเป๋าสตางค์/ตัวนับคะแนน)",
      status: "active",
      lessonKeys: ["v21202-u3"],
    },
    {
      unitNo: 4,
      title: "Unit 04 : Conditionals & Logic (เงื่อนไขและการตัดสินใจ)",
      weekRange: "สัปดาห์ที่ 5–6",
      description:
        "โครงสร้าง if...then และ if...then...else, การสุ่มค่าตัดสินใจ, เกมเป่ายิ้งฉุบเมื่อเขย่าบอร์ด และบอร์ดเกมอัตโนมัติ",
      deliverable: "เกม Rock Paper Scissors & Board Game",
      status: "active",
      lessonKeys: ["v21202-u4"],
    },
    {
      unitNo: 5,
      title: "Unit 05 : Iteration & Music (การทำซ้ำและการสร้างเสียงดนตรี)",
      weekRange: "สัปดาห์ที่ 7",
      description:
        "ใช้ลูป Repeat, For, While ควบคุมการเดินเป็นสี่เหลี่ยม (Sprite Move), ต่อหูฟังเข้ากับขา P0 และ GND เพื่อเล่นโน้ตดนตรี",
      deliverable: "โครงงาน Get Loopy! แสดงแอนิเมชันและเสียงวนซ้ำ",
      status: "active",
      lessonKeys: ["v21202-u5"],
    },
    {
      unitNo: 6,
      title: "Unit 06 : Mini Project Showcase (โครงงานย่อยกลางภาค)",
      weekRange: "สัปดาห์ที่ 8–9",
      description:
        "ทบทวน Input/Processing/Output + Variables + Conditionals + Iteration แล้วออกแบบชิ้นงานแก้ปัญหาด้วยตนเองตามกระบวนการ Design Thinking",
      deliverable: "นิทรรศการ Mini Project และไฟล์บันทึกการพัฒนา",
      status: "active",
      lessonKeys: ["v21202-u6"],
    },
    {
      unitNo: 7,
      title: "Unit 07 : LED Coordinates (พิกัด 5×5 และความสว่าง LED)",
      weekRange: "สัปดาห์ที่ 10",
      description:
        "ระบบพิกัดคาร์ทีเซียนบนจอ LED 5×5 ตั้งแต่ (0,0) ถึง (4,4), คำสั่ง plot / unplot / point และการปรับ Brightness 0–255",
      deliverable: "สกรีนเซฟเวอร์หรือเกมบนพิกัด 5×5 LED",
      status: "active",
      lessonKeys: ["v21202-u7"],
    },
    {
      unitNo: 8,
      title: "Unit 08 : Booleans & Operators (ตรรกะบูลีน True/False)",
      weekRange: "สัปดาห์ที่ 11",
      description:
        "นิพจน์บูลีนและตัวดำเนินการ AND, OR, NOT ตามแนวคิด George Boole ประยุกต์กับ Double Coin Flipper และตัวเตือนกันแดด",
      deliverable: "เครื่องเตือนรังสียูวี (Sunscreen Monitor) หรือเกม 2 ผู้เล่น",
      status: "active",
      lessonKeys: ["v21202-u8"],
    },
    {
      unitNo: 9,
      title: "Unit 09 : Binary Systems (เลขฐานสองและทรานซิสเตอร์)",
      weekRange: "สัปดาห์ที่ 12",
      description:
        "บิตและไบต์, ค่าประจำหลักฐานสอง (2^0 ถึง 2^7), เกมตู้ขายของเลขฐานสอง, ตัวแปลงเลข Binary Transmogrifier และเครื่องคิดเงินทองแดง",
      deliverable: "Binary Cash Register ด้วยเทปทองแดงและขา Pin",
      status: "active",
      lessonKeys: ["v21202-u9"],
    },
    {
      unitNo: 10,
      title: "Unit 10 : Radio Communication (คลื่นวิทยุไร้สายและการสื่อสาร)",
      weekRange: "สัปดาห์ที่ 13–14",
      description:
        "การตั้งค่า Radio Group ID, รับส่งข้อความและรหัสมอร์ส, เกม Hot or Cold และ Pair Programming สร้าง Stop Thief / Radio Tennis",
      deliverable: "ระบบสื่อสารไร้สาย micro:bit 2 เครื่อง (Pair Project)",
      status: "active",
      lessonKeys: ["v21202-u10"],
    },
    {
      unitNo: 11,
      title: "Unit 11 : Arrays & Sorting (อาเรย์และการเรียงลำดับข้อมูล)",
      weekRange: "สัปดาห์ที่ 15",
      description:
        "โครงสร้าง Array และ Zero-based Indexing, อัลกอริทึม Bubble / Selection / Insertion Sort, เกมใบ้คำและกีตาร์ micro:bit",
      deliverable: "เครื่องดนตรี Banana Keyboard หรือ micro:bit Guitar",
      status: "active",
      lessonKeys: ["v21202-u11"],
    },
    {
      unitNo: 12,
      title: "Unit 12 : Accelerometer Sensors (เซนเซอร์วัดความเร่ง 3 แกน)",
      weekRange: "สัปดาห์ที่ 16",
      description:
        "ความต่างระหว่างความเร็วกับความเร่งในแกน X, Y, Z, การตรวจจับท่าทาง (Gesture) สำหรับ Stand for Health และโครงงานเพื่อสังคม UN Global Goals",
      deliverable: "เครื่องมือสวมใส่ (Pedometer / Touchless Alert)",
      status: "active",
      lessonKeys: ["v21202-u12"],
    },
    {
      unitNo: 13,
      title: "Unit 13 : Final Project Capstone (โครงงานบูรณาการปลายภาค)",
      weekRange: "สัปดาห์ที่ 17–18",
      description:
        "บูรณาการ Coordinates, Booleans, Binary, Radio, Arrays และ Accelerometer สร้างนวัตกรรม micro:bit ฉบับสมบูรณ์พร้อมนำเสนอ Final Showcase",
      deliverable: "Final Project Prototype + Code Share Link + Final Narrative",
      status: "active",
      lessonKeys: ["v21202-u13"],
    },
  ],
};
