export interface DemoChallengeRecord {
  id: string;
  challengeKey: string;
  title: string;
  orderIndex: number;
  difficulty: "easy" | "medium" | "hard" | "boss";
  maxScore: number;
  xpReward: number;
  config: {
    story: string;
    blocks: { id: string; text: string }[];
    hint: string;
    microQuestion: {
      prompt: string;
      options: string[];
    };
  };
  solutionCheck: {
    correctOrder: string[];
    microCorrectOption: string;
  };
}

export const DEMO_CHALLENGES: DemoChallengeRecord[] = [
  {
    id: "demo-ch-1",
    challengeKey: "level-01-morning-routine",
    title: "ภารกิจที่ 1: หุ่นยนต์ชงเครื่องดื่มอัตโนมัติ",
    orderIndex: 1,
    difficulty: "easy",
    maxScore: 100,
    xpReward: 50,
    config: {
      story:
        "จัดลำดับขั้นตอนการทำงาน (Algorithm) ให้หุ่นยนต์สามารถชงโกโก้ร้อนได้ถูกต้องโดยไม่เกิดข้อผิดพลาด",
      blocks: [
        { id: "b1", text: "เตรียมแก้วเปล่าและวางบนถาด" },
        { id: "b2", text: "ตักผงโกโก้ 2 ช้อนใส่ลงในแก้ว" },
        { id: "b3", text: "เติมน้ำร้อน 150 มล. ลงในแก้ว" },
        { id: "b4", text: "คนให้เข้ากันจนผงโกโก้ละลายหมด" },
        { id: "b5", text: "เสิร์ฟแก้วโกโก้ให้ลูกค้า" },
      ],
      hint: "ต้องมีภาชนะและวัตถุดิบก่อนเติมน้ำร้อน จากนั้นจึงคนและเสิร์ฟ",
      microQuestion: {
        prompt: "ถ้าสลับขั้นตอน 'คนให้เข้ากัน' ไปทำก่อน 'เติมน้ำร้อน' จะเกิดผลอย่างไร?",
        options: [
          "ผงโกโก้จะไม่ละลายเพราะยังไม่มีน้ำร้อน",
          "ได้โกโก้รสชาติเข้มข้นขึ้น",
          "ระบบจะเสิร์ฟแก้วได้เร็วขึ้น",
          "ไม่มีผลแตกต่างใดๆ",
        ],
      },
    },
    solutionCheck: {
      correctOrder: ["b1", "b2", "b3", "b4", "b5"],
      microCorrectOption: "ผงโกโก้จะไม่ละลายเพราะยังไม่มีน้ำร้อน",
    },
  },
  {
    id: "demo-ch-2",
    challengeKey: "level-02-smart-fan",
    title: "ภารกิจที่ 2: เงื่อนไขเปิดพัดลมห้องเรียนอัจฉริยะ",
    orderIndex: 2,
    difficulty: "medium",
    maxScore: 100,
    xpReward: 80,
    config: {
      story:
        "เรียงลำดับ Pseudo-code เพื่อสั่งพัดลมทำงานเฉพาะตอนมีนักเรียนอยู่ในห้อง และอุณหภูมิเกิน 28 องศา",
      blocks: [
        { id: "p1", text: "temp = อ่านค่าจากเซ็นเซอร์อุณหภูมิ()" },
        { id: "p2", text: "has_student = ตรวจจับการเคลื่อนไหว()" },
        { id: "p3", text: "IF has_student == True AND temp > 28:" },
        { id: "p4", text: "    สั่งเปิดพัดลม()" },
        { id: "p5", text: "ELSE: สั่งปิดพัดลม()" },
      ],
      hint: "โปรแกรมต้องอ่านค่าจากเซ็นเซอร์ให้ครบก่อน จึงนำไปเช็กเงื่อนไข IF ... ELSE",
      microQuestion: {
        prompt: "หากอุณหภูมิเท่ากับ 30 องศา แต่ไม่มีนักเรียนอยู่ในห้อง (has_student == False) พัดลมจะเป็นอย่างไร?",
        options: [
          "พัดลมจะปิด เพราะเงื่อนไข AND ต้องเป็นจริงทั้งสองฝั่ง",
          "พัดลมจะเปิด เพราะอุณหภูมิเกิน 28 องศาแล้ว",
          "โปรแกรมจะ Error",
          "พัดลมจะหมุนด้วยความเร็วครึ่งหนึ่ง",
        ],
      },
    },
    solutionCheck: {
      correctOrder: ["p1", "p2", "p3", "p4", "p5"],
      microCorrectOption: "พัดลมจะปิด เพราะเงื่อนไข AND ต้องเป็นจริงทั้งสองฝั่ง",
    },
  },
  {
    id: "demo-ch-3",
    challengeKey: "level-03-tinkercad-circuit",
    title: "ภารกิจที่ 3: ต่อวงจร Tinkercad & ตัวต้านทานอย่างปลอดภัย (หน่วยที่ 5)",
    orderIndex: 3,
    difficulty: "medium",
    maxScore: 100,
    xpReward: 90,
    config: {
      story:
        "เรียงลำดับขั้นตอนการต่อวงจร Micro:bit กับหลอด LED บน Breadboard ในโปรแกรมจำลอง Tinkercad ให้ถูกต้องและปลอดภัยตามตัวชี้วัด ว 4.1 ม.1/5",
      blocks: [
        { id: "c1", text: "วางบอร์ด Micro:bit (Breakout), Breadboard, LED และตัวต้านทาน 220Ω" },
        { id: "c2", text: "ต่อสายสัญญาณจากขา P0 ของ Micro:bit เข้ากับขาหนึ่งของตัวต้านทาน" },
        { id: "c3", text: "ต่อขาอีกด้านของตัวต้านทานเข้ากับขายาว (Anode +) ของหลอด LED" },
        { id: "c4", text: "ต่อขาสั้น (Cathode -) ของหลอด LED กลับไปยังสาย GND ให้ครบวงจร" },
        { id: "c5", text: "กด Start Simulation ใน Tinkercad เพื่อตรวจเช็กความปลอดภัยก่อนต่อจริง" },
      ],
      hint: "ต้องวางอุปกรณ์ก่อน จากนั้นไล่สายไฟจากขา P0 → ตัวต้านทาน → ขายาว LED (+) → ขาสั้น LED (-) → GND แล้วจึงทดสอบจำลอง",
      microQuestion: {
        prompt: "เหตุใดจึงต้องต่อตัวต้านทาน (Resistor) อนุกรมกับหลอด LED ก่อนต่อเข้าขา Micro:bit?",
        options: [
          "ช่วยจำกัดกระแสไฟฟ้าไม่ให้เกินพิกัด ป้องกันหลอด LED ขาดและถนอมพอร์ตบอร์ด",
          "ช่วยสลับขั้วบวก-ลบของหลอด LED ให้เสียบด้านไหนก็ได้",
          "ทำให้ไม่ต้องต่อสาย GND กลับเข้า Micro:bit",
          "เพื่อให้โปรแกรม Tinkercad บันทึกไฟล์อัตโนมัติ",
        ],
      },
    },
    solutionCheck: {
      correctOrder: ["c1", "c2", "c3", "c4", "c5"],
      microCorrectOption: "ช่วยจำกัดกระแสไฟฟ้าไม่ให้เกินพิกัด ป้องกันหลอด LED ขาดและถนอมพอร์ตบอร์ด",
    },
  },
  {
    id: "demo-ch-4",
    challengeKey: "level-04-autolight-debug",
    title: "ภารกิจที่ 4: ใบงาน 5.1 ระบบเปิด-ปิดไฟ LED ด้วยเซนเซอร์แสง (หน่วยที่ 5)",
    orderIndex: 4,
    difficulty: "boss",
    maxScore: 100,
    xpReward: 120,
    config: {
      story:
        "เรียงลำดับโครงสร้าง Block-based coding บน Micro:bit สำหรับใบงาน 5.1 ให้หลอด LED เปิดอัตโนมัติเมื่อฟ้ามืด และปิดเมื่อสว่าง",
      blocks: [
        { id: "a1", text: "ในลูป Forever: อ่านค่า light_level จากเซนเซอร์วัดแสง Micro:bit (0–255)" },
        { id: "a2", text: "ตรวจสอบเงื่อนไข IF light_level < 100 (สภาพแวดล้อมเริ่มมืด):" },
        { id: "a3", text: "    สั่ง digital write pin P0 = 1 ให้หลอด LED ติดสว่าง" },
        { id: "a4", text: "ELSE (เมื่อค่าความสว่างเพียงพอ light_level >= 100):" },
        { id: "a5", text: "    สั่ง digital write pin P0 = 0 เพื่อปิดหลอด LED" },
      ],
      hint: "เริ่มจากการอ่านค่าเซนเซอร์ในลูป Forever ก่อนเช็กเงื่อนไข IF light_level < 100 ... ELSE ...",
      microQuestion: {
        prompt:
          "หากทดสอบบน Tinkercad แล้วพบว่าหลอด LED ไม่ยอมติดตอนกลางคืน (ค่าแสงต่ำ) นักเรียนควรตรวจสอบข้อบกพร่องตามตัวชี้วัด ว 4.1 ม.1/4 อย่างไร?",
        options: [
          "ตรวจทั้งสายไฟ/ขั้ว LED/GND บน Breadboard และตรวจเงื่อนไข < หรือ > ในบล็อกคำสั่ง",
          "เปลี่ยนไปใช้วิธีเดาสุ่มลบโค้ดทั้งหมดโดยไม่ทดสอบซ้ำ",
          "ถอดตัวต้านทานออกทั้งหมดเพื่อเพิ่มกระแสไฟให้มากที่สุด",
          "ปิดระบบ LMS แล้วไม่ต้องตรวจสอบสายไฟ",
        ],
      },
    },
    solutionCheck: {
      correctOrder: ["a1", "a2", "a3", "a4", "a5"],
      microCorrectOption: "ตรวจทั้งสายไฟ/ขั้ว LED/GND บน Breadboard และตรวจเงื่อนไข < หรือ > ในบล็อกคำสั่ง",
    },
  },
];
