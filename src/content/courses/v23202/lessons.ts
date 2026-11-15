import type { BlueprintSlideDef, InteractiveLessonDef } from "@/core/config/curriculum-types";

function makeBlueprintSlides(unitFolder: string, count: number): BlueprintSlideDef[] {
  return Array.from({ length: count }, (_, idx) => {
    const num = String(idx + 1).padStart(2, "0");
    return {
      src: `/courses/v23202/slides/${unitFolder}/slide-${num}.webp`,
      title: `สไลด์ที่ ${idx + 1}`,
    };
  });
}

export const V23202_LESSONS: InteractiveLessonDef[] = [
  // =========================================================================
  // หน่วยที่ 0: ปฐมนิเทศและแนวคิดพื้นฐาน
  // =========================================================================
  {
    key: "v23202-u0",
    courseCode: "ว23202",
    gradeLevel: 3,
    unitNo: 0,
    title: "หน่วยที่ 0: ปฐมนิเทศ SE & พื้นฐานระบบ IoT",
    subtitle: "Software Engineering, SDLC 6 ระยะ, เกมนายไปรษณีย์ MQTT และบทบาททีม Scrum",
    durationMin: 20,
    iconBg: "blue",
    blueprintSlides: makeBlueprintSlides("unit-00", 12),
    resources: [
      { label: "ใบความรู้ หน่วยที่ 0 (.docx)", kind: "knowledge", href: "/courses/v23202/sheets/unit-00-knowledge.docx" },
      { label: "ใบงาน หน่วยที่ 0 (.docx)", kind: "worksheet", href: "/courses/v23202/sheets/unit-00-worksheet.docx" },
      { label: "สไลด์ประกอบการสอน หน่วยที่ 0 (.pdf)", kind: "slides", href: "/courses/v23202/sheets/unit-00-slides.pdf" },
    ],
    slides: [
      {
        id: "u0-s1",
        kind: "concept",
        title: "เขียนโค้ดอย่างเดียวไม่พอ: ยินดีต้อนรับสู่ Software Engineering",
        subtitle: "ทำไมการพัฒนาแอป IoT ต้องมีขั้นตอนที่เป็นระบบและทำงานเป็นทีม",
        imageUrl: "/courses/v23202/slides/unit-00/slide-01.webp",
        imageCaption: "พิมพ์เขียวรายวิชา ว23202: วิศวกรรมซอฟต์แวร์เบื้องต้นและ IoT",
        body: [
          "การเขียนโปรแกรมทั่วไปมักเริ่มเขียนโค้ดทันทีตามไอเดีย ทำคนเดียว ไม่มีเอกสารหรือแผนทดสอบ",
          "วิศวกรรมซอฟต์แวร์ (Software Engineering) ใช้กระบวนการที่เป็นระบบ: วิเคราะห์ความต้องการ → ออกแบบ → พัฒนา → ทดสอบ → ส่งมอบ → ดูแลรักษา (SDLC 6 ระยะ) และบริหารทีมด้วย Agile/Scrum (Product Owner, Scrum Master, Dev Team)",
        ],
        callout: "ตลอด 18 สัปดาห์ ทีมละ 4–5 คนจะได้สร้างระบบจริงครบ 3 ส่วน: Raspberry Pi Pico W (Edge) ↔ Raspberry Pi 5 (MQTT Broker) ↔ Web Application",
      },
      {
        id: "u0-s2",
        kind: "concept",
        title: "โลกของ IoT และรูปแบบ Publish / Subscribe",
        subtitle: "เกม 'นายไปรษณีย์' กับสถาปัตยกรรม 3 ชั้นที่ไม่เชื่อมต่อกันโดยตรง",
        imageUrl: "/courses/v23202/slides/unit-00/slide-02.webp",
        imageCaption: "ตัวอย่างระบบ IoT รอบตัวเรา: บ้านอัจฉริยะ เกษตรอัจฉริยะ ความปลอดภัย",
        body: [
          "ระบบ IoT ของเราแบ่งเป็น Sensor/Actuator บน Pico W (Edge Device), Mosquitto MQTT Broker (บุรุษไปรษณีย์บน Pi 5), และ Web App (Client)",
          "ผู้ส่ง (Publish) แปะชื่อ Topic แล้วส่งให้ Broker — ผู้รับ (Subscribe) แจ้ง Broker ว่าสนใจ Topic ไหนโดยไม่ต้องรู้ IP ของกันและกัน",
        ],
      },
      {
        id: "u0-s3",
        kind: "visualizer",
        title: "จำลองระบบ Publish / Subscribe (นายไปรษณีย์ IoT)",
        subtitle: "ทดลองส่งข้อความจาก Pico W หรือ Web App ผ่าน Broker ตาม Topic ที่ตั้งไว้",
        body: [
          "เลือก Topic ที่ Web App และ Pico W ต้องการ Subscribe แล้วลอง Publish ค่าเซนเซอร์หรือคำสั่ง ON / OFF เพื่อดูว่าใครได้รับข้อความบ้าง",
        ],
        visualizerType: "mqtt-pubsub",
      },
      {
        id: "u0-s4",
        kind: "quiz",
        title: "เช็กความเข้าใจ: ตัวกลาง Broker & บทบาทในทีม",
        subtitle: "ทบทวนจากใบงานกิจกรรมที่ 1–4 หน่วยที่ 0",
        body: ["เลือกคำตอบที่ถูกต้องที่สุดเกี่ยวกับสถาปัตยกรรม MQTT"],
        quiz: {
          checkKey: "u0-q1",
          question: "เหตุใด Edge Device (Pico W) และ Web App จึงไม่เชื่อมต่อกันโดยตรง แต่ต้องผ่าน MQTT Broker เสมอ?",
          options: [
            "เพื่อให้ผู้ส่งและผู้รับไม่ผูกติดกัน (Decoupled) เพิ่มอุปกรณ์ใหม่ที่ Topic เดิมได้โดยไม่ต้องแก้โค้ดเก่า",
            "เพราะ Pico W ไม่สามารถประมวลผลข้อความภาษาอังกฤษได้",
            "เพราะเบราว์เซอร์ไม่สามารถแสดงผล CSS ได้ถ้าไม่มี Broker",
            "เพื่อบังคับให้อุปกรณ์ทุกตัวใช้รหัสผ่านเหมือนกันหมด",
          ],
          correctIndex: 0,
          explanation: "Broker ทำหน้าที่รับ-กระจายข้อความตาม Topic ทำให้เพิ่ม Sensor หรือ Web Client ใหม่เข้า Topic เดิมได้ง่ายโดยไม่ต้องรู้ IP กันและกัน",
          coinReward: 15,
        },
      },
      {
        id: "u0-s5",
        kind: "mission",
        title: "ภารกิจโค้ด: แยกส่วนข้อความ MQTT Topic",
        subtitle: "ลองเขียน Python แยกองค์ประกอบของ Topic มาตรฐานห้องเรียน",
        body: ["สร้างสคริปต์อ่าน Topic เช่น class/team1/room/temperature แล้วพิมพ์ชื่อทีม (ส่วนที่ 2)"],
        mission: {
          checkKey: "u0-m1",
          filename: "mqtt_topic_split.py",
          prompt: "รับ MQTT Topic 1 บรรทัด เช่น class/team3/room/temp แล้วพิมพ์ชื่อทีม (เช่น team3)",
          starterCode: `topic = input().strip()\nparts = topic.split("/")\nprint(parts[1])\n`,
          hints: [
            "ใช้ topic.split(\"/\") เพื่อแยกเป็น list ตามเครื่องหมายทับ",
            "Index เริ่มจาก 0 ดังนั้นทีมคือ parts[1]",
          ],
          testCases: [
            { label: "Topic ทีม 1", stdin: ["class/team1/room/temperature"], expectedOutput: "team1" },
            { label: "Topic ทีม 5", stdin: ["class/team5/fan/cmd"], expectedOutput: "team5" },
          ],
          coinReward: 20,
          xpReward: 30,
        },
      },
    ],
  },

  // =========================================================================
  // หน่วยที่ 1: การรวบรวมและวิเคราะห์ความต้องการ
  // =========================================================================
  {
    key: "v23202-u1",
    courseCode: "ว23202",
    gradeLevel: 3,
    unitNo: 1,
    title: "หน่วยที่ 1: วิเคราะห์ความต้องการ & Product Backlog",
    subtitle: "การสัมภาษณ์ปลายเปิด, User Story (Connextra), Acceptance Criteria และ MoSCoW",
    durationMin: 20,
    iconBg: "amber",
    blueprintSlides: makeBlueprintSlides("unit-01", 15),
    resources: [
      { label: "ใบความรู้ หน่วยที่ 1 (.docx)", kind: "knowledge", href: "/courses/v23202/sheets/unit-01-knowledge.docx" },
      { label: "ใบงาน หน่วยที่ 1 (.docx)", kind: "worksheet", href: "/courses/v23202/sheets/unit-01-worksheet.docx" },
      { label: "ใบงานทีม IoT Startup Mission (.docx)", kind: "worksheet", href: "/courses/v23202/sheets/unit-01-startup-mission.docx" },
      { label: "สไลด์ หน่วยที่ 1 (.pdf)", kind: "slides", href: "/courses/v23202/sheets/unit-01-slides.pdf" },
    ],
    slides: [
      {
        id: "u1-s1",
        kind: "concept",
        title: "เริ่มจากผู้ใช้ ไม่ใช่เริ่มจากความอยากเขียนโค้ด",
        subtitle: "การสัมภาษณ์ปลายเปิด + Connextra User Story + Acceptance Criteria",
        imageUrl: "/courses/v23202/slides/unit-01/slide-04.webp",
        imageCaption: "โครงสร้าง User Story: ในฐานะ... ฉันต้องการ... เพื่อที่จะ...",
        body: [
          "ใช้คำถามปลายเปิด (Open-ended Question เช่น อะไร / อย่างไร / ทำไม) กับ Stakeholder เพื่อจับปัญหาที่เกิดขึ้นจริง",
          "เขียน User Story ตามรูปแบบ 'ในฐานะ [บทบาท] ฉันต้องการ [เป้าหมาย] เพื่อที่จะ [คุณค่า]' พร้อม Acceptance Criteria ที่วัดผลได้เป็นตัวเลขชัดเจน (เช่น ไฟติดภายใน 3 วินาที)",
        ],
        callout: "หลีกเลี่ยงคำว่า 'ในฐานะผู้ใช้' แบบกว้างเกินไป ควรระบุบทบาทจริง เช่น เจ้าของต้นไม้, สมาชิกในบ้าน, เวรประจำห้องเรียน",
      },
      {
        id: "u1-s2",
        kind: "visualizer",
        title: "Workshop จัดลำดับความสำคัญด้วย MoSCoW",
        subtitle: "แบ่งงาน Product Backlog เป็น Must (~60%) / Should (~20%) / Could (~20%) / Won't",
        body: [
          "ทดลองจัดกลุ่มฟีเจอร์ของระบบควบคุมไฟและพัดลมห้องเรียน เพื่อให้ทีมส่งงานทันใน 18 สัปดาห์ โดยสัดส่วน Must have ไม่เกินงบเวลาหลัก 60%",
        ],
        visualizerType: "moscow-backlog",
      },
      {
        id: "u1-s3",
        kind: "quiz",
        title: "เช็กความเข้าใจ: Acceptance Criteria ที่ดี",
        subtitle: "ความแตกต่างระหว่างเกณฑ์ที่วัดผลได้กับความรู้สึกส่วนตัว",
        body: ["เลือก Acceptance Criteria ที่เขียนได้ถูกต้องตามหลักวิศวกรรมซอฟต์แวร์"],
        quiz: {
          checkKey: "u1-q1",
          question: "ข้อใดคือ Acceptance Criteria ที่ดีที่สุดสำหรับปุ่มเปิดไฟห้องผ่านเว็บแอป?",
          options: [
            "เมื่อกดปุ่ม 'เปิดไฟ' บนเว็บแอป หลอดไฟ LED ต้องติดและสถานะหน้าเว็บอัปเดตภายใน 3 วินาที",
            "ระบบต้องดูสวยงาม ใช้งานง่าย และทำให้ผู้ใช้รู้สึกประทับใจ",
            "ต้องเขียนโค้ดด้วยภาษา MicroPython เวอร์ชันล่าสุดและใช้ CSS Flexbox",
            "ผู้ใช้สามารถเปิดไฟได้เมื่อต้องการ",
          ],
          correctIndex: 0,
          explanation: "Acceptance Criteria ต้องระบุเงื่อนไขและผลลัพธ์ที่ตรวจสอบได้ว่า ผ่าน/ไม่ผ่าน แบบเป็นรูปธรรม (เช่น ภายใน 3 วินาที) ไม่ใช่คำอธิบายกว้างๆ หรือรายละเอียดเทคนิค",
          coinReward: 15,
        },
      },
      {
        id: "u1-s4",
        kind: "mission",
        title: "ภารกิจโค้ด: ตัวช่วยตรวจรูปแบบ User Story",
        subtitle: "เขียนฟังก์ชันตรวจว่าข้อความมีองค์ประกอบครบ 3 ส่วนหรือไม่",
        body: ["ตรวจสอบว่าข้อความ User Story มีทั้ง 'ในฐานะ', 'ฉันต้องการ' และ 'เพื่อที่จะ'"],
        mission: {
          checkKey: "u1-m1",
          filename: "check_user_story.py",
          prompt: "อ่านข้อความ 1 บรรทัด ถ้ามีครบทั้งคำว่า 'ในฐานะ', 'ฉันต้องการ', 'เพื่อที่จะ' ให้พิมพ์ COMPLETE มิฉะนั้นพิมพ์ REVISE",
          starterCode: `story = input().strip()\nif "ในฐานะ" in story and "ฉันต้องการ" in story and "เพื่อที่จะ" in story:\n    print("COMPLETE")\nelse:\n    print("REVISE")\n`,
          hints: [
            "ใช้ตัวดำเนินการ in เพื่อตรวจว่ามีคำสำคัญครบ 3 คำในตัวแปร story",
            "เชื่อมเงื่อนไขทั้ง 3 ตัวด้วย and",
          ],
          testCases: [
            {
              label: "ครบ 3 ส่วน",
              stdin: ["ในฐานะเจ้าของต้นไม้ ฉันต้องการแจ้งเตือนดินแห้ง เพื่อที่จะรดน้ำทันเวลา"],
              expectedOutput: "COMPLETE",
            },
            {
              label: "ขาดเหตุผล (เพื่อที่จะ)",
              stdin: ["ในฐานะนักเรียน ฉันต้องการดูค่าอุณหภูมิในห้อง"],
              expectedOutput: "REVISE",
            },
          ],
          coinReward: 20,
          xpReward: 30,
        },
      },
    ],
  },

  // =========================================================================
  // หน่วยที่ 2: การออกแบบระบบและสถาปัตยกรรม
  // =========================================================================
  {
    key: "v23202-u2",
    courseCode: "ว23202",
    gradeLevel: 3,
    unitNo: 2,
    title: "หน่วยที่ 2: ออกแบบสถาปัตยกรรม MQTT & เซนเซอร์",
    subtitle: "System Architecture 5 องค์ประกอบ, กฎตั้งชื่อ MQTT Topic, Datasheet และ Wireframe",
    durationMin: 20,
    iconBg: "purple",
    blueprintSlides: makeBlueprintSlides("unit-02", 15),
    resources: [
      { label: "ใบความรู้ หน่วยที่ 2 (.docx)", kind: "knowledge", href: "/courses/v23202/sheets/unit-02-knowledge.docx" },
      { label: "ใบงาน หน่วยที่ 2 (.docx)", kind: "worksheet", href: "/courses/v23202/sheets/unit-02-worksheet.docx" },
    ],
    slides: [
      {
        id: "u2-s1",
        kind: "concept",
        title: "แบบแปลน 5 องค์ประกอบ + กฎตั้งชื่อ MQTT Topic",
        subtitle: "ออกแบบให้ขาดตกบกพร่องน้อยที่สุดก่อนเขียนโค้ดบรรทัดแรก",
        imageUrl: "/courses/v23202/slides/unit-02/slide-05.webp",
        imageCaption: "ผัง Topic แยกลำดับชั้นกว้างไปแคบ: class/teamX/location/metric",
        body: [
          "ระบบประกอบด้วย: Sensor → Edge Device (Pico W) → Broker (Pi 5 Mosquitto) ↔ Client (Web App) และกลับไปสั่ง Actuator (Relay)",
          "กฎสำคัญของ MQTT Topic: ใช้ตัวพิมพ์เล็กอังกฤษ+ตัวเลขเท่านั้น ขึ้นต้นด้วย class/teamX/ แยก topic ข้อมูล (.../state) ออกจากคำสั่ง (.../cmd) และห้ามใช้ wildcard (+, #) ตอน Publish!",
        ],
        codeSnippet: `class/team1/room/temperature   # Pico W -> Web App (ค่าตัวเลข)\nclass/team1/fan/cmd            # Web App -> Pico W (ON / OFF)\nclass/team1/fan/state          # Pico W รายงานสถานะจริงกลับ`,
      },
      {
        id: "u2-s2",
        kind: "visualizer",
        title: "สำรวจ Datasheet เซนเซอร์ & ขา GPIO บน Pico W",
        subtitle: "ทำความเข้าใจแรงดันไฟ 3.3V/5V, สัญญาณ Digital vs Analog (ADC) และข้อควรระวัง",
        body: [
          "เลือกอุปกรณ์จริงในห้องเรียน (DHT22, LDR, PIR, Soil Moisture, Relay) เพื่อดูคาบเวลาอ่านค่า ช่วงวัดผล และความปลอดภัยห้ามต่อไฟบ้าน 220V โดยตรง",
        ],
        visualizerType: "pico-gpio",
      },
      {
        id: "u2-s3",
        kind: "quiz",
        title: "เช็กความเข้าใจ: ความปลอดภัย Topic & Wildcards",
        subtitle: "จับผิดการตั้งชื่อ Topic ที่อาจทำให้ข้อมูลทั้งห้องปนกัน",
        body: ["เลือกคำตอบที่ถูกต้องเกี่ยวกับการใช้ MQTT Topic ในห้องเรียน"],
        quiz: {
          checkKey: "u2-q1",
          question: "เหตุใดจึงควรแยก Topic .../cmd ออกจาก Topic .../state แทนการใช้ชื่อเดียวกันทั้งสั่งงานและรายงานผล?",
          options: [
            "ป้องกันข้อความวนกลับมาหาผู้ส่งเอง และทำให้หน้าเว็บยืนยันได้จริงว่าอุปกรณ์ทำงานตามคำสั่งแล้ว",
            "เพราะ MQTT อนุญาตให้ส่งข้อความในหนึ่ง Topic ได้ไม่เกินวันละ 10 ครั้ง",
            "เพราะ Topic ที่ลงท้ายด้วย cmd ไม่รองรับการส่งตัวอักษรภาษาอังกฤษ",
            "เพื่อให้ Raspberry Pi Pico W เชื่อมต่อ Wi-Fi 5GHz ได้",
          ],
          correctIndex: 0,
          explanation: "การแยก cmd (คำสั่งจาก Web) กับ state (สถานะจริงจากอุปกรณ์) ช่วยหลีกเลี่ยงลูปข้อความย้อนกลับและยืนยันการทำงานจริงของฮาร์ดแวร์",
          coinReward: 15,
        },
      },
      {
        id: "u2-s4",
        kind: "mission",
        title: "ภารกิจโค้ด: ตรวจมาตรฐาน MQTT Topic ของทีม",
        subtitle: "เขียนตัวตรวจ Topic ให้เป็นตัวพิมพ์เล็ก ไม่มีช่องว่าง และขึ้นต้นด้วย class/team",
        body: ["รับชื่อ Topic 1 บรรทัด ตรวจสอบว่าเป็นตัวพิมพ์เล็กทั้งหมด ไม่มีเว้นวรรค และขึ้นต้นด้วย class/team"],
        mission: {
          checkKey: "u2-m1",
          filename: "validate_topic.py",
          prompt: "ตรวจ Topic: ถ้าขึ้นต้นด้วย 'class/team' และไม่มีช่องว่าง ' ' และตัวอักษรเป็นตัวพิมพ์เล็กทั้งหมด (t == t.lower()) และไม่มี '+' หรือ '#' ให้พิมพ์ VALID มิฉะนั้นพิมพ์ INVALID",
          starterCode: `t = input().strip()\nif t.startswith("class/team") and " " not in t and t == t.lower() and "+" not in t and "#" not in t:\n    print("VALID")\nelse:\n    print("INVALID")\n`,
          hints: [
            "ใช้ t.startswith(\"class/team\") และ t == t.lower()",
            "อย่าลืมเช็กว่าห้ามมีช่องว่าง \" \", '+' และ '#' ตอน Publish",
          ],
          testCases: [
            { label: "Topic ถูกต้อง", stdin: ["class/team2/garden/soil_moisture"], expectedOutput: "VALID" },
            { label: "มีตัวพิมพ์ใหญ่", stdin: ["class/Team2/Room/Temp"], expectedOutput: "INVALID" },
            { label: "ใส่ # ตอน publish", stdin: ["class/team2/#"], expectedOutput: "INVALID" },
          ],
          coinReward: 25,
          xpReward: 35,
        },
      },
    ],
  },

  // =========================================================================
  // หน่วยที่ 3: เตรียมสภาพแวดล้อมพัฒนา (Sprint 0)
  // =========================================================================
  {
    key: "v23202-u3",
    courseCode: "ว23202",
    gradeLevel: 3,
    unitNo: 3,
    title: "หน่วยที่ 3: Sprint 0 — Broker & MicroPython 'Hello MQTT'",
    subtitle: "ตั้งค่า Mosquitto (TCP 1883 / WS 9001), Thonny IDE, Wi-Fi 2.4GHz และ umqtt.simple",
    durationMin: 20,
    iconBg: "emerald",
    blueprintSlides: makeBlueprintSlides("unit-03", 15),
    resources: [
      { label: "ใบความรู้ หน่วยที่ 3 (.docx)", kind: "knowledge", href: "/courses/v23202/sheets/unit-03-knowledge.docx" },
      { label: "ใบงาน หน่วยที่ 3 (.docx)", kind: "worksheet", href: "/courses/v23202/sheets/unit-03-worksheet.docx" },
    ],
    slides: [
      {
        id: "u3-s1",
        kind: "concept",
        title: "Sprint 0: ต่อท่อจาก Pico W ไปยัง Pi 5 สำเร็จครั้งแรก",
        subtitle: "ทำไมต้องใช้ Wi-Fi 2.4GHz และขั้นตอนเชื่อมต่อด้วย network + umqtt.simple",
        imageUrl: "/courses/v23202/slides/unit-03/slide-06.webp",
        imageCaption: "โครงสร้างการเชื่อมต่อ Wi-Fi (STA_IF) และ Publish ข้อความแรกจาก Thonny IDE",
        body: [
          "ก่อนเขียนฟีเจอร์ซับซ้อน ทีมต้องพิสูจน์ใน Sprint 0 ว่า (1) Mosquitto Broker บน Pi 5 รับข้อความจาก mosquitto_pub/sub ได้ และ (2) Pico W เชื่อมต่อ Wi-Fi 2.4GHz เพื่อส่ง 'Hello MQTT' ขึ้น Broker สำเร็จ",
          "Pico W รองรับ Wi-Fi คลื่นความถี่ 2.4GHz เท่านั้น ไม่รองรับ 5GHz และเมื่อโค้ดทำงานได้แล้วให้บันทึกใน Thonny เป็น main.py + สำรองเวอร์ชัน เช่น hello_mqtt_v1.py",
        ],
        codeSnippet: `import network, time\nfrom umqtt.simple import MQTTClient\n\nwlan = network.WLAN(network.STA_IF)\nwlan.active(True)\nwlan.connect("SCHOOL_24G", "password")\nwhile not wlan.isconnected():\n    time.sleep(1)\n\nclient = MQTTClient("pico-team1", "192.168.1.100")\nclient.connect()\nclient.publish("class/team1/hello", "Hello MQTT")\nclient.disconnect()`,
      },
      {
        id: "u3-s2",
        kind: "visualizer",
        title: "ทดลอง Publish / Subscribe ผ่าน Broker (Sprint 0 Dry-Run)",
        subtitle: "ทดลองเลือก Topic ของทีมแล้วจำลองคำสั่ง Hello MQTT ขึ้น Broker กลาง",
        body: [
          "สังเกตพอร์ตของ Mosquitto: พอร์ต 1883 ใช้สำหรับ Pico W (TCP) และพอร์ต 9001 ใช้สำหรับ Web App (WebSocket)",
        ],
        visualizerType: "mqtt-pubsub",
      },
      {
        id: "u3-s3",
        kind: "quiz",
        title: "เช็กความเข้าใจ: วิเคราะห์ปัญหา Pico W เชื่อมเน็ตไม่ได้",
        subtitle: "คำถามทบทวนจากใบงานส่วนที่ 4 หน่วยที่ 3",
        body: ["หาก wlan.isconnected() คืนค่า False ค้างอยู่ตลอด ควรตรวจสอบสิ่งใดเป็นอันดับแรก?"],
        quiz: {
          checkKey: "u3-q1",
          question: "ข้อใดคือสาเหตุที่ทำให้ Raspberry Pi Pico W ไม่สามารถเกาะสัญญาณ Wi-Fi ในห้องเรียนได้บ่อยที่สุด?",
          options: [
            "เชื่อมต่อกับ Wi-Fi ย่าน 5GHz หรือ Dual-band ที่ไม่แยก SSID สำหรับ 2.4GHz (หรือใส่รหัสผ่านผิด)",
            "ลืมใส่แท็ก <script src='mqtt.min.js'> ในโปรแกรม Thonny IDE",
            "ไม่ได้เปิดพอร์ต HTML HTTP พอร์ต 80 บนตัวบอร์ด Pico W",
            "ใช้สาย USB ที่สั้นกว่า 1 เมตรในการจ่ายไฟ",
          ],
          correctIndex: 0,
          explanation: "ชิปไร้สายของ Pico W รองรับเฉพาะ Wi-Fi 2.4GHz (802.11n) จึงต้องตรวจ SSID ย่าน 2.4GHz และรหัสผ่านให้ถูกต้อง",
          coinReward: 15,
        },
      },
      {
        id: "u3-s4",
        kind: "mission",
        title: "ภารกิจโค้ด: ตัวคัดกรองการตั้งค่า Wi-Fi ของ Pico W",
        subtitle: "ตรวจจับคลื่นความถี่ 5GHz และ Broker IP ก่อนอัปโหลดโค้ดลงบอร์ด",
        body: ["อ่านค่า band (เช่น 2.4G หรือ 5G) และรหัสพอร์ต Broker (เช่น 1883) เพื่อตรวจสอบว่าผ่านเงื่อนไข Sprint 0 หรือไม่"],
        mission: {
          checkKey: "u3-m1",
          filename: "sprint0_preflight.py",
          prompt: "รับ 2 บรรทัด: บรรทัดแรกคือคลื่น (เช่น '2.4GHz' หรือ '5GHz') บรรทัดสองคือพอร์ต Broker (เลขจำนวนเต็ม) ถ้าเป็น '2.4GHz' และพอร์ตเท่ากับ 1883 ให้พิมพ์ READY มิฉะนั้นพิมพ์ CHECK_CONFIG",
          starterCode: `band = input().strip()\nport = int(input().strip())\nif band == "2.4GHz" and port == 1883:\n    print("READY")\nelse:\n    print("CHECK_CONFIG")\n`,
          hints: ["Pico W เชื่อมต่อ TCP MQTT มาตรฐานที่พอร์ต 1883 และคลื่น 2.4GHz"],
          testCases: [
            { label: "ค่าพร้อมทำงาน", stdin: ["2.4GHz", "1883"], expectedOutput: "READY" },
            { label: "เลือก 5GHz ผิด", stdin: ["5GHz", "1883"], expectedOutput: "CHECK_CONFIG" },
            { label: "ใส่พอร์ต 9001 ใน Pico W", stdin: ["2.4GHz", "9001"], expectedOutput: "CHECK_CONFIG" },
          ],
          coinReward: 20,
          xpReward: 30,
        },
      },
    ],
  },

  // =========================================================================
  // หน่วยที่ 4: Sprint 1 — พัฒนา Edge Device
  // =========================================================================
  {
    key: "v23202-u4",
    courseCode: "ว23202",
    gradeLevel: 3,
    unitNo: 4,
    title: "หน่วยที่ 4: Sprint 1 — GPIO, เซนเซอร์ & Callback บน Edge",
    subtitle: "ควบคุมขา Pin(OUT/IN), อ่าน DHT22, รับคำสั่งด้วย set_callback และแยก Logic เพื่อ Unit Test",
    durationMin: 25,
    iconBg: "blue",
    blueprintSlides: makeBlueprintSlides("unit-04", 15),
    resources: [
      { label: "ใบความรู้ หน่วยที่ 4 (.docx)", kind: "knowledge", href: "/courses/v23202/sheets/unit-04-knowledge.docx" },
      { label: "ใบงาน หน่วยที่ 4 (.docx)", kind: "worksheet", href: "/courses/v23202/sheets/unit-04-worksheet.docx" },
    ],
    slides: [
      {
        id: "u4-s1",
        kind: "concept",
        title: "Edge Device ต้องทำ 2 ด้าน: ส่งข้อมูล (Loop) & รับคำสั่ง (Callback)",
        subtitle: "Callback Function + client.check_msg() + การแยก Logic เพื่อ Unit Test",
        imageUrl: "/courses/v23202/slides/unit-04/slide-07.webp",
        imageCaption: "โครงสร้าง Edge Device: Publish ค่าเซนเซอร์และ Subscribe รับคำสั่งด้วย Callback",
        body: [
          "Callback Function คือฟังก์ชันที่เราลงทะเบียนไว้ล่วงหน้าด้วย client.set_callback(on_message) เพื่อให้ถูกเรียกอัตโนมัติทุกครั้งที่ client.check_msg() พบข้อความใหม่",
          "หัวใจของวิศวกรรมซอฟต์แวร์ในหน่วยนี้คือ การแยกตรรกะ (Logic) เช่น decide_actuator_state(msg) ออกจาก I/O จริง เพื่อเขียน Unit Test (assert) ตรวจโค้ดได้แม้ไม่ได้ต่อบอร์ดอยู่!",
        ],
        codeSnippet: `def decide_actuator_state(msg):\n    if msg == "ON":\n        return 1\n    elif msg == "OFF":\n        return 0\n    return -1\n\n# แยกทดสอบได้ทันทีโดยไม่ต้องต่อ Broker จริง`,
      },
      {
        id: "u4-s2",
        kind: "visualizer",
        title: "จำลองขา GPIO & เซนเซอร์บน Pico W",
        subtitle: "คลิกปรับค่าอุณหภูมิ / ความสว่าง / PIR และสังเกตการสั่ง Actuator Relay",
        body: [
          "ลองสลับเซนเซอร์แต่ละตัวเพื่อดูหมายเลขขา Pin, ค่าหน่วง sleep(2) สำหรับ DHT22 และผลลัพธ์ของฟังก์ชันตัดสินใจ",
        ],
        visualizerType: "pico-gpio",
      },
      {
        id: "u4-s3",
        kind: "quiz",
        title: "เช็กความเข้าใจ: Callback และ DHT22 Timing",
        subtitle: "ข้อควรรู้สำคัญในการเขียน MicroPython บนบอร์ดจริง",
        body: ["เลือกคำตอบที่ถูกต้องเกี่ยวกับการเขียนโค้ดควบคุม Edge Device"],
        quiz: {
          checkKey: "u4-q1",
          question: "เหตุใดในการทดสอบ Unit Testing โค้ด Edge Device เราจึงเขียนฟังก์ชัน decide_actuator_state(msg) แยกออกมาจากคำสั่ง actuator.value()?",
          options: [
            "เพื่อให้ทดสอบตรรกะการตีความคำสั่งด้วย Test Case ได้ทันทีโดยไม่ต้องรอต่อบอร์ดหรือเครือข่ายจริง",
            "เพราะ MicroPython ไม่อนุญาตให้ใช้ if-elif ภายในฟังก์ชัน on_message",
            "เพราะคำสั่ง assert ใช้ได้เฉพาะกับค่าอุณหภูมิเท่านั้น",
            "เพื่อให้ค่า DHT22 อ่านได้เร็วขึ้นเป็น 0.01 วินาที",
          ],
          correctIndex: 0,
          explanation: "การแยก pure logic ออกจาก Hardware I/O ทำให้สามารถเขียน Test Case จำลอง input ต่างๆ (ON, OFF, ค่าผิดปกติ) เพื่อตรวจสอบได้รวดเร็วและแม่นยำ",
          coinReward: 15,
        },
      },
      {
        id: "u4-s4",
        kind: "mission",
        title: "ภารกิจโค้ด: เขียนฟังก์ชันแปลผลคำสั่ง Actuator (Unit Logic)",
        subtitle: "จำลองฟังก์ชัน callback จากใบความรู้หน่วยที่ 4",
        body: ["เขียนฟังก์ชัน decide_actuator(msg) ที่รับข้อความแล้วคืนค่า 1, 0 หรือ -1 (กรณีคำสั่งไม่รู้จัก)"],
        mission: {
          checkKey: "u4-m1",
          filename: "edge_logic.py",
          prompt: "เขียนฟังก์ชัน decide_actuator(msg) โดยถ้า msg.strip().upper() == 'ON' ให้พิมพ์ 1, ถ้าเป็น 'OFF' ให้พิมพ์ 0, กรณีอื่นทั้งหมดให้พิมพ์ INVALID",
          starterCode: `def decide_actuator(msg):\n    clean = msg.strip().upper()\n    if clean == "ON":\n        return "1"\n    elif clean == "OFF":\n        return "0"\n    return "INVALID"\n\ncmd = input()\nprint(decide_actuator(cmd))\n`,
          hints: [
            "ใช้ .strip().upper() เผื่อมีช่องว่างหรือตัวพิมพ์เล็กส่งเข้ามา",
            "กรณีที่ไม่ใช่ ON และ OFF ต้องตอบ INVALID เพื่อความปลอดภัยของฮาร์ดแวร์",
          ],
          testCases: [
            { label: "สั่งเปิด", stdin: ["ON"], expectedOutput: "1" },
            { label: "สั่งปิด", stdin: ["off"], expectedOutput: "0" },
            { label: "คำสั่งแปลกปลอม", stdin: ["RESTART_220V"], expectedOutput: "INVALID" },
          ],
          coinReward: 25,
          xpReward: 40,
        },
      },
    ],
  },

  // =========================================================================
  // หน่วยที่ 5: Sprint 2 — พัฒนาเว็บแอปพลิเคชันควบคุม IoT
  // =========================================================================
  {
    key: "v23202-u5",
    courseCode: "ว23202",
    gradeLevel: 3,
    unitNo: 5,
    title: "หน่วยที่ 5: Sprint 2 — Web App ควบคุม IoT ด้วย WebSocket & MQTT.js",
    subtitle: "WebSocket (port 9001) vs HTTP, HTML+CSS+DOM, การเชื่อมต่อ MQTT.js และกฎ Case-Sensitivity",
    durationMin: 25,
    iconBg: "purple",
    blueprintSlides: makeBlueprintSlides("unit-05", 15),
    resources: [
      { label: "ใบความรู้ หน่วยที่ 5 (.docx)", kind: "knowledge", href: "/courses/v23202/sheets/unit-05-knowledge.docx" },
      { label: "ใบงาน หน่วยที่ 5 (.docx)", kind: "worksheet", href: "/courses/v23202/sheets/unit-05-worksheet.docx" },
    ],
    slides: [
      {
        id: "u5-s1",
        kind: "concept",
        title: "ทำไมเบราว์เซอร์ต้องคุยกับ Broker ผ่าน WebSocket พอร์ต 9001?",
        subtitle: "โครงสร้าง HTML (id) + CSS (UI) + JS (MQTT.js & DOM)",
        imageUrl: "/courses/v23202/slides/unit-05/slide-04.webp",
        imageCaption: "การสื่อสารแบบ WebSocket สองทางระหว่างหน้าเว็บกับ Mosquitto",
        body: [
          "เบราว์เซอร์เปิด TCP socket ตรงไปยังพอร์ต 1883 ไม่ได้ จึงต้องใช้ MQTT over WebSocket (ws://192.168.1.100:9001) ซึ่งเปิดท่อสื่อสารสองทางค้างไว้รับค่าทันทีโดยไม่ต้อง Polling",
          "ใน JavaScript ใช้ document.getElementById('temp').textContent = payload.toString() และต้องสุ่ม clientId ต่อท้ายเพื่อไม่ให้เปิด 2 แท็บแล้วเตะกันหลุด!",
        ],
        codeSnippet: `const client = mqtt.connect("ws://192.168.1.100:9001", {\n  clientId: "web-team1-" + Math.random().toString(16).slice(2)\n});\nclient.on("message", (topic, payload) => {\n  if (topic === "class/team1/room/temperature") {\n    document.getElementById("temp").textContent = payload.toString();\n  }\n});`,
      },
      {
        id: "u5-s2",
        kind: "visualizer",
        title: "Debug อาการผิดพลาดระหว่าง Web App ↔ Broker ↔ Pico W",
        subtitle: "จับผิดอาการยอดนิยมจากตารางแก้ปัญหาหน่วยที่ 5",
        body: [
          "ลองจำลองปัญหา 'mqtt is not defined', 'ค้างที่กำลังเชื่อมต่อ (ผิดพอร์ต 1883 vs 9001)', และ 'ส่ง \"on\" แต่บอร์ดรอ \"ON\"' ในแผนภาพสื่อสาร",
        ],
        visualizerType: "testing-triage",
      },
      {
        id: "u5-s3",
        kind: "quiz",
        title: "เช็กความเข้าใจ: แก้บั๊ก Web App IoT ยอดนิยม",
        subtitle: "อ้างอิงจากหัวข้อปัญหาที่พบบ่อยในใบความรู้หน่วยที่ 5",
        body: ["เลือกวิธีแก้ปัญหาที่ถูกต้องตามหลัก MQTT.js บนเบราว์เซอร์"],
        quiz: {
          checkKey: "u5-q1",
          question: "เมื่อนักเรียนเปิดหน้าเว็บควบคุมไฟพร้อมกัน 2 แท็บ แล้วพบว่าแท็บหนึ่งหลุดการเชื่อมต่อสลับไปมาไม่หยุด สาเหตุคืออะไร?",
          options: [
            "ตั้งค่า clientId เป็นชื่อคงที่เหมือนกันทั้งสองแท็บ จึงต้องสุ่มเลขต่อท้าย clientId ทุกครั้ง",
            "ลืมใส่ <link rel='stylesheet'> ก่อนแท็ก <script>",
            "ส่งค่า payload ด้วยเมธอด JSON.stringify แทน JSON.parse",
            "เบราว์เซอร์รองรับเฉพาะโปรโตคอล http:// เท่านั้น ไม่รองรับ ws://",
          ],
          correctIndex: 0,
          explanation: "MQTT Broker จะไม่อนุญาตให้ client 2 ตัวใช้ clientId เดียวกันพร้อมกัน หากเปิดแท็บใหม่ด้วย clientId เดิม แท็บเก่าจะถูกตัดการเชื่อมต่อทันที",
          coinReward: 15,
        },
      },
      {
        id: "u5-s4",
        kind: "mission",
        title: "ภารกิจโค้ด: แปลงข้อมูล JSON Payload ของเซนเซอร์",
        subtitle: "จำลองการแยกค่าอุณหภูมิและความชื้นเพื่อนำไปแสดงผลบนหน้าเว็บ",
        body: ["อ่านข้อความรูปแบบ 'temp=28.5,humid=62.0' แล้วจัดรูปแบบแสดงผลให้หน้า Dashboard"],
        mission: {
          checkKey: "u5-m1",
          filename: "format_telemetry.py",
          prompt: "รับค่าบรรทัดเดียวเช่น '28.5 62.0' (อุณหภูมิ และ ความชื้น คั่นด้วยช่องว่าง) ถ้าอุณหภูมิ >= 30.0 ให้พิมพ์ TEMP=28.5C HUMID=62.0% STATUS=HOT มิฉะนั้นพิมพ์ STATUS=NORMAL ต่อท้าย",
          starterCode: `parts = input().split()\nt = float(parts[0])\nh = float(parts[1])\nstatus = "HOT" if t >= 30.0 else "NORMAL"\nprint(f"TEMP={t:.1f}C HUMID={h:.1f}% STATUS={status}")\n`,
          hints: [
            "ใช้ input().split() เพื่อแยกตัวเลข 2 ตัวแล้วแปลงด้วย float()",
            "จัดรูปแบบทศนิยม 1 ตำแหน่งด้วย f\"{t:.1f}\"",
          ],
          testCases: [
            { label: "อุณหภูมิปกติ", stdin: ["27.5 60.0"], expectedOutput: "TEMP=27.5C HUMID=60.0% STATUS=NORMAL" },
            { label: "อากาศร้อน", stdin: ["32.4 55.2"], expectedOutput: "TEMP=32.4C HUMID=55.2% STATUS=HOT" },
          ],
          coinReward: 25,
          xpReward: 40,
        },
      },
    ],
  },

  // =========================================================================
  // หน่วยที่ 6: การทดสอบซอฟต์แวร์
  // =========================================================================
  {
    key: "v23202-u6",
    courseCode: "ว23202",
    gradeLevel: 3,
    unitNo: 6,
    title: "หน่วยที่ 6: การทดสอบซอฟต์แวร์ & Bug Tracking",
    subtitle: "Unit vs Integration vs E2E, Test Case, Edge Case Testing และ Severity vs Priority",
    durationMin: 20,
    iconBg: "emerald",
    blueprintSlides: makeBlueprintSlides("unit-06", 15),
    resources: [
      { label: "ใบความรู้ หน่วยที่ 6 (.docx)", kind: "knowledge", href: "/courses/v23202/sheets/unit-06-knowledge.docx" },
      { label: "ใบงาน หน่วยที่ 6 (.docx)", kind: "worksheet", href: "/courses/v23202/sheets/unit-06-worksheet.docx" },
    ],
    slides: [
      {
        id: "u6-s1",
        kind: "concept",
        title: "รันได้ ≠ ไม่มีบั๊ก: Test Case, Edge Case & Bug Tracking",
        subtitle: "ทดสอบครบทั้ง Happy Path และกรณีผิดปกติ (Edge Case)",
        imageUrl: "/courses/v23202/slides/unit-06/slide-05.webp",
        imageCaption: "ระดับการทดสอบ: Unit Testing -> Integration Testing -> End-to-End (E2E)",
        body: [
          "Test Case ที่ดีต้องระบุ Input และ Expected Result ไว้ล่วงหน้าก่อนทดสอบจริง แล้วจึงบันทึก Actual Result เพื่อเทียบว่า PASS หรือ FAIL",
          "ระบบ IoT ต้องทดสอบ Edge Case ด้วย เช่น เซนเซอร์หลุด/เสีย, Wi-Fi ขาดชั่วคราว, ค่าผิดช่วงปกติ — และจัดลำดับการแก้บั๊กด้วย 2 มิติคือ Severity (ความรุนแรง) กับ Priority (ความเร่งด่วน)",
        ],
      },
      {
        id: "u6-s2",
        kind: "visualizer",
        title: "ห้องทดลองจำลองบั๊ก End-to-End & จัดลำดับ Severity/Priority",
        subtitle: "คลิกเลือกจุดเกิดบั๊กในสายพาน Pico W → Broker → Web App เพื่อฝึกวิเคราะห์",
        body: [
          "ทดลองฉีดเหตุการณ์ผิดปกติในแต่ละจุดของสถาปัตยกรรมเพื่อสังเกตผลกระทบและแนวทางแก้ไขที่ถูกต้อง",
        ],
        visualizerType: "testing-triage",
      },
      {
        id: "u6-s3",
        kind: "quiz",
        title: "เช็กความเข้าใจ: จริงหรือเท็จในการทดสอบซอฟต์แวร์",
        subtitle: "จากใบงานส่วนที่ 1.2 หน่วยที่ 6",
        body: ["ข้อใดกล่าว **ถูกต้อง** ตามหลักวิศวกรรมซอฟต์แวร์?"],
        quiz: {
          checkKey: "u6-q1",
          question: "ข้อใดกล่าวถูกต้องเกี่ยวกับการทดสอบซอฟต์แวร์และการจัดลำดับความสำคัญของบั๊ก?",
          options: [
            "Test Case ที่ดีต้องกำหนด Input และ Expected Result ไว้ล่วงหน้าก่อนลงมือทดสอบจริงเสมอ",
            "Integration Testing ควรทำก่อน Unit Testing เสมอ",
            "บั๊กที่มี Severity สูง จะต้องมี Priority สูงเสมอโดยไม่มีข้อยกเว้น",
            "การทดสอบกรณีผิดปกติ (Edge Case) ไม่จำเป็น หากรันแบบปกติผ่านแล้ว",
          ],
          correctIndex: 0,
          explanation: "เราต้องตั้ง Expected Result ไว้ก่อนทดสอบจริงเพื่อไม่ให้เข้าข้างตัวเอง ส่วนบั๊กที่เกิดเฉพาะขอบเขตหายากอาจมี Severity สูงแต่ Priority ปกติได้ตามบริบทกำหนดส่ง",
          coinReward: 15,
        },
      },
      {
        id: "u6-s4",
        kind: "mission",
        title: "ภารกิจโค้ด: ตัวประเมินผล Test Case อัตโนมัติ",
        subtitle: "เขียนสคริปต์ตรวจ Expected Result vs Actual Result พร้อมตรวจ Edge Case",
        body: ["รับค่า expected และ actual แล้วสรุปผล PASS หรือ FAIL"],
        mission: {
          checkKey: "u6-m1",
          filename: "test_runner.py",
          prompt: "รับ 2 บรรทัด: บรรทัดแรกเป็น Expected Result, บรรทัดที่สองเป็น Actual Result ถ้าตรงกัน (หลัง .strip()) ให้พิมพ์ PASS มิฉะนั้นพิมพ์ FAIL",
          starterCode: `expected = input().strip()\nactual = input().strip()\nif expected == actual:\n    print("PASS")\nelse:\n    print("FAIL")\n`,
          hints: ["อย่าลืม .strip() เพื่อตัดเว้นวรรคส่วนเกินก่อนเทียบค่า"],
          testCases: [
            { label: "ตรงตามคาด", stdin: ["ON", "ON"], expectedOutput: "PASS" },
            { label: "Case ไม่ตรง", stdin: ["ON", "on"], expectedOutput: "FAIL" },
          ],
          coinReward: 20,
          xpReward: 30,
        },
      },
    ],
  },

  // =========================================================================
  // หน่วยที่ 7: การส่งมอบและการดูแลรักษา
  // =========================================================================
  {
    key: "v23202-u7",
    courseCode: "ว23202",
    gradeLevel: 3,
    unitNo: 7,
    title: "หน่วยที่ 7: Deployment, User Manual & Maintenance",
    subtitle: "ตั้งค่าทำงานอัตโนมัติ (main.py), คู่มือผู้ใช้งาน, การรับ Feedback และ Change Request",
    durationMin: 15,
    iconBg: "amber",
    blueprintSlides: makeBlueprintSlides("unit-07", 15),
    resources: [
      { label: "ใบความรู้ หน่วยที่ 7 (.docx)", kind: "knowledge", href: "/courses/v23202/sheets/unit-07-knowledge.docx" },
      { label: "ใบงาน หน่วยที่ 7 (.docx)", kind: "worksheet", href: "/courses/v23202/sheets/unit-07-worksheet.docx" },
    ],
    slides: [
      {
        id: "u7-s1",
        kind: "concept",
        title: "ส่งมอบให้ผู้ใช้จริง + รับ Feedback เพื่อพัฒนาต่อ",
        subtitle: "Deployment Checklist, คู่มือผู้ใช้งาน และ Change Request",
        imageUrl: "/courses/v23202/slides/unit-07/slide-04.webp",
        imageCaption: "วงจร Deployment -> User Manual -> Feedback -> Change Request",
        body: [
          "ระบบที่พร้อม Deploy ต้องรันอัตโนมัติเมื่อเปิดไฟ (เช่น บันทึกไฟล์เป็น main.py บน Pico W ไม่ต้องกดปุ่ม Run ใน Thonny) มีระบบต่อ Wi-Fi ใหม่อัตโนมัติ และมี User Manual / README สำหรับผู้ใช้ทั่วไปที่ไม่ได้เรียนเขียนโค้ด",
          "เมื่อให้เพื่อน/ครูทดลองใช้งานจริง ให้รวบรวม Feedback แล้วคัดกรองเป็น Change Request โดยประเมินผลกระทบกับเวลาที่เหลือก่อนนำเข้าซ่อมบำรุง (Maintenance)",
        ],
        callout: "ห้ามมอง Feedback จากผู้ใช้ว่าเป็นการจับผิด แต่เป็นข้อมูลมีค่าที่ช่วยให้ระบบของทีมใช้งานได้จริงมากขึ้น",
      },
      {
        id: "u7-s2",
        kind: "visualizer",
        title: "Checklist ตรวจความเสถียรของระบบ IoT ก่อนส่งมอบ",
        subtitle: "จำลองสถานการณ์หลังส่งมอบ (Wi-Fi หลุด, เปลี่ยน IP Broker, ปุ่มกดไม่ตอบสนอง)",
        body: ["สำรวจความพร้อมของระบบทั้ง 3 จุดในสายพานก่อนปล่อยให้ 'ลูกค้าจริง' ทดลองใช้งานในหน่วยที่ 7"],
        visualizerType: "testing-triage",
      },
      {
        id: "u7-s3",
        kind: "quiz",
        title: "เช็กความเข้าใจ: การเตรียม Deployment บน Pico W",
        subtitle: "ขั้นตอนสำคัญเพื่อให้บอร์ดทำงานทันทีเมื่อเสียบปลั๊ก 5V",
        body: ["เลือกคำตอบที่ถูกต้องเกี่ยวกับการเตรียมระบบเพื่อส่งมอบ"],
        quiz: {
          checkKey: "u7-q1",
          question: "เหตุใดเมื่อทดสอบโค้ด MicroPython ใน Thonny IDE เสร็จแล้ว จึงต้องบันทึกไฟล์ลงบน Pico W ด้วยชื่อ `main.py`?",
          options: [
            "เพื่อให้ Pico W รันโปรแกรมนี้เองโดยอัตโนมัติทุกครั้งที่เสียบไฟเลี้ยง โดยไม่ต้องเชื่อมต่อ Thonny",
            "เพราะ MicroPython ไม่อนุญาตให้มีตัวแปรเกิน 10 ตัวในไฟล์ชื่ออื่น",
            "เพื่อแปลงไฟล์ภาษา MicroPython ให้กลายเป็นหน้าเว็บ HTML อัตโนมัติ",
            "เพื่อลบโค้ดการตั้งค่า Wi-Fi เดิมออกจากหน่วยความจำทั้งหมด",
          ],
          correctIndex: 0,
          explanation: "Pico W จะค้นหาและรันไฟล์ชื่อ boot.py และ main.py อัตโนมัติเมื่อจ่ายไฟ 5V ทำให้สามารถนำไปใช้งานจริงนอกเครื่องคอมพิวเตอร์ได้",
          coinReward: 15,
        },
      },
      {
        id: "u7-s4",
        kind: "mission",
        title: "ภารกิจโค้ด: ประเมินคำขอแก้ไขระบบ (Change Request)",
        subtitle: "คัดกรอง Change Request ว่าสามารถทำทันในรอบส่งมอบหรือต้องเลื่อนไปเวอร์ชันถัดไป",
        body: ["คำนวณว่าชั่วโมงงานที่ประเมินของ Change Request เกินโควตาเวลาที่เหลือของทีมหรือไม่"],
        mission: {
          checkKey: "u7-m1",
          filename: "change_request.py",
          prompt: "รับเวลาที่ทีมเหลือ (remain_hrs) และเวลาที่ต้องใช้แก้ CR (cost_hrs) เป็นจำนวนเต็ม 2 บรรทัด ถ้า cost_hrs <= remain_hrs พิมพ์ ACCEPT_IN_SPRINT มิฉะนั้นพิมพ์ DEFER_NEXT_VERSION",
          starterCode: `remain_hrs = int(input().strip())\ncost_hrs = int(input().strip())\nif cost_hrs <= remain_hrs:\n    print("ACCEPT_IN_SPRINT")\nelse:\n    print("DEFER_NEXT_VERSION")\n`,
          hints: ["เปรียบเทียบ cost_hrs <= remain_hrs เพื่อจัดสมดุลขอบเขตงาน"],
          testCases: [
            { label: "ทำทันในเวลา", stdin: ["4", "3"], expectedOutput: "ACCEPT_IN_SPRINT" },
            { label: "เกินเวลาที่เหลือ", stdin: ["2", "6"], expectedOutput: "DEFER_NEXT_VERSION" },
          ],
          coinReward: 20,
          xpReward: 30,
        },
      },
    ],
  },

  // =========================================================================
  // หน่วยที่ 8: สรุปและนำเสนอผลงาน
  // =========================================================================
  {
    key: "v23202-u8",
    courseCode: "ว23202",
    gradeLevel: 3,
    unitNo: 8,
    title: "หน่วยที่ 8: Demo Day, STAR Storytelling & Portfolio",
    subtitle: "เทคนิคเล่าเรื่อง STAR, ลำดับนำเสนอ 6 ขั้น, วิดีโอสำรอง, Retrospective และ Peer Evaluation",
    durationMin: 15,
    iconBg: "purple",
    blueprintSlides: makeBlueprintSlides("unit-08", 15),
    resources: [
      { label: "ใบความรู้ หน่วยที่ 8 (.docx)", kind: "knowledge", href: "/courses/v23202/sheets/unit-08-knowledge.docx" },
      { label: "ใบงาน หน่วยที่ 8 (.docx)", kind: "worksheet", href: "/courses/v23202/sheets/unit-08-worksheet.docx" },
    ],
    slides: [
      {
        id: "u8-s1",
        kind: "concept",
        title: "Demo Day: เล่าเรื่องแบบ STAR & แผนสำรองมืออาชีพ",
        subtitle: "Situation -> Task -> Action -> Result พร้อมการสาธิตสด (Live Demo)",
        imageUrl: "/courses/v23202/slides/unit-08/slide-05.webp",
        imageCaption: "โครงสร้าง STAR และลำดับ Demo Day (Hook -> Problem -> Solution -> Live Demo -> Result -> Q&A)",
        body: [
          "การนำเสนอที่ดีไม่ได้อ่านสไลด์ทีละบรรทัด แต่เล่าเรื่องให้ผู้ฟังเป็น 'พระเอก' ด้วยกรอบ STAR: Situation (ปัญหาจริง) → Task (เป้าหมาย) → Action (สถาปัตยกรรมและโค้ดที่พัฒนา) → Result (ผลลัพธ์และข้อจำกัด)",
          "ทีมมืออาชีพต้องอัดวิดีโอสาธิตระบบสำรองไว้เสมอ เผื่อ Wi-Fi หรืออุปกรณ์ขัดข้องระหว่าง Demo Day รวมถึงทำ Sprint Retrospective รวบยอดและ Peer Evaluation อย่างเป็นธรรม",
        ],
      },
      {
        id: "u8-s2",
        kind: "concept",
        title: "เส้นทาง 18 สัปดาห์สู่วิศวกรซอฟต์แวร์ตัวจริง",
        subtitle: "สรุปผลงานทั้ง 8 ชิ้นงานตลอดภาคเรียน",
        imageUrl: "/courses/v23202/slides/unit-08/slide-13.webp",
        imageCaption: "ทบทวนเส้นทาง SDLC + Agile Sprint 0–2 ครบวงจร",
        body: [
          "1) Requirements & Product Backlog (10%) → 2) System Design & MQTT Topic (10%) → 3) Edge Device Prototype (15%) → 4) Web Application (15%)",
          "5) Test Case & Bug Report (10%) → 6) Deployment & Maintenance Log (10%) → 7) Demo Day (15%) → 8) Portfolio & Peer Evaluation (5%) + กระบวนการ Agile (10%)",
        ],
      },
      {
        id: "u8-s3",
        kind: "quiz",
        title: "เช็กความเข้าใจ: โครงสร้างการนำเสนอ STAR",
        subtitle: "องค์ประกอบใดอธิบายสถาปัตยกรรมและการลงมือแก้บั๊กของทีม?",
        body: ["เลือกคำตอบที่ตรงกับความหมายของกรอบเล่าเรื่อง STAR"],
        quiz: {
          checkKey: "u8-q1",
          question: "ในการนำเสนอแบบ STAR ส่วนใดใช้เล่าถึงสถาปัตยกรรม Edge–Broker–Web และวิธีการพัฒนาโค้ดที่ทีมลงมือทำ?",
          options: [
            "Action — การลงมือทำและการแก้ปัญหาทางเทคนิคของทีม",
            "Situation — ปัญหาและบริบทเริ่มต้นที่ผู้ใช้พบ",
            "Task — เป้าหมายหรือภารกิจที่ทีมต้องการแก้ไข",
            "Peer Evaluation — การให้คะแนนการทำงานของสมาชิกในทีม",
          ],
          correctIndex: 0,
          explanation: "S = สถานการณ์/ปัญหา, T = เป้าหมายที่ตั้งไว้, A (Action) = ขั้นตอนและเทคโนโลยีที่ทีมลงมือสร้างจริง, R = ผลลัพธ์และบทเรียนที่ได้รับ",
          coinReward: 15,
        },
      },
      {
        id: "u8-s4",
        kind: "mission",
        title: "ภารกิจโค้ด: คำนวณคะแนนประเมินรวมรายวิชา (100%)",
        subtitle: "รวมคะแนน 8 ชิ้นงาน + Agile Practice ตามโครงร่างหลักสูตร ว23202",
        body: ["คำนวณคะแนนรวมและสรุประดับผลการเรียนจากรายการคะแนนส่งเข้าฟังก์ชัน"],
        mission: {
          checkKey: "u8-m1",
          filename: "final_grade.py",
          prompt: "รับรายการคะแนนเต็ม 100 จาก 9 ส่วนคั่นด้วยเว้นวรรค (1 บรรทัด) แล้วพิมพ์ผลรวมและสถานะ PASS (>= 50) หรือ IMPROVE เช่น 'TOTAL=85 PASS'",
          starterCode: `scores = [int(x) for x in input().split()]\ntotal = sum(scores)\nstatus = "PASS" if total >= 50 else "IMPROVE"\nprint(f"TOTAL={total} {status}")\n`,
          hints: ["ใช้ sum(scores) เพื่อหาผลรวมคะแนนทั้ง 9 องค์ประกอบ"],
          testCases: [
            { label: "คะแนนครบเกณฑ์ดีเยี่ยม", stdin: ["9 9 14 14 9 9 14 5 9"], expectedOutput: "TOTAL=92 PASS" },
            { label: "คะแนนไม่ถึงเกณฑ์", stdin: ["5 4 8 7 4 4 8 3 5"], expectedOutput: "TOTAL=48 IMPROVE" },
          ],
          coinReward: 25,
          xpReward: 40,
        },
      },
    ],
  },
];
