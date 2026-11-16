import type { ChallengeClientView } from "@/core/modules/contract";
import {
  buildOrderClassifyDemoChallenges,
  type OrderClassifySeedItem,
} from "@/core/grading/order-classify";

export const CYBER_DEFENSE_M3_DEMO_CHALLENGES: OrderClassifySeedItem[] = [
  {
    challengeKey: "u1-fair-use-law",
    title: "หน่วย 1: จำแนกการใช้ลิขสิทธิ์โดยชอบธรรม (Fair Use) และกฎหมายคอมพิวเตอร์",
    orderIndex: 1,
    difficulty: "easy",
    maxScore: 10,
    xpReward: 40,
    config: {
      mode: "classify",
      unitCode: "Unit 1",
      story:
        "จำแนกพฤติกรรมการใช้ข้อมูลและสื่อดิจิทัลในงานโครงงานว่าสอดคล้องกับหลัก Fair Use / กฎหมายคอมพิวเตอร์ หรือเป็นการละเมิดสิทธิ์/ผิดกฎหมาย (ว 4.2 ม.3/4)",
      categories: [
        { id: "FAIR", label: "เหมาะสม / Fair Use", badgeCls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
        { id: "VIOLATE", label: "ละเมิดลิขสิทธิ์ / ผิดกฎหมาย", badgeCls: "bg-rose-100 text-rose-800 border-rose-200" },
      ],
      items: [
        { id: "cite", text: "นำกราฟสภาพอากาศมาทำโครงงานเรียนโดยอ้างอิงแหล่งที่มาครบถ้วน" },
        { id: "cc0", text: "ใช้ไอคอนสัญญาณอนุญาต Creative Commons ตามเงื่อนไขผู้สร้าง" },
        { id: "steal", text: "คัดลอกบทความทั้งฉบับมาใส่ชื่อตนเองเพื่อส่งงานโดยไม่อ้างอิง" },
        { id: "hack", text: "ลองเดารหัสผ่านเข้าระบบฐานข้อมูลผู้อื่นเพื่อดึงไฟล์มาดูเล่น" },
      ],
      hints: [
        "การใช้เพื่อการศึกษาต้องไม่อ้างเป็นผลงานตนเองและต้องให้เครดิตต้นทาง",
        "การเข้าถึงระบบผู้อื่นโดยไม่ได้รับอนุญาตผิด พ.ร.บ.คอมพิวเตอร์",
        "cite/cc0 -> FAIR, ส่วน steal/hack -> VIOLATE",
      ],
      microQuestion: {
        prompt: "หัวใจสำคัญของการใช้ผลงานมีลิขสิทธิ์ของผู้อื่นโดยชอบธรรม (Fair Use) สำหรับนักเรียนคือข้อใด?",
        options: [
          "ใช้เพื่อการศึกษาในขอบเขตเหมาะสม ไม่แสวงหากำไร และระบุแหล่งที่มาชัดเจน",
          "ตัดชื่อผู้เขียนออกเพื่อให้สไลด์ดูสะอาดตา",
          "นำไปพิมพ์จำหน่ายเพื่อระดมทุนห้องเรียนโดยไม่ขออนุญาต",
        ],
      },
    },
    solutionCheck: {
      mode: "classify",
      correctMap: { cite: "FAIR", cc0: "FAIR", steal: "VIOLATE", hack: "VIOLATE" },
      microCorrectOption: "ใช้เพื่อการศึกษาในขอบเขตเหมาะสม ไม่แสวงหากำไร และระบุแหล่งที่มาชัดเจน",
    },
  },
  {
    challengeKey: "u1-fallacy-check",
    title: "หน่วย 1 & 3: แยกแยะข้อมูลน่าเชื่อถือ vs เหตุผลวิบัติและข่าวลวง",
    orderIndex: 2,
    difficulty: "easy",
    maxScore: 10,
    xpReward: 45,
    config: {
      mode: "classify",
      unitCode: "Unit 1·3",
      story:
        "ฝึกประเมินความน่าเชื่อถือของข้อมูล (ว 4.2 ม.3/3): จำแนกข้อมูลที่น่าเชื่อถือออกจากเหตุผลวิบัติและลิงก์หลอกลวง",
      categories: [
        { id: "TRUST", label: "ข้อมูลน่าเชื่อถือ", badgeCls: "bg-sky-100 text-sky-800 border-sky-200" },
        { id: "RISK", label: "เหตุผลวิบัติ / ไม่น่าเชื่อถือ", badgeCls: "bg-amber-100 text-amber-800 border-amber-200" },
      ],
      items: [
        { id: "sensor", text: "บันทึกค่าเซนเซอร์ความชื้นแปลงผักจริง พร้อมวันเวลาและวิธีวัด" },
        { id: "gov", text: "รายงานสถิติพลังงานจากเว็บไซต์หน่วยงานทางการ (.go.th / .ac.th)" },
        { id: "fallacy", text: "อ้างว่า 'วันที่ฝนตกถนนเปียก ดังนั้นถนนเปียกต้องเกิดจากฝนตกเท่านั้น'" },
        { id: "phish", text: "ลิงก์รับของฟรีโดเมน pccpl.ac.th.free-gift-win.net ให้กรอกรหัสผ่าน" },
      ],
      hints: [
        "ข้อมูลปฐมภูมิที่มีวิธีบันทึกชัดเจนและเอกสารหน่วยงานจริงมักเชื่อถือได้",
        "การสรุปย้อนกลับโดยไม่ดูสาเหตุอื่นเป็นเหตุผลวิบัติ ส่วน Subdomain แปลกปลอมคือ Phishing",
        "sensor/gov -> TRUST, ส่วน fallacy/phish -> RISK",
      ],
      microQuestion: {
        prompt: "ข้อใดคือวิธีตรวจสอบแหล่งต้นตอของข้อมูลก่อนนำไปวิเคราะห์ Dashboard?",
        options: [
          "ตรวจผู้จัดทำ วันเผยแพร่ หลักฐานอ้างอิง และเปรียบเทียบกับแหล่งทางการ",
          "เชื่อตามจำนวนยอดไลก์หรือจำนวนแชร์เพียงอย่างเดียว",
          "เลือกใช้เฉพาะข้อความที่มีอารมณ์รุนแรงและเร่งให้รีบแชร์",
        ],
      },
    },
    solutionCheck: {
      mode: "classify",
      correctMap: { sensor: "TRUST", gov: "TRUST", fallacy: "RISK", phish: "RISK" },
      microCorrectOption: "ตรวจผู้จัดทำ วันเผยแพร่ หลักฐานอ้างอิง และเปรียบเทียบกับแหล่งทางการ",
    },
  },
  {
    challengeKey: "u2-iot-wokwi-blynk",
    title: "หน่วย 2: เรียงลำดับขั้นตอนพัฒนาแอปพลิเคชัน IoT ควบคุมไมโครคอนโทรลเลอร์",
    orderIndex: 3,
    difficulty: "medium",
    maxScore: 10,
    xpReward: 50,
    config: {
      mode: "order",
      unitCode: "Unit 2",
      story:
        "ก่อนสอบปฏิบัติควบคุมฮาร์ดแวร์ จงเรียงลำดับขั้นตอนการพัฒนาแอปพลิเคชันเชื่อมโยง IoT ด้วย Wokwi, MakeCode และ Blynk อย่างปลอดภัย (ว 4.2 ม.3/1, ว 4.1 ม.3/5)",
      blocks: [
        { id: "req", text: "1. กำหนดปัญหาและเลือกเซนเซอร์/ทรัพยากรที่ต้องใช้ (งาน 2.1)" },
        { id: "sim", text: "2. จำลองต่อวงจรไมโครคอนโทรลเลอร์อย่างปลอดภัยบน Wokwi / MakeCode" },
        { id: "code", text: "3. เขียนโปรแกรมอ่านค่าเซนเซอร์และควบคุมอุปกรณ์ปลายทาง" },
        { id: "app", text: "4. เชื่อมต่อข้อมูลกับแอปพลิเคชัน IoT เช่น Blynk (งาน 2.2)" },
        { id: "test", text: "5. ทดสอบ ปรับปรุงข้อบกพร่อง และประเมินการทำงานจริง (งาน 2.3)" },
      ],
      hints: [
        "ต้องเลือกอุปกรณ์และจำลองวงจรให้ปลอดภัยก่อนเชื่อมแอปพลิเคชันจริง",
        "ขั้นตอนท้ายสุดก่อนส่งงานคือการทดสอบและปรับปรุงแก้ไขโปรแกรม",
        "ลำดับคือ req -> sim -> code -> app -> test",
      ],
      microQuestion: {
        prompt: "เว็บไซต์ใดในแผนการสอน ว23103 ใช้จำลองการต่อวงจรไมโครคอนโทรลเลอร์ออนไลน์ก่อนต่อจริง?",
        options: ["wokwi.com และ makecode.microbit.org", "Canva Infographic Editor", "โปรแกรมพิมพ์เอกสาร Word"],
      },
    },
    solutionCheck: {
      mode: "order",
      correctOrder: ["req", "sim", "code", "app", "test"],
      microCorrectOption: "wokwi.com และ makecode.microbit.org",
    },
  },
  {
    challengeKey: "u3-data-pipeline",
    title: "หน่วย 3: เรียงขั้นตอนจัดการข้อมูลและสร้าง Dashboard เพื่อการตัดสินใจ",
    orderIndex: 4,
    difficulty: "medium",
    maxScore: 10,
    xpReward: 55,
    config: {
      mode: "order",
      unitCode: "Unit 3",
      story:
        "เรียงลำดับขั้นตอนการทำงานข้อมูล 3.1–3.4 เพื่อนำข้อมูลชุมชนขึ้น Dashboard บน ThingsBoard หรือ Looker Studio อย่างถูกต้อง (ว 4.2 ม.3/2)",
      blocks: [
        { id: "collect", text: "1. รวบรวมข้อมูลปฐมภูมิและทุติยภูมิตามวัตถุประสงค์ (Data Collection)" },
        { id: "clean", text: "2. จัดการและทำความสะอาดข้อมูลที่ซ้ำ ค่าว่าง และค่าผิดปกติ (Data Cleansing)" },
        { id: "verify", text: "3. ประเมินความน่าเชื่อถือและแหล่งต้นตอของข้อมูล (Data Credibility)" },
        { id: "process", text: "4. ประมวลผลคำนวณสถิติและสรุปผลใน Google Sheets" },
        { id: "dash", text: "5. ออกแบบ Dashboard ด้วย ThingsBoard หรือ Looker Studio เพื่อนำเสนอ" },
      ],
      hints: [
        "เก็บข้อมูลก่อน แล้วจึงทำความสะอาดและตรวจสอบความน่าเชื่อถือก่อนนำไปคำนวณ",
        "Dashboard เป็นขั้นตอนสุดท้ายในการสื่อสารผลการวิเคราะห์ให้ชุมชนเข้าใจง่าย",
        "ลำดับคือ collect -> clean -> verify -> process -> dash",
      ],
      microQuestion: {
        prompt: "หากข้ามขั้น Data Cleansing แล้วนำข้อมูลที่มีค่า Error (-999) เข้ากราฟทันทีจะเกิดอะไรขึ้น?",
        options: [
          "ค่าเฉลี่ยและกราฟบน Dashboard จะผิดเพี้ยนจนตัดสินใจพลาด",
          "ข้อมูลจะทำความสะอาดตัวเองโดยอัตโนมัติใน Looker Studio",
          "ทำให้ข้อมูลทุติยภูมิกลายเป็นข้อมูลปฐมภูมิทันที",
        ],
      },
    },
    solutionCheck: {
      mode: "order",
      correctOrder: ["collect", "clean", "verify", "process", "dash"],
      microCorrectOption: "ค่าเฉลี่ยและกราฟบน Dashboard จะผิดเพี้ยนจนตัดสินใจพลาด",
    },
  },
  {
    challengeKey: "u3-tools-match",
    title: "หน่วย 2 & 3: จับคู่เครื่องมือดิจิทัลให้ตรงกับภารกิจในรายวิชา",
    orderIndex: 5,
    difficulty: "medium",
    maxScore: 10,
    xpReward: 55,
    config: {
      mode: "classify",
      unitCode: "Unit 2·3",
      story:
        "จับคู่ซอฟต์แวร์และแพลตฟอร์มออนไลน์จากแผนการสอน ว23103 ให้ตรงกับบทบาทหน้าที่ในการพัฒนาและวิเคราะห์ข้อมูล",
      categories: [
        { id: "MCU", label: "จำลอง/คุมบอร์ด IoT", badgeCls: "bg-sky-100 text-sky-800 border-sky-200" },
        { id: "APP", label: "แอปสั่งงาน IoT", badgeCls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
        { id: "SHEET", label: "ประมวลผลตารางข้อมูล", badgeCls: "bg-amber-100 text-amber-800 border-amber-200" },
        { id: "DASH", label: "สร้าง Dashboard", badgeCls: "bg-purple-100 text-purple-800 border-purple-200" },
      ],
      items: [
        { id: "wokwi", text: "Wokwi / MakeCode micro:bit — จำลองฮาร์ดแวร์และเขียนโค้ด" },
        { id: "blynk", text: "Blynk (blynk.io) — แอปพลิเคชันควบคุมและเชื่อมโยงอุปกรณ์ IoT" },
        { id: "gsheet", text: "Google Sheets — จัดการ Cleansing คัดกรองและคำนวณตารางข้อมูล" },
        { id: "looker", text: "Looker Studio / ThingsBoard — แสดงผล Dashboard เชิงภาพ" },
      ],
      hints: [
        "Wokwi/MakeCode ใช้เขียนโค้ดจำลองไมโครคอนโทรลเลอร์ ส่วน Blynk ใช้เชื่อมแอป IoT",
        "Google Sheets ใช้จัดการตารางและสูตร ส่วน ThingsBoard/Looker Studio ใช้สร้าง Dashboard",
        "wokwi->MCU, blynk->APP, gsheet->SHEET, looker->DASH",
      ],
      microQuestion: {
        prompt: "ในหน่วยที่ 3 นักเรียนใช้เครื่องมือใดทำ Data Cleansing ก่อนเชื่อมต่อไปแสดงผลบน Looker Studio?",
        options: ["โปรแกรมสเปรดชีต Google Sheets", "โปรแกรมจำลองสายไฟ Wokwi", "วงล้อเข้ารหัส Caesar Cipher"],
      },
    },
    solutionCheck: {
      mode: "classify",
      correctMap: { wokwi: "MCU", blynk: "APP", gsheet: "SHEET", looker: "DASH" },
      microCorrectOption: "โปรแกรมสเปรดชีต Google Sheets",
    },
  },
  {
    challengeKey: "u4-design-thinking",
    title: "หน่วย 4: กระบวนการคิดเชิงออกแบบ (Design Thinking) พัฒนานวัตกรรมชุมชน",
    orderIndex: 6,
    difficulty: "boss",
    maxScore: 10,
    xpReward: 75,
    config: {
      mode: "order",
      unitCode: "Unit 4",
      story:
        "เรียงลำดับขั้นตอนพัฒนานวัตกรรมแก้ปัญหาชุมชน (เกษตร อาหาร พลังงาน ขนส่ง) ตามกระบวนการคิดเชิงออกแบบในงาน 4.1–4.3 (ว 4.1 ม.3/2–4)",
      blocks: [
        { id: "empathize", text: "1. ระบุปัญหา/ความต้องการชุมชนด้านเกษตร อาหาร พลังงาน หรือขนส่ง (งาน 4.1)" },
        { id: "define", text: "2. วิเคราะห์ข้อมูลและสรุปกรอบปัญหาโดยคำนึงถึงทรัพยากรและเงื่อนไข" },
        { id: "ideate", text: "3. ออกแบบและเปรียบเทียบแนวทางแก้ปัญหาที่บูรณาการหลายศาสตร์" },
        { id: "proto", text: "4. พัฒนาโซลูชันและต้นแบบนวัตกรรมด้วยกระบวนการ Design Thinking (งาน 4.2)" },
        { id: "eval", text: "5. ทดสอบ ประเมินผล ระบุข้อบกพร่อง ปรับแก้ และนำเสนอผลงาน (งาน 4.3)" },
      ],
      hints: [
        "เริ่มจากการทำความเข้าใจ/ระบุปัญหาของชุมชนและสรุปกรอบปัญหาก่อน",
        "หลังออกแบบแนวคิดแล้วจึงลงมือสร้างต้นแบบ ทดสอบ แก้ไขข้อบกพร่อง และนำเสนอ",
        "ลำดับคือ empathize -> define -> ideate -> proto -> eval",
      ],
      microQuestion: {
        prompt: "สัดส่วนคะแนนประเมินผลของรายวิชา ว23103 ตลอดภาคเรียนเป็นแบบใด?",
        options: [
          "ใบงาน 70 คะแนน + สอบย่อยภาคปฏิบัติ 30 คะแนน (ไม่มีสอบข้อเขียนกลางภาค/ปลายภาค)",
          "สอบกลางภาคข้อเขียน 50 คะแนน + สอบปลายภาคข้อเขียน 50 คะแนน",
          "คะแนนจิตพิสัย 100 คะแนนโดยไม่ต้องส่งใบงาน",
        ],
      },
    },
    solutionCheck: {
      mode: "order",
      correctOrder: ["empathize", "define", "ideate", "proto", "eval"],
      microCorrectOption: "ใบงาน 70 คะแนน + สอบย่อยภาคปฏิบัติ 30 คะแนน (ไม่มีสอบข้อเขียนกลางภาค/ปลายภาค)",
    },
  },
];

export function buildCyberDefenseDemoClientChallenges(seed = 2569): ChallengeClientView[] {
  return buildOrderClassifyDemoChallenges(CYBER_DEFENSE_M3_DEMO_CHALLENGES, "demo-cyber-", seed);
}
