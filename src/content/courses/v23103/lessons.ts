import type { InteractiveLessonDef, LessonResourceDef } from "@/core/config/curriculum-types";

const COURSE_PLAN_RESOURCES: LessonResourceDef[] = [
  {
    label: "แผนการจัดการเรียนรู้และแผนประเมินผลฉบับย่อ ว23103 (.pdf)",
    kind: "guide",
    href: "/courses/v23103/sheets/course-plan-v23103.pdf",
  },
];

export const V23103_LESSONS: InteractiveLessonDef[] = [
  {
    key: "v23103-u1-innovation",
    courseCode: "ว23103",
    gradeLevel: 3,
    unitNo: 1,
    title: "หน่วยที่ 1: เทคโนโลยีดิจิทัล นวัตกรรม และ Fair Use",
    subtitle:
      "ปัจจัยการเปลี่ยนแปลงเทคโนโลยี ผลกระทบต่อสังคม กฎหมายคอมพิวเตอร์ ทรัพย์สินทางปัญญา และลิขสิทธิ์โดยชอบธรรม (ว 4.1 ม.3/1, ว 4.2 ม.3/3–4)",
    durationMin: 16,
    iconBg: "blue",
    resources: COURSE_PLAN_RESOURCES,
    slides: [
      {
        id: "v23103-u1-s1",
        kind: "concept",
        title: "เทคโนโลยีเปลี่ยนแปลงอย่างไร และเชื่อมโยงกับศาสตร์อื่นแบบไหน?",
        subtitle: "งานที่ 1.1 – 1.2 (สัปดาห์ 1–2): เทคโนโลยีดิจิทัลและนวัตกรรม",
        body: [
          "เทคโนโลยีไม่เคยหยุดนิ่ง แต่ปรับเปลี่ยนตามความต้องการของมนุษย์ เศรษฐกิจ สังคม และความก้าวหน้าด้านวิทยาศาสตร์กับคณิตศาสตร์ (เช่น การประยุกต์ AI, IoT และ Big Data กับงานเกษตร อาหาร พลังงาน และการขนส่ง)",
          "ในหน่วยนี้ นักเรียนจะได้ร่วมกันค้นคว้าวิวัฒนาการของเทคโนโลยี สะท้อนผลกระทบต่อชีวิตประจำวัน และจัดทำ Mind Map รูปแบบ Infographic",
        ],
        callout: "การออกแบบนวัตกรรมยุคใหม่ต้องคำนึงถึงผลกระทบต่อชีวิต สังคม สิ่งแวดล้อม และทรัพย์สินทางปัญญาเสมอ",
      },
      {
        id: "v23103-u1-s2",
        kind: "concept",
        title: "รู้เท่าทันสื่อ กฎหมายคอมพิวเตอร์ และลิขสิทธิ์โดยชอบธรรม (Fair Use)",
        subtitle: "ใช้งานเทคโนโลยีสารสนเทศอย่างปลอดภัยและมีความรับผิดชอบ (ว 4.2 ม.3/4)",
        body: [
          "การนำภาพ กราฟ ข้อมูล หรือโค้ดของผู้อื่นมาใช้ในโครงงานต้องตรวจสอบเงื่อนไขลิขสิทธิ์และหลัก Fair Use: ใช้เพื่อการศึกษา ไม่แสวงหากำไร ไม่กระทบประโยชน์เชิงพาณิชย์ของเจ้าของ และต้องอ้างอิงแหล่งที่มาชัดเจน",
          "ขณะเดียวกันต้องปฏิบัติตามกฎหมายเกี่ยวกับคอมพิวเตอร์ ไม่เผยแพร่ข่าวสารบิดเบือน ไม่เข้าถึงระบบโดยไม่ได้รับอนุญาต และรู้จักประเมินเหตุผลวิบัติในสื่อออนไลน์",
        ],
        codeSnippet: `# ตัวอย่าง Metadata การอ้างอิงข้อมูลตามหลัก Fair Use\nsource = "กรมอุตุนิยมวิทยา"\npurpose = "education"   # เพื่อการศึกษา ไม่ใช่เชิงพาณิชย์\ncitation = True       # มีการระบุแหล่งที่มาครบถ้วน`,
      },
      {
        id: "v23103-u1-s3",
        kind: "quiz",
        title: "เช็กความเข้าใจ: การใช้ผลงานผู้อื่นโดยชอบธรรม (Fair Use)",
        body: ["พิจารณาสถานการณ์ต่อไปนี้ตามตัวชี้วัด ว 4.2 ม.3/4"],
        quiz: {
          checkKey: "quiz-v23103-u1-fairuse",
          question: "กรณีใดถือเป็นการใช้งานผลงานมีลิขสิทธิ์ของผู้อื่นได้อย่างเหมาะสมที่สุดตามหลัก Fair Use?",
          options: [
            "นำกราฟสถิติพลังงานมาประกอบรายงานโครงงานนักเรียน โดยอ้างอิงชื่อผู้จัดทำและ URL ต้นทางชัดเจน",
            "คัดลอกบทความทั้งหมดมาเปลี่ยนชื่อเป็นผลงานตนเองโดยไม่อ้างอิงแหล่งที่มา",
            "นำภาพถ่ายของผู้อื่นไปพิมพ์ขายหารายได้โดยไม่ขออนุญาต",
            "ส่งต่อข่าวสารที่ยังไม่ได้ตรวจสอบแหล่งต้นตอเพื่อเพิ่มยอดแชร์",
          ],
          correctIndex: 0,
          explanation:
            "การใช้เพื่อการศึกษาในขอบเขตที่เหมาะสม ไม่แสวงหากำไร และให้เครดิตแหล่งที่มาอย่างชัดเจน สอดคล้องกับหลักการใช้ลิขสิทธิ์โดยชอบธรรม",
          coinReward: 15,
        },
      },
      {
        id: "v23103-u1-s4",
        kind: "mission",
        title: "ภารกิจโค้ด: ตัวตรวจสอบเงื่อนไข Fair Use ก่อนเผยแพร่ชิ้นงาน",
        subtitle: "เขียนสคริปต์ตรวจสอบว่าสไลด์หรือบทความพร้อมเผยแพร่อย่างถูกต้องหรือไม่",
        body: [
          "รับค่า 2 ค่าคั่นด้วยเว้นวรรค: is_edu (1=เพื่อการศึกษา, 0=ไม่ใช่) และ has_citation (1=อ้างอิงครบ, 0=ไม่มี) — ถ้าทั้งคู่เป็น 1 พิมพ์ APPROVED มิฉะนั้นพิมพ์ REVIEW REQUIRED",
        ],
        mission: {
          checkKey: "mission-v23103-u1-fairuse",
          filename: "fair_use_check.py",
          prompt: "ตรวจเงื่อนไข Fair Use: ต้องเป็น is_edu == 1 และ has_citation == 1 จึงจะพิมพ์ APPROVED",
          starterCode: `is_edu, has_citation = [int(x) for x in input().split()]\nif is_edu == 1 and has_citation == 1:\n    print("APPROVED")\nelse:\n    print("REVIEW REQUIRED")\n`,
          hints: [
            "ใช้ตัวดำเนินการตรรกศาสตร์ and ตรวจสอบทั้ง is_edu == 1 และ has_citation == 1",
          ],
          testCases: [
            { label: "เพื่อการศึกษา + อ้างอิงครบ", stdin: ["1 1"], expectedOutput: "APPROVED" },
            { label: "เพื่อการศึกษาแต่ลืมอ้างอิง", stdin: ["1 0"], expectedOutput: "REVIEW REQUIRED" },
          ],
          coinReward: 20,
          xpReward: 35,
        },
      },
    ],
  },
  {
    key: "m3-caesar-cipher",
    courseCode: "ว23103",
    gradeLevel: 3,
    unitNo: 1,
    title: "วิทยาการรหัสลับ: Caesar Cipher",
    subtitle: "การเลื่อนตัวอักษรเพื่อเข้ารหัสและถอดรหัสข้อความด้วย Python",
    durationMin: 15,
    iconBg: "emerald",
    resources: COURSE_PLAN_RESOURCES,
    slides: [
      {
        id: "s1",
        kind: "visualizer",
        title: "Visualizer: วงล้อรหัสลับซีซาร์",
        subtitle: "ลองเลื่อนค่า Shift (Key) เพื่อดูข้อความปกติแปลงเป็น Ciphertext แบบเรียลไทม์",
        body: ["รหัสซีซาร์ใช้การเลื่อนตัวอักษรไปข้างหน้า K ตำแหน่ง เช่น Shift=3 จะเปลี่ยน 'A' เป็น 'D'"],
        visualizerType: "caesar-cipher",
      },
      {
        id: "s2",
        kind: "mission",
        title: "ภารกิจลงมือทำ: ถอดรหัสด้วย ord() และ chr()",
        body: ["เขียนโค้ดเลื่อนตัวอักษรภาษาอังกฤษตัวใหญ่ ch = 'D' ย้อนกลับ 3 ตำแหน่งให้กลายเป็น 'A'"],
        mission: {
          checkKey: "mission-m3-caesar",
          filename: "caesar_shift.py",
          prompt: "ใช้ ord(ch) - 3 แล้วแปลงกลับด้วย chr(...) เพื่อพิมพ์ตัวอักษรที่ถอดรหัสแล้ว",
          starterCode: `ch = "D"\nshift = 3\ndecoded = chr(ord(ch) - shift)\nprint(decoded)\n`,
          hints: ["ord('D') ได้ 68 เมื่อลบ 3 จะได้ 65 ซึ่ง chr(65) คือ 'A'"],
          testCases: [{ label: "ถอดรหัส D ด้วย shift 3", expectedOutput: "A" }],
          coinReward: 25,
          xpReward: 45,
        },
      },
    ],
  },
  {
    key: "m3-phishing-defense",
    courseCode: "ว23103",
    gradeLevel: 3,
    unitNo: 1,
    title: "จับผิดลิงก์ปลอมและการป้องกัน Phishing",
    subtitle: "วิเคราะห์โครงสร้าง Domain เพื่อแยกเว็บไซต์จริงออกจากเว็บหลอกลวง",
    durationMin: 12,
    iconBg: "blue",
    resources: COURSE_PLAN_RESOURCES,
    slides: [
      {
        id: "s1",
        kind: "visualizer",
        title: "Inspector: สแกนจุดน่าสงสัยในลิงก์และอีเมล",
        subtitle: "คลิกเลือกตัวอย่างลิงก์เพื่อวิเคราะห์จุดอันตราย",
        body: ["สังเกต TLD, ตัวสะกดเลียนแบบ (Typosquatting) และโปรโตคอล HTTPS เสมอ"],
        visualizerType: "phishing-inspector",
      },
      {
        id: "s2",
        kind: "quiz",
        title: "เช็กความเข้าใจ: โดเมนโรงเรียนที่ถูกต้อง",
        body: ["ตรวจสอบโดเมนของแพลตฟอร์มเรา"],
        quiz: {
          checkKey: "quiz-m3-phishing",
          question: "โดเมนใดปลอดภัยและเป็นอีเมลทางการของโรงเรียน?",
          options: [
            "student@pccpl-login.com",
            "student@pccpl.ac.th",
            "admin@pccpl.ac.th.free-gift.net",
            "teacher@pccpl-verify.info",
          ],
          correctIndex: 1,
          explanation: "ต้องดูที่ส่วนท้ายสุดก่อน '/' คือ pccpl.ac.th เท่านั้น โดเมนที่มีคำต่อท้ายหรือขีดกลางเพิ่มเติมคือตัวลวง",
          coinReward: 10,
        },
      },
    ],
  },
  {
    key: "v23103-u2-iot-app",
    courseCode: "ว23103",
    gradeLevel: 3,
    unitNo: 2,
    title: "หน่วยที่ 2: พัฒนาแอปพลิเคชัน IoT และควบคุมไมโครคอนโทรลเลอร์",
    subtitle:
      "สัปดาห์ 3–9 · สำรวจโลก IoT, ควบคุมเซนเซอร์และแอปผ่าน Wokwi, Blynk และ MakeCode micro:bit (ว 4.2 ม.3/1, ว 4.1 ม.3/5)",
    durationMin: 18,
    iconBg: "emerald",
    resources: COURSE_PLAN_RESOURCES,
    slides: [
      {
        id: "v23103-u2-s1",
        kind: "concept",
        title: "โครงสร้างแอปพลิเคชัน IoT: จากไมโครคอนโทรลเลอร์สู่แอปควบคุม",
        subtitle: "งานที่ 2.1 – 2.3 (20 คะแนน) + สอบปฏิบัติกลางภาค (10 คะแนน)",
        body: [
          "ระบบ Internet of Things (IoT) เชื่อมต่อโลกกายภาพกับซอฟต์แวร์: บอร์ดไมโครคอนโทรลเลอร์อ่านค่าจากเซนเซอร์พื้นฐาน (เช่น ความชื้น แสง อุณหภูมิ) ประมวลผลและส่งข้อมูลเชื่อมโยงไปยังแอปพลิเคชันควบคุม เช่น Blynk และแจ้งเตือนผู้ใช้",
          "ก่อนต่ออุปกรณ์จริงในงานอาชีพด้านการเกษตร อาหาร พลังงาน หรือขนส่ง เราสามารถใช้โปรแกรมจำลองอย่าง Wokwi (wokwi.com) หรือ MakeCode micro:bit (makecode.microbit.org) เพื่อทดลองวงจรและแก้ไขโค้ดได้อย่างปลอดภัยตามตัวชี้วัด ว 4.1 ม.3/5",
        ],
        callout: "ประเมินกลางภาค (สัปดาห์ 10): ไม่มีข้อสอบข้อเขียน แต่ใช้การสอบย่อยภาคปฏิบัติ 'เขียนโปรแกรมควบคุมฮาร์ดแวร์' (10 คะแนน)",
      },
      {
        id: "v23103-u2-s2",
        kind: "visualizer",
        title: "จำลองควบคุมขา GPIO และเซนเซอร์ไมโครคอนโทรลเลอร์",
        subtitle: "ทดลองอ่านค่า Input/Output และจำลองการสั่งงาน Actuator ก่อนเขียนโปรแกรมจริง",
        body: ["ทดสอบตั้งค่าขา Pin อ่านเซนเซอร์และควบคุม Relay / LED / Buzzer ทีละขั้นตอน"],
        visualizerType: "pico-gpio",
      },
      {
        id: "v23103-u2-s3",
        kind: "quiz",
        title: "เช็กความเข้าใจ: การจำลอง IoT และการเลือกใช้อุปกรณ์อย่างปลอดภัย",
        body: ["เลือกคำตอบที่สอดคล้องกับหลักการในหน่วยที่ 2"],
        quiz: {
          checkKey: "quiz-v23103-u2-iot",
          question: "เหตุใดในการพัฒนาโครงงาน IoT จึงควรทดสอบโค้ดควบคุมเซนเซอร์ในโปรแกรมจำลองเช่น Wokwi หรือ MakeCode ก่อนประกอบฮาร์ดแวร์จริง?",
          options: [
            "ช่วยตรวจสอบลำดับลอจิก การต่อขา Pin และป้องกันความเสียหายทางไฟฟ้าก่อนลงมือต่ออุปกรณ์จริง",
            "เพื่อหลีกเลี่ยงการวางแผนเก็บข้อมูลและไม่ต้องวิเคราะห์ปัญหา",
            "เพราะบอร์ดไมโครคอนโทรลเลอร์จริงไม่สามารถเชื่อมต่อเซนเซอร์ได้",
            "เพื่อทำให้ระบบไม่ต้องอาศัยการทดสอบและปรับปรุงโปรแกรม",
          ],
          correctIndex: 0,
          explanation:
            "การใช้โปรแกรมจำลองช่วยระบุข้อผิดพลาดของวงจรและโปรแกรมควบคุมเซนเซอร์ได้รวดเร็ว ปลอดภัย และลดความเสียหายของอุปกรณ์จริง",
          coinReward: 15,
        },
      },
      {
        id: "v23103-u2-s4",
        kind: "mission",
        title: "ภารกิจโค้ด: ตรรกะควบคุมอุปกรณ์เกษตรอัจฉริยะเชื่อมแอป IoT",
        subtitle: "จำลองการตัดสินใจส่งคำสั่งไปยัง Relay ปั๊มน้ำ (Blynk Virtual Pin)",
        body: [
          "รับค่า moisture = int(input()) (% ความชื้นดิน 0–100): หาก moisture < 35 พิมพ์ PUMP_ON, หาก moisture <= 70 พิมพ์ STANDBY, มิฉะนั้นพิมพ์ OVERFLOW_ALERT",
        ],
        mission: {
          checkKey: "mission-v23103-u2-iot",
          filename: "iot_pump_ctrl.py",
          prompt: "อ่าน moisture (0–100) แล้วเลือกสถานะควบคุมปั๊มน้ำ IoT ให้ถูกต้อง",
          starterCode: `moisture = int(input().strip())\nif moisture < 35:\n    print("PUMP_ON")\nelif moisture <= 70:\n    print("STANDBY")\nelse:\n    print("OVERFLOW_ALERT")\n`,
          hints: [
            "เช็ก moisture < 35 ก่อน แล้วตามด้วย elif moisture <= 70",
          ],
          testCases: [
            { label: "ดินแห้ง 22%", stdin: ["22"], expectedOutput: "PUMP_ON" },
            { label: "ความชื้นเหมาะสม 55%", stdin: ["55"], expectedOutput: "STANDBY" },
            { label: "น้ำขังสูง 88%", stdin: ["88"], expectedOutput: "OVERFLOW_ALERT" },
          ],
          coinReward: 25,
          xpReward: 40,
        },
      },
    ],
  },
  {
    key: "v23103-u3-data-dashboard",
    courseCode: "ว23103",
    gradeLevel: 3,
    unitNo: 3,
    title: "หน่วยที่ 3: Data Cleansing, ความน่าเชื่อถือข้อมูล และ Dashboard",
    subtitle:
      "สัปดาห์ 11–13 · จัดการข้อมูลปฐมภูมิ/ทุติยภูมิ, ทำความสะอาดข้อมูล, ประเมินเหตุผลวิบัติ และนำเสนอด้วย Sheets / ThingsBoard / Looker Studio",
    durationMin: 18,
    iconBg: "amber",
    resources: COURSE_PLAN_RESOURCES,
    slides: [
      {
        id: "v23103-u3-s1",
        kind: "concept",
        title: "จากข้อมูลดิบสู่การตัดสินใจ: Data Collection → Cleansing → Dashboard",
        subtitle: "งานที่ 3.1 – 3.4 (20 คะแนน) + สอบปฏิบัติปลายภาค (10 คะแนน)",
        body: [
          "การตัดสินใจที่ดีต้องเริ่มจากการรวบรวมข้อมูลทั้งปฐมภูมิ (เช่น วัดจากเซนเซอร์ IoT หรือสำรวจเอง) และทุติยภูมิ (สถิติหน่วยงานทางการ) จากนั้นทำความสะอาดข้อมูล (Data Cleansing) เพื่อลบข้อมูลซ้ำ จัดการค่าว่าง และคัดค่าผิดปกติ (Outlier) ออก",
          "ก่อนนำเสนอด้วย Dashboard ใน Google Sheets, ThingsBoard (thingsboard.io) หรือ Looker Studio ต้องประเมินความน่าเชื่อถือของแหล่งต้นตอ และตรวจสอบเหตุผลวิบัติ (Logical Fallacy) ไม่ให้หลงเชื่อข้อมูลบิดเบือน",
        ],
        callout: "ประเมินปลายภาคส่วนแรก (10 คะแนน): นำเสนอการจัดการและวิเคราะห์ข้อมูลเพื่อการตัดสินใจสำหรับชุมชน",
      },
      {
        id: "v23103-u3-s2",
        kind: "visualizer",
        title: "ห้องทดลอง Data Cleansing & Dashboard + จับผิดเหตุผลวิบัติ",
        subtitle: "คลิกทำความสะอาดชุดข้อมูลทั้ง 4 ขั้น เพื่อดูผลกระทบต่อค่าเฉลี่ยและคุณภาพข้อมูล",
        body: ["สลับดูแท็บ 1 (Data Cleansing & Dashboard) และแท็บ 2 (ความน่าเชื่อถือข้อมูล, เหตุผลวิบัติ & Fair Use)"],
        visualizerType: "data-cleansing",
      },
      {
        id: "v23103-u3-s3",
        kind: "quiz",
        title: "เช็กความเข้าใจ: Data Cleansing และความน่าเชื่อถือข้อมูล (ว 4.2 ม.3/2–3)",
        body: ["เลือกแนวทางที่ถูกต้องที่สุดก่อนนำข้อมูลเข้า Dashboard"],
        quiz: {
          checkKey: "quiz-v23103-u3-data",
          question: "เหตุใดจึงต้องทำ Data Cleansing (ลบข้อมูลซ้ำ ค่าว่าง และค่าผิดปกติเช่นอุณหภูมิ 999°C) ก่อนคำนวณค่าเฉลี่ยบน Looker Studio?",
          options: [
            "เพราะค่าผิดปกติและข้อมูลซ้ำทำให้ค่าเฉลี่ยและกราฟคลาดเคลื่อน นำไปสู่การตัดสินใจที่ผิดพลาด",
            "เพราะ Google Sheets ไม่สามารถแสดงผลตัวเลขมากกว่า 100 ได้",
            "เพื่อทำให้จำนวนข้อมูลปฐมภูมิหายไปทั้งหมดโดยไม่ต้องตรวจสอบ",
            "เพื่อให้สามารถใช้ข้อมูลโดยไม่ต้องอ้างอิงแหล่งที่มา",
          ],
          correctIndex: 0,
          explanation:
            "Garbage In, Garbage Out — ข้อมูลที่มีค่าผิดปกติหรือซ้ำซ้อนจะทำให้สถิติสรุป (เช่น ค่าเฉลี่ย) บน Dashboard บิดเบือนจากความจริง",
          coinReward: 15,
        },
      },
      {
        id: "v23103-u3-s4",
        kind: "mission",
        title: "ภารกิจโค้ด: ทำความสะอาดรายการข้อมูลอุณหภูมิ (Data Cleansing)",
        subtitle: "เขียนสคริปต์กรองค่าอุณหภูมิที่อยู่นอกช่วงสมเหตุสมผล (0–60°C) แล้วหาค่าเฉลี่ย",
        body: [
          "รับค่าตัวเลขจำนวนเต็มหลายค่าคั่นด้วยเว้นวรรค เก็บเฉพาะค่าที่ 0 <= t <= 60 แล้วพิมพ์รูปแบบ CLEAN=<จำนวนที่ผ่าน> AVG=<ทศนิยม 1 ตำแหน่ง>",
        ],
        mission: {
          checkKey: "mission-v23103-u3-cleanse",
          filename: "data_cleanse.py",
          prompt: "คัดกรองค่าที่อยู่ระหว่าง 0 ถึง 60 แล้วพิมพ์ CLEAN และ AVG ทศนิยม 1 ตำแหน่ง",
          starterCode: `raw = [int(x) for x in input().split()]\nclean = [t for t in raw if 0 <= t <= 60]\navg = sum(clean) / len(clean) if clean else 0\nprint(f"CLEAN={len(clean)} AVG={avg:.1f}")\n`,
          hints: [
            "คัดค่าด้วยเงื่อนไข 0 <= t <= 60 เพื่อตัดค่าติดลบหรือค่าโดดอย่าง 999 ออก",
            "ใช้ len(clean) และ sum(clean) / len(clean) แสดงผลแบบ :.1f",
          ],
          testCases: [
            { label: "มีค่าหลุดช่วง -5 และ 999", stdin: ["28 -5 30 999 32"], expectedOutput: "CLEAN=3 AVG=30.0" },
            { label: "สะอาดทุกค่า", stdin: ["26 28 31"], expectedOutput: "CLEAN=3 AVG=28.3" },
          ],
          coinReward: 25,
          xpReward: 45,
        },
      },
    ],
  },
  {
    key: "v23103-u4-design-thinking",
    courseCode: "ว23103",
    gradeLevel: 3,
    unitNo: 4,
    title: "หน่วยที่ 4: แก้ปัญหาด้วย Design Thinking และนวัตกรรมชุมชน",
    subtitle:
      "สัปดาห์ 14–19 · ระบุปัญหาเกษตร อาหาร พลังงาน ขนส่ง พัฒนาโซลูชัน ทดสอบ ประเมินผล และนำเสนอ (ว 4.1 ม.3/2–4)",
    durationMin: 16,
    iconBg: "purple",
    resources: COURSE_PLAN_RESOURCES,
    slides: [
      {
        id: "v23103-u4-s1",
        kind: "concept",
        title: "Design Thinking กับการแก้ปัญหาชุมชนในโลกจริง",
        subtitle: "งานที่ 4.1 – 4.3 (20 คะแนน) + สอบปฏิบัติปลายภาค (10 คะแนน)",
        body: [
          "การสร้างนวัตกรรมตามหลักสูตร ม.3 มุ่งแก้ปัญหาในชีวิตประจำวันและงานอาชีพด้านเกษตร อาหาร พลังงาน และการขนส่ง โดยบูรณาการความรู้วิทยาศาสตร์ คณิตศาสตร์ และเทคโนโลยีอย่างสร้างสรรค์",
          "เริ่มจากระบุกรอบปัญหาชุมชน (งาน 4.1), พัฒนาแนวทางและสร้างต้นแบบด้วยกระบวนการ Design Thinking: Empathize → Define → Ideate → Prototype → Test (งาน 4.2), และทดสอบ ประเมินผล ระบุข้อบกพร่อง ปรับปรุงแก้ไขเพื่อนำเสนอผลงาน (งาน 4.3)",
        ],
      },
      {
        id: "v23103-u4-s2",
        kind: "concept",
        title: "โครงสร้างคะแนนประเมินผล 70 / 30 ของรายวิชา ว23103",
        subtitle: "เกณฑ์วัดผลตามแผนฉบับย่อ ภาคเรียนที่ 1 ปีการศึกษา 2569",
        body: [
          "1) ใบงานและการบ้าน (70 คะแนน): หน่วยที่ 1 (10 คะแนน), หน่วยที่ 2 (20 คะแนน), หน่วยที่ 3 (20 คะแนน), และหน่วยที่ 4 งานคู่พัฒนา/นำเสนอนวัตกรรม (20 คะแนน)",
          "2) สอบย่อยภาคปฏิบัติ (30 คะแนน — ไม่มีสอบข้อเขียนกลางภาค/ปลายภาค): ควบคุมฮาร์ดแวร์ 10 คะแนน + นำเสนอวิเคราะห์ข้อมูลชุมชน 10 คะแนน + นำเสนอแก้ปัญหาด้วย Design Thinking สำหรับชุมชน 10 คะแนน",
        ],
        callout: "เมื่อทำชิ้นงานคู่ 4.1–4.3 เสร็จ อย่าลืมบันทึกข้อบกพร่องที่พบระหว่างทดสอบและแนวทางแก้ไขเพื่อใช้นำเสนอปลายภาค",
      },
      {
        id: "v23103-u4-s3",
        kind: "quiz",
        title: "เช็กความเข้าใจ: การทดสอบและประเมินผลนวัตกรรม (ว 4.1 ม.3/4)",
        body: ["เลือกวิธีปรับปรุงต้นแบบนวัตกรรมที่ถูกต้องที่สุด"],
        quiz: {
          checkKey: "quiz-v23103-u4-dt",
          question: "เมื่อทดสอบต้นแบบเครื่องแจ้งเตือนการใช้พลังงานชุมชนแล้วพบข้อบกพร่อง ขั้นตอนใดสอดคล้องกับตัวชี้วัด ว 4.1 ม.3/4 มากที่สุด?",
          options: [
            "บันทึกข้อบกพร่อง วิเคราะห์สาเหตุภายใต้เงื่อนไขและทรัพยากรที่มี วางแผนปรับปรุงแก้ไข และทดสอบซ้ำ",
            "ซ่อนข้อบกพร่องไว้ไม่ให้ผู้อื่นเห็นตอนนำเสนอ",
            "ข้ามขั้นตอนการทดสอบและเผยแพร่ให้ชุมชนใช้งานทันที",
            "เปลี่ยนหัวข้อโครงงานใหม่ทุกครั้งโดยไม่วิเคราะห์สาเหตุของปัญหา",
          ],
          correctIndex: 0,
          explanation:
            "การทดสอบและประเมินผลต้องระบุสาเหตุของข้อบกพร่องภายใต้ข้อจำกัด เพื่อนำไปปรับปรุงต้นแบบให้ทำงานได้ตรงความต้องการผู้ใช้จริง",
          coinReward: 15,
        },
      },
      {
        id: "v23103-u4-s4",
        kind: "mission",
        title: "ภารกิจโค้ด: ประเมินผลคะแนนรวมรายวิชา ว23103 (70 + 30)",
        subtitle: "คำนวณคะแนนรวมจากภาคใบงาน (0–70) และภาคปฏิบัติ (0–30) พร้อมตัดสินผล",
        body: [
          "รับคะแนน work (0–70) และ lab_exam (0–30) คั่นด้วยเว้นวรรค คำนวณ total = work + lab_exam พิมพ์รูปแบบ TOTAL=<ผลรวม> LEVEL=<EXCELLENT ถ้า >=80, PASS ถ้า >=50, IMPROVE ถ้าน้อยกว่า 50>",
        ],
        mission: {
          checkKey: "mission-v23103-u4-eval",
          filename: "v23103_eval.py",
          prompt: "รวมคะแนนใบงาน (70) และสอบปฏิบัติ (30) แล้วสรุปเกณฑ์ผลลัพธ์",
          starterCode: `work, lab_exam = [int(x) for x in input().split()]\ntotal = work + lab_exam\nif total >= 80:\n    level = "EXCELLENT"\nelif total >= 50:\n    level = "PASS"\nelse:\n    level = "IMPROVE"\nprint(f"TOTAL={total} LEVEL={level}")\n`,
          hints: [
            "เช็ก >= 80 ก่อน >= 50 มิฉะนั้นคะแนน 85 จะถูกจัดเป็น PASS",
          ],
          testCases: [
            { label: "ได้ 62 + 25 = 87 คะแนน", stdin: ["62 25"], expectedOutput: "TOTAL=87 LEVEL=EXCELLENT" },
            { label: "ได้ 48 + 18 = 66 คะแนน", stdin: ["48 18"], expectedOutput: "TOTAL=66 LEVEL=PASS" },
            { label: "ได้ 30 + 12 = 42 คะแนน", stdin: ["30 12"], expectedOutput: "TOTAL=42 LEVEL=IMPROVE" },
          ],
          coinReward: 25,
          xpReward: 45,
        },
      },
    ],
  },
];
