export type WorldKey = "world-1" | "world-2" | "world-3" | "world-4" | "world-5";

export interface WorldStagePreview {
  stageCode: string;
  title: string;
  topicTag: string;
  challengeKey?: string;
}

export interface WorldDefinition {
  key: WorldKey;
  order: number;
  shortCode: string;
  title: string;
  subtitle: string;
  colorVar: string;
  colorHex: string;
  moduleKeys: string[];
  stages: WorldStagePreview[];
}

/**
 * ข้อมูลโลกและด่านเริ่มต้น — เพิ่มโลกหรือโมดูลใหม่ได้โดยไม่ต้องรื้อ UI
 * ค่าสีใช้ --cloth-deep (#1B2760) เป็นสีตัวอักษรบนแถบโลก (Contrast >= 4.5:1)
 */
export const WORLD_MANIFESTS: WorldDefinition[] = [
  {
    key: "world-1",
    order: 1,
    shortCode: "ล1",
    title: "โลก 1  ตรรกะและอัลกอริทึม",
    subtitle: "จัดลำดับความคิด แยกส่วนปัญหา รหัสฐานสอง และวงจรตรรกะ",
    colorVar: "var(--w1)",
    colorHex: "#F0742E",
    moduleKeys: ["algo-quest-m1"],
    stages: [
      {
        stageCode: "1-1",
        title: "จัดคิวหุ่นส่งของ (Blockly & ลำดับ)",
        topicTag: "เรียงลำดับขั้นตอน",
        challengeKey: "algo-1-queue",
      },
      {
        stageCode: "1-2",
        title: "หุ่นเดินเก็บดาวในโกดัง (Parsons Problem)",
        topicTag: "วนซ้ำและแยกย่อย",
        challengeKey: "algo-2-loop",
      },
      {
        stageCode: "1-3",
        title: "ทอภาพจาก 0 กับ 1 (เลขฐานสองกับ Pixel Art)",
        topicTag: "Binary Pixel",
        challengeKey: "algo-3-binary",
      },
      {
        stageCode: "1-4",
        title: "หนีเขาวงกตด้วยประตูตรรกะ (Logic Gate)",
        topicTag: "AND / OR / NOT",
        challengeKey: "algo-4-boss",
      },
    ],
  },
  {
    key: "world-2",
    order: 2,
    shortCode: "ล2",
    title: "โลก 2  Python Quest",
    subtitle: "เขียนคำสั่ง Python ควบคุมตัวแปร เงื่อนไข ลูป และรายการข้อมูล",
    colorVar: "var(--w2)",
    colorHex: "#C084F0",
    moduleKeys: ["python-quest-m2"],
    stages: [
      {
        stageCode: "2-1",
        title: "ตัวแปรและชนิดข้อมูลแรก",
        topicTag: "Variables",
      },
      {
        stageCode: "2-2",
        title: "ทางแยกตัดสินใจ (if / elif / else)",
        topicTag: "Conditionals",
      },
      {
        stageCode: "2-3",
        title: "ทอลวดลายซ้ำด้วยลูป for",
        topicTag: "Loops",
      },
      {
        stageCode: "2-4",
        title: "ตะกร้าข้อมูล List และฟังก์ชัน",
        topicTag: "Lists & Functions",
      },
    ],
  },
  {
    key: "world-3",
    order: 3,
    shortCode: "ล3",
    title: "โลก 3  Cyber Defense",
    subtitle: "ตรวจจับข้อความลวง ถอดรหัสลับ และป้องกันเครือข่ายโรงเรียน",
    colorVar: "var(--w3)",
    colorHex: "#17B5C9",
    moduleKeys: ["cyber-defense-m3"],
    stages: [
      {
        stageCode: "3-1",
        title: "จับผิดลิงก์ปลอม (Phishing)",
        topicTag: "Digital Hygiene",
      },
      {
        stageCode: "3-2",
        title: "รหัสผ่านแข็งแรงกับ Salt",
        topicTag: "Authentication",
      },
      {
        stageCode: "3-3",
        title: "ถอดรหัสลับซีซาร์และ XOR",
        topicTag: "Cryptography",
      },
    ],
  },
  {
    key: "world-4",
    order: 4,
    shortCode: "ล4",
    title: "โลก 4  วิศวกรรมซอฟต์แวร์ & IoT (ว23202)",
    subtitle: "Scrum, MoSCoW, Pico W Edge, MQTT Broker, WebSocket และ QA Testing",
    colorVar: "var(--w1)",
    colorHex: "#F0742E",
    moduleKeys: ["iot-se-m3"],
    stages: [
      { stageCode: "4-1", title: "UNIT 0: SDLC & Pub/Sub", topicTag: "SE + IoT", challengeKey: "u0-sdlc-pubsub" },
      { stageCode: "4-2", title: "UNIT 1: คัดกรอง MoSCoW", topicTag: "Requirements", challengeKey: "u1-moscow-triage" },
      { stageCode: "4-3", title: "UNIT 2: Edge–Broker–Web", topicTag: "Architecture", challengeKey: "u2-edge-broker-web" },
      { stageCode: "4-4", title: "UNIT 3: Sprint 0 Hello MQTT", topicTag: "Mosquitto & Wi-Fi", challengeKey: "u3-sprint0-env" },
      { stageCode: "4-5", title: "UNIT 4: Edge Device Loop", topicTag: "Pico W Prototype", challengeKey: "u4-pico-edge-flow" },
      { stageCode: "4-6", title: "UNIT 5: WebSocket Dashboard", topicTag: "Web App", challengeKey: "u5-websocket-dom" },
      { stageCode: "4-7", title: "UNIT 6: QA Bug Triage", topicTag: "Software Testing", challengeKey: "u6-qa-bug-triage" },
      { stageCode: "4-8", title: "UNIT 7: Deploy & Maintenance", topicTag: "Production", challengeKey: "u7-deploy-maintain" },
      { stageCode: "4-9", title: "UNIT 8: STAR Demo Day", topicTag: "Presentation", challengeKey: "u8-star-demo-day" },
    ],
  },
  {
    key: "world-5",
    order: 5,
    shortCode: "ล5",
    title: "โลก 5  MakeCode micro:bit & CS Intro (ว21202)",
    subtitle: "Design Thinking, ตัวแปร, เงื่อนไข, ลูป, พิกัด LED 5×5, ฐานสอง, วิทยุไร้สาย, อาเรย์ และเซนเซอร์ 3 แกน",
    colorVar: "var(--w3)",
    colorHex: "#059669",
    moduleKeys: ["microbit-m1"],
    stages: [
      { stageCode: "5-1", title: "Unit 01: Making & micro:pet", topicTag: "Design Thinking", challengeKey: "u01-making" },
      { stageCode: "5-2", title: "Unit 02: Algorithms & Events", topicTag: "Input / Output", challengeKey: "u02-algorithms" },
      { stageCode: "5-3", title: "Unit 03: Variables & Scorekeeper", topicTag: "Data Types", challengeKey: "u03-variables" },
      { stageCode: "5-4", title: "Unit 04: Conditionals & RPS", topicTag: "if / else", challengeKey: "u04-conditionals" },
      { stageCode: "5-5", title: "Unit 05: Iteration & Audio Pins", topicTag: "Loops & P0/GND", challengeKey: "u05-iteration" },
      { stageCode: "5-6", title: "Unit 06: Mini Project Showcase", topicTag: "Prototype", challengeKey: "u06-mini-project" },
      { stageCode: "5-7", title: "Unit 07: LED 5×5 Coordinates", topicTag: "(x, y) & Plot", challengeKey: "u07-coordinates" },
      { stageCode: "5-8", title: "Unit 08: Booleans & Coin Flip", topicTag: "AND / OR / NOT", challengeKey: "u08-booleans" },
      { stageCode: "5-9", title: "Unit 09: Binary Cash Register", topicTag: "Bits & Bytes", challengeKey: "u09-binary" },
      { stageCode: "5-10", title: "Unit 10: Radio Group & Morse", topicTag: "Wireless Packet", challengeKey: "u10-radio" },
      { stageCode: "5-11", title: "Unit 11: Arrays & Selection Sort", topicTag: "Index 0 & Sort", challengeKey: "u11-arrays" },
      { stageCode: "5-12", title: "Unit 12: 3-Axis Accelerometer", topicTag: "X/Y/Z & Gesture", challengeKey: "u12-accel" },
      { stageCode: "5-13", title: "Unit 13: Final Project Capstone", topicTag: "Showcase & Narrative", challengeKey: "u13-final" },
    ],
  },
];

export function findWorldForModule(moduleKey: string): WorldDefinition {
  return (
    WORLD_MANIFESTS.find((w) => w.moduleKeys.includes(moduleKey)) ?? WORLD_MANIFESTS[0]
  );
}

