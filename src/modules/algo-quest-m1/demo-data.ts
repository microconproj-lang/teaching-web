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
];
