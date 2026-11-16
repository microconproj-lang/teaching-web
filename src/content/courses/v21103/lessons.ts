import type { InteractiveLessonDef, LessonResourceDef } from "@/core/config/curriculum-types";

const UNIT5_RESOURCES: LessonResourceDef[] = [
  {
    label: "แผนการจัดการเรียนรู้ หน่วยที่ 5: โปรแกรมจำลองและออกแบบ (.pdf)",
    kind: "guide",
    href: "/courses/v21103/sheets/unit-05-lesson-plan.pdf",
  },
];

export const V21103_LESSONS: InteractiveLessonDef[] = [
  {
    key: "m1-algo-intro",
    courseCode: "ว21103",
    gradeLevel: 1,
    unitNo: 1,
    title: "อัลกอริทึมและการเรียงลำดับขั้นตอน",
    subtitle: "ทำความเข้าใจลำดับก่อน-หลัง (Sequence) และจำลองหุ่นยนต์ทำงานทีละคำสั่ง",
    durationMin: 12,
    iconBg: "amber",
    slides: [
      {
        id: "s1",
        kind: "concept",
        title: "คอมพิวเตอร์ทำตามคำสั่งทีละบรรทัด",
        subtitle: "ถ้าสลับขั้นตอนผิด ผลลัพธ์ย่อมผิดเพี้ยนทันที",
        body: [
          "อัลกอริทึม (Algorithm) คือลำดับขั้นตอนการทำงานที่ชัดเจนและมีจุดสิ้นสุด",
          "ก่อนเขียนโค้ดจริง เราต้องฝึก Decomposition (แยกปัญหาย่อย) และ Sequencing (เรียงลำดับก่อนหลัง) ให้แม่นยำ",
        ],
        callout: "สามารถกดเปิดด่านหุ่นยนต์จัดคิวใน 'แผนที่ล่าสมบัติ' เพื่อฝึกต่อยอดได้ทันที",
      },
      {
        id: "s2",
        kind: "visualizer",
        title: "จำลองลำดับคิวคำสั่งหุ่นยนต์ (Step-by-Step)",
        subtitle: "กดเดินหน้าทีละขั้นหรือทดลองสลับขั้นตอนเพื่อสังเกตผลลัพธ์",
        body: ["สังเกตสถานะของแก้วโกโก้และค่าตัวแปรในแต่ละขั้นของการทำงาน"],
        visualizerType: "queue-stepper",
      },
      {
        id: "s3",
        kind: "quiz",
        title: "เช็กความเข้าใจ: ลำดับขั้นตอน",
        body: ["เลือกคำตอบที่ถูกต้องที่สุด"],
        quiz: {
          checkKey: "quiz-m1-seq",
          question: "เหตุใดการจัดลำดับขั้นตอนก่อนเขียนโปรแกรมจึงสำคัญ?",
          options: [
            "ช่วยให้คอมพิวเตอร์ทำงานตามลำดับที่ถูกต้องและลดข้อผิดพลาด",
            "ทำให้ไม่ต้องใช้ไฟฟ้าในการประมวลผล",
            "เพื่อทำให้ไฟล์โปรแกรมมีขนาดใหญ่ขึ้น",
            "ไม่จำเป็น สามารถสลับบรรทัดใดก่อนก็ได้เสมอ",
          ],
          correctIndex: 0,
          explanation: "คอมพิวเตอร์ทำตามคำสั่งทีละขั้นอย่างซื่อตรง หากลำดับก่อน-หลังผิด ผลลัพธ์จะคลาดเคลื่อนทันที",
          coinReward: 10,
        },
      },
    ],
  },
  {
    key: "m1-binary-logic",
    courseCode: "ว21103",
    gradeLevel: 1,
    unitNo: 1,
    title: "เลขฐานสอง 0 กับ 1 และการแทนภาพ",
    subtitle: "ถอดรหัส 8 บิตให้กลายเป็นค่าตัวเลขฐานสิบและลวดลายพิกเซล",
    durationMin: 12,
    iconBg: "emerald",
    slides: [
      {
        id: "s1",
        kind: "visualizer",
        title: "Visualizer: เครื่องแปลงรหัสฐานสอง 8-Bit",
        subtitle: "คลิกเปิด-ปิดแต่ละบิต (128, 64, 32, 16, 8, 4, 2, 1) เพื่อดูค่าเลขฐานสิบ",
        body: ["คอมพิวเตอร์เก็บตัวเลข ตัวอักษร และสีพิกเซลทุกอย่างด้วยสวิตช์เปิด (1) และปิด (0)"],
        visualizerType: "binary-bits",
      },
      {
        id: "s2",
        kind: "quiz",
        title: "เช็กความเข้าใจ: ค่าบิตฐานสอง",
        body: ["คำนวณค่าเลขฐานสิบจากรูปแบบบิตต่อไปนี้"],
        quiz: {
          checkKey: "quiz-m1-bin",
          question: "เลขฐานสอง 00001010 มีค่าเท่ากับเท่าไรในระบบเลขฐานสิบ?",
          options: ["8", "10", "12", "16"],
          correctIndex: 1,
          explanation: "บิตที่มีค่า 1 อยู่ที่ตำแหน่งค่าประจำหลัก 8 และ 2 ดังนั้น 8 + 2 = 10",
          coinReward: 10,
        },
      },
    ],
  },
  {
    key: "v21103-u5-circuit",
    courseCode: "ว21103",
    gradeLevel: 1,
    unitNo: 5,
    title: "หน่วยที่ 5.1: อุปกรณ์อิเล็กทรอนิกส์ ความปลอดภัย และ Tinkercad",
    subtitle:
      "ตัวชี้วัด ว 4.1 ม.1/5 · Micro:bit (Breakout), Breadboard, LED, ตัวต้านทาน และการจำลองวงจรก่อนลงมือจริง",
    durationMin: 15,
    iconBg: "blue",
    resources: UNIT5_RESOURCES,
    slides: [
      {
        id: "u5-c-s1",
        kind: "concept",
        title: "ทำไมต้องจำลองการทำงานด้วย Tinkercad ก่อนต่อวงจรจริง?",
        subtitle: "ขั้นที่ 1 Engage — เชื่อมโยงระบบอัตโนมัติรอบตัว (ไฟถนนอัตโนมัติ & สมาร์ทฟาร์ม)",
        body: [
          "ระบบอัตโนมัติในชีวิตประจำวัน เช่น ไฟถนนอัตโนมัติที่เปิดเมื่อฟ้ามืด หรือระบบรดน้ำสมาร์ทฟาร์ม ล้วนทำงานด้วยการรับข้อมูลจากเซนเซอร์ ประมวลผลเงื่อนไข และสั่งอุปกรณ์ไฟฟ้าทำงาน",
          "การใช้โปรแกรมจำลองและออกแบบอย่าง Tinkercad ช่วยให้นักเรียนวางอุปกรณ์ Micro:bit ทดสอบสายไฟ เขียนโค้ด และตรวจสอบข้อผิดพลาดได้ทันทีโดยไม่เสี่ยงทำอุปกรณ์จริงชำรุดหรือเกิดไฟฟ้าลัดวงจร",
        ],
        callout:
          "คลิปตัวอย่างประกอบขั้นกระตุ้นความสนใจในแผนการสอน: https://youtu.be/5SIhlWFAJWk — ลองตั้งคำถามว่า 'ระบบเหล่านี้รู้ได้อย่างไรว่าตอนไหนควรเปิดหรือปิดการทำงาน?'",
      },
      {
        id: "u5-c-s2",
        kind: "concept",
        title: "รู้จัก 4 อุปกรณ์หลักและความปลอดภัยทางไฟฟ้า (ว 4.1 ม.1/5)",
        subtitle: "บอร์ด Micro:bit (แบบ Breakout), Breadboard, หลอด LED และตัวต้านทาน (Resistor)",
        body: [
          "1) Micro:bit (Breakout Board): ไมโครคอนโทรลเลอร์ที่ส่งสัญญาณควบคุมผ่านขา P0/P1/P2 และมีขาไฟ 3V กับกราวด์ GND   2) Breadboard: แผงทดลองสำหรับเสียบขาอุปกรณ์และสายไฟโดยไม่ต้องบัดกรี",
          "3) หลอด LED: มีขั้วชัดเจน ขายาวคือขั้วบวก Anode (+) รับสัญญาณไฟ, ขาสั้นคือขั้วลบ Cathode (-) ต่อลง GND   4) ตัวต้านทาน (Resistor เช่น 220Ω): ทำหน้าที่จำกัดกระแสไฟฟ้าไม่ให้ไหลเข้า LED มากเกินไป ป้องกันหลอดขาดและถนอมพอร์ต Micro:bit",
        ],
        codeSnippet: `# แนวคิดการต่อวงจร LED อย่างปลอดภัยบน Breadboard\nMicro:bit Pin P0  --->  Resistor 220Ω  --->  LED (+) ขายาว\nLED (-) ขาสั้น  --->  Micro:bit GND  (ครบวงจร)`,
        callout: "จำให้แม่น: ห้ามต่อ LED เข้าแหล่งจ่ายไฟตรง ๆ โดยไม่มีตัวต้านทานเด็ดขาด",
      },
      {
        id: "u5-c-s3",
        kind: "visualizer",
        title: "จำลอง Tinkercad: ทดลองต่อวงจร & สังเกตอาการเมื่อต่อผิด",
        subtitle: "ขั้นที่ 2–3 Explore & Explain — ลองเปลี่ยนค่า Resistor, สลับขั้ว LED หรือถอดสาย GND",
        body: [
          "ทดลองเลือกค่าตัวต้านทาน 0Ω, 220Ω และ 10kΩ พร้อมลองจำลองความผิดพลาด (กลับขั้วหรือลืมสาย GND) เพื่อฝึกวิเคราะห์ปัญหาทางไฟฟ้า",
        ],
        visualizerType: "tinkercad-circuit",
      },
      {
        id: "u5-c-s4",
        kind: "quiz",
        title: "เช็กความเข้าใจ: ความปลอดภัยในการใช้อุปกรณ์อิเล็กทรอนิกส์",
        subtitle: "มาตรฐาน ว 4.1 ม.1/5 ใช้ความรู้และทักษะทางไฟฟ้า/อิเล็กทรอนิกส์อย่างถูกต้องและปลอดภัย",
        body: ["เลือกคำตอบที่อธิบายบทบาทของตัวต้านทานในวงจรได้ถูกต้องที่สุด"],
        quiz: {
          checkKey: "quiz-v21103-u5-safety",
          question: "เหตุใดในการต่อวงจร Micro:bit กับหลอด LED บน Breadboard จึงต้องต่อตัวต้านทาน (เช่น 220Ω) ร่วมด้วยเสมอ?",
          options: [
            "เพื่อจำกัดปริมาณกระแสไฟฟ้าไม่ให้ไหลเกินพิกัดจนหลอด LED ขาดหรือบอร์ดเสียหาย",
            "เพื่อให้หลอด LED สามารถสลับขั้วบวก-ลบได้โดยไม่ต้องสนใจ GND",
            "เพื่อเพิ่มแรงดันไฟฟ้าจาก 3.3V ให้กลายเป็น 220V",
            "เพื่อทำให้ไม่จำเป็นต้องเขียนโค้ดควบคุม Micro:bit",
          ],
          correctIndex: 0,
          explanation:
            "ตัวต้านทานทำหน้าที่จำกัดกระแสไฟฟ้าที่ไหลผ่านหลอด LED ช่วยป้องกันความเสียหายต่อทั้งหลอด LED และพอร์ตของ Micro:bit ตามหลักความปลอดภัย",
          coinReward: 15,
        },
      },
      {
        id: "u5-c-s5",
        kind: "mission",
        title: "ภารกิจโค้ด: ตัวตรวจสอบค่าตัวต้านทานก่อนจ่ายไฟ (Safety Check)",
        subtitle: "เขียนโปรแกรมช่วยตรวจค่าตัวต้านทาน R (โอห์ม) ก่อนเปิดวงจรจริง",
        body: [
          "รับค่าความต้านทาน r = int(input()) (หน่วยโอห์ม): ถ้า r <= 0 พิมพ์ DANGER: NO RESISTOR, ถ้า r < 100 พิมพ์ WARN: TOO LOW, ถ้า r <= 1000 พิมพ์ SAFE, และถ้าเกิน 1000 พิมพ์ DIM",
        ],
        mission: {
          checkKey: "mission-v21103-u5-resistor",
          filename: "resistor_safety.py",
          prompt: "ตรวจค่าตัวต้านทาน r (โอห์ม) เพื่อบอกสถานะความปลอดภัยของวงจร LED",
          starterCode: `r = int(input().strip())\nif r <= 0:\n    print("DANGER: NO RESISTOR")\nelif r < 100:\n    print("WARN: TOO LOW")\nelif r <= 1000:\n    print("SAFE")\nelse:\n    print("DIM")\n`,
          hints: [
            "เรียงเงื่อนไขจากค่าน้อยไปมาก: r <= 0, r < 100, r <= 1000 และ else",
            "ค่า 220Ω จะเข้าเงื่อนไข SAFE และ 10000Ω (10kΩ) จะเข้าเงื่อนไข DIM",
          ],
          testCases: [
            { label: "ไม่ใส่ตัวต้านทาน (0Ω)", stdin: ["0"], expectedOutput: "DANGER: NO RESISTOR" },
            { label: "ใช้ 220Ω เหมาะสม", stdin: ["220"], expectedOutput: "SAFE" },
            { label: "ใช้ 10kΩ (10000Ω)", stdin: ["10000"], expectedOutput: "DIM" },
          ],
          coinReward: 20,
          xpReward: 40,
        },
      },
    ],
  },
  {
    key: "v21103-u5-autolight",
    courseCode: "ว21103",
    gradeLevel: 1,
    unitNo: 5,
    title: "หน่วยที่ 5.2: ใบงาน 5.1 ระบบเปิด-ปิดไฟ LED อัตโนมัติ (5E)",
    subtitle:
      "ตัวชี้วัด ว 4.1 ม.1/4 · ออกแบบ Block-based coding เซนเซอร์วัดแสง Micro:bit ทดสอบ ประเมินผล และระบุข้อบกพร่อง",
    durationMin: 18,
    iconBg: "purple",
    resources: UNIT5_RESOURCES,
    slides: [
      {
        id: "u5-a-s1",
        kind: "concept",
        title: "โจทย์ใบงาน 5.1: ระบบเปิด-ปิดไฟ LED อัตโนมัติด้วยเซนเซอร์วัดแสง",
        subtitle: "ขั้นที่ 4–5 Elaborate & Evaluate (ตามแผนการสอนรายวิชา ว21103)",
        body: [
          "ในขั้นขยายความรู้ (Elaborate) นักเรียนแต่ละคนต้องออกแบบระบบเปิด-ปิดไฟ LED อัตโนมัติด้วยเซนเซอร์วัดแสงบนบอร์ด Micro:bit ผ่านโปรแกรม Tinkercad พร้อมทั้งทดสอบและแก้ไขทั้งส่วนการต่อสายไฟและบล็อกคำสั่งด้วยตนเอง",
          "ขั้นประเมินผล (Evaluate): อาสาสมัครนำเสนอแนวคิดเงื่อนไขและวิธีแก้ปัญหาที่พบ จากนั้นตรวจสอบความถูกต้องตามใบงาน 5.1 (เกณฑ์ผ่านด้าน K และ P ร้อยละ 80 ขึ้นไป) และส่งลิงก์ผลงาน Tinkercad เข้าระบบ LMS",
        ],
        callout:
          "แนวคิดหลัก: เซนเซอร์วัดแสงบน Micro:bit อ่านค่าความสว่างเป็นตัวเลข 0 (มืดสนิท) ถึง 255 (สว่างจ้า) เพื่อนำไปเปรียบเทียบในเงื่อนไข IF ... ELSE",
      },
      {
        id: "u5-a-s2",
        kind: "concept",
        title: "โครงสร้าง Block-based Coding และวิธีไล่หาข้อบกพร่อง (Debug)",
        subtitle: "เปรียบเทียบวงจรไฟกะพริบ vs วงจรไฟถนนอัตโนมัติ",
        body: [
          "1) ไฟกะพริบพื้นฐาน: ใช้ลูป forever สลับเขียนสัญญาณ digital write pin P0 = 1 (หน่วงเวลา pause) แล้วสลับเป็น 0",
          "2) ไฟอัตโนมัติด้วยเซนเซอร์แสง: อ่านค่า light level แล้วเทียบกับเกณฑ์ (เช่น < 100) หากจริงให้สั่ง P0 = 1 (เปิดไฟ) มิฉะนั้น P0 = 0 (ปิดไฟ) — หากผลลัพธ์กลับด้าน (สว่างกลับเปิดไฟ) ให้ตรวจเครื่องหมายเปรียบเทียบ < กับ >",
        ],
        codeSnippet: `# ตัวอย่างตรรกะ Block-based / Python บน Micro:bit\nforever:\n    light = input.light_level()   # ค่า 0..255\n    if light < 100:\n        pins.digital_write_pin(P0, 1)  # มืด -> เปิด LED\n    else:\n        pins.digital_write_pin(P0, 0)  # สว่าง -> ปิด LED`,
      },
      {
        id: "u5-a-s3",
        kind: "visualizer",
        title: "ห้องทดลองใบงาน 5.1: ทดสอบเซนเซอร์วัดแสงและปรับ Threshold",
        subtitle: "สลับไปที่แท็บ '2. ใบงาน 5.1: ไฟ LED อัตโนมัติด้วยเซนเซอร์แสง' แล้วเลื่อนปรับค่าแสง",
        body: [
          "ลองกดค่าทดสอบ กลางคืน (20), พลบค่ำ (85), ในห้อง (160), แดดจ้า (230) พร้อมสังเกตการทำงานของขา P0 และหลอด LED",
        ],
        visualizerType: "tinkercad-circuit",
      },
      {
        id: "u5-a-s4",
        kind: "quiz",
        title: "เช็กความเข้าใจ: ทดสอบ ประเมินผล และระบุข้อบกพร่อง (ว 4.1 ม.1/4)",
        body: ["วิเคราะห์สาเหตุของปัญหาเมื่อรัน Simulation บน Tinkercad แล้วไม่เป็นไปตามต้องการ"],
        quiz: {
          checkKey: "quiz-v21103-u5-debug",
          question:
            "นักเรียนต่อวงจร LED ใน Tinkercad ครบถ้วนและปลอดภัย แต่พบว่าเมื่อแสงแดดจ้า (ค่าแสง = 220) หลอด LED กลับติดสว่าง และตอนมืด (ค่าแสง = 20) หลอดกลับดับ ข้อบกพร่องเกิดจากจุดใด?",
          options: [
            "กำหนดเงื่อนไขเปรียบเทียบในบล็อกคำสั่งกลับด้าน (ใช้ light_level > threshold แทน <)",
            "ใช้ตัวต้านทานขนาด 220Ω ทำให้เซนเซอร์วัดแสงเสีย",
            "ต้องถอดสาย GND ออกเพื่อให้หลอดดับตอนกลางวัน",
            "Micro:bit ไม่สามารถอ่านค่าตัวเลขเกิน 100 ได้",
          ],
          correctIndex: 0,
          explanation:
            "เมื่อวงจรถูกต้องแต่พฤติกรรม ON/OFF สลับตรงข้ามกับโจทย์ สาเหตุมักอยู่ที่เงื่อนไขเปรียบเทียบในบล็อกโค้ด (เขียน > แทน < หรือสั่ง P0 = 1/0 สลับสาขา if/else)",
          coinReward: 15,
        },
      },
      {
        id: "u5-a-s5",
        kind: "mission",
        title: "ภารกิจโค้ด: จำลองระบบไฟ LED อัตโนมัติ (ใบงาน 5.1)",
        subtitle: "เขียนโค้ดตัดสินใจเปิด-ปิด LED จากค่าความสว่างและเกณฑ์ Threshold พร้อมตรวจค่าผิดพลาด",
        body: [
          "รับค่า light และ threshold คั่นด้วยเว้นวรรค: หาก light < 0 หรือ light > 255 พิมพ์ SENSOR ERROR, หาก light < threshold พิมพ์ LED ON, มิฉะนั้นพิมพ์ LED OFF",
        ],
        mission: {
          checkKey: "mission-v21103-u5-autolight",
          filename: "autolight_5_1.py",
          prompt: "ตรวจสอบช่วงค่าเซนเซอร์แสง 0–255 แล้วสั่ง LED ON เมื่อ light < threshold มิฉะนั้น LED OFF",
          starterCode: `light, threshold = [int(x) for x in input().split()]\nif light < 0 or light > 255:\n    print("SENSOR ERROR")\nelif light < threshold:\n    print("LED ON")\nelse:\n    print("LED OFF")\n`,
          hints: [
            "เช็กช่วงผิดปกติของเซนเซอร์ก่อน (light < 0 or light > 255)",
            "ใช้เงื่อนไข light < threshold สำหรับสั่งเปิดไฟเมื่อสภาพแวดล้อมมืด",
          ],
          testCases: [
            { label: "กลางคืน (แสง 40, เกณฑ์ 100)", stdin: ["40 100"], expectedOutput: "LED ON" },
            { label: "กลางวัน (แสง 210, เกณฑ์ 100)", stdin: ["210 100"], expectedOutput: "LED OFF" },
            { label: "ค่าแสงเกินช่วง (-5, เกณฑ์ 100)", stdin: ["-5 100"], expectedOutput: "SENSOR ERROR" },
          ],
          coinReward: 25,
          xpReward: 45,
        },
      },
    ],
  },
];
