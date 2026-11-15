import type { ChallengeClientView } from "@/core/modules/contract";
import {
  buildOrderClassifyDemoChallenges,
  type ClassifyChallengeConfig,
  type OrderChallengeConfig,
  type OrderClassifyChallengeConfig,
  type OrderClassifySeedItem,
} from "@/core/grading/order-classify";

export type IotOrderChallengeConfig = OrderChallengeConfig;
export type IotClassifyChallengeConfig = ClassifyChallengeConfig;
export type IotSeChallengeConfig = OrderClassifyChallengeConfig;
export type IotSeChallengeSeedItem = OrderClassifySeedItem;

export const IOT_SE_DEMO_CHALLENGES: IotSeChallengeSeedItem[] = [
  {
    challengeKey: "u0-sdlc-pubsub",
    title: "UNIT 0: วงจร SDLC & สถาปัตยกรรม Pub/Sub",
    orderIndex: 1,
    difficulty: "easy",
    maxScore: 10,
    xpReward: 40,
    config: {
      mode: "order",
      unitCode: "UNIT 0",
      story:
        "ก่อนสร้างระบบควบคุมอุปกรณ์ IoT ในห้องเรียน ทีมวิศวกรต้องเรียงลำดับวงจรชีวิตการพัฒนาซอฟต์แวร์ (SDLC) จากขั้นแรกไปจนถึงการดูแลรักษาให้ถูกต้อง",
      blocks: [
        { id: "req", text: "1. วิเคราะห์ความต้องการผู้ใช้ (Requirements)" },
        { id: "design", text: "2. ออกแบบสถาปัตยกรรมและ Topic (System Design)" },
        { id: "impl", text: "3. พัฒนา Edge Pico W และ Web App (Implementation)" },
        { id: "test", text: "4. ทดสอบ Unit, Integration และ UAT (Testing)" },
        { id: "deploy", text: "5. ส่งมอบและบำรุงรักษา (Deployment & Maintenance)" },
      ],
      hints: [
        "ต้องเข้าใจปัญหาและความต้องการของผู้ใช้ก่อนเริ่มออกแบบระบบเสมอ",
        "หลังออกแบบสถาปัตยกรรมเสร็จ จึงลงมือเขียนโค้ด (Implementation) แล้วทดสอบก่อนส่งมอบ",
        "ลำดับที่ถูกต้องคือ req -> design -> impl -> test -> deploy",
      ],
      microQuestion: {
        prompt: "ในรูปแบบ Pub/Sub ของ MQTT อุปกรณ์ตัวกลางใดทำหน้าที่กระจายข้อความโดยที่ Publisher ไม่ต้องรู้จัก IP ของ Subscriber?",
        options: ["MQTT Broker", "HTML Canvas", "USB Cable"],
      },
    },
    solutionCheck: {
      mode: "order",
      correctOrder: ["req", "design", "impl", "test", "deploy"],
      microCorrectOption: "MQTT Broker",
    },
  },
  {
    challengeKey: "u1-moscow-triage",
    title: "UNIT 1: คัดกรอง Product Backlog ด้วย MoSCoW",
    orderIndex: 2,
    difficulty: "easy",
    maxScore: 10,
    xpReward: 45,
    config: {
      mode: "classify",
      unitCode: "UNIT 1",
      story:
        "ทีม Smart Greenhouse ได้รายการฟีเจอร์จากผู้ใช้งาน จงจัดกลุ่มแต่ละฟีเจอร์ลงในหมวด MoSCoW เพื่อกำหนดขอบเขต MVP รอบแรกให้ส่งมอบได้ทันเวลา",
      categories: [
        { id: "M", label: "Must Have (ต้องมีใน MVP)", badgeCls: "bg-rose-100 text-rose-800 border-rose-200" },
        { id: "S", label: "Should Have (ควรมีถ้าเวลาพอ)", badgeCls: "bg-amber-100 text-amber-800 border-amber-200" },
        { id: "C", label: "Could Have (ไม่มีก็ใช้ได้)", badgeCls: "bg-sky-100 text-sky-800 border-sky-200" },
        { id: "W", label: "Won't Have (ตัดออกรอบนี้)", badgeCls: "bg-slate-100 text-slate-700 border-slate-200" },
      ],
      items: [
        { id: "f1", text: "ส่งค่าความชื้นดินและปุ่มสั่งรดน้ำผ่าน MQTT" },
        { id: "f2", text: "แสดงกราฟสถิติความชื้นย้อนหลัง 7 วัน" },
        { id: "f3", text: "ปุ่มสลับธีม Dark Mode / Light Mode" },
        { id: "f4", text: "ระบบสั่งงานด้วยเสียง AI หลายภาษา" },
      ],
      hints: [
        "Must Have คือแก่นของระบบ ถ้าขาดไประบบ Smart Greenhouse ใช้งานไม่ได้เลย",
        "กราฟย้อนหลังมีประโยชน์แต่ไม่ใช่แกนสั่งงานทันที (Should), ส่วนสีธีมเป็นแค่ลูกเล่นสวยงาม (Could)",
        "AI หลายภาษาซับซ้อนเกินความจุของ Sprint แรก ควรจัดเป็น Won't Have รอบนี้",
      ],
      microQuestion: {
        prompt: "โครงสร้าง User Story มาตรฐาน (Connextra Template) ประกอบด้วยส่วนใดบ้าง?",
        options: [
          "As a [บทบาท], I want [สิ่งที่ต้องการ], So that [ประโยชน์ที่ได้รับ]",
          "Start IP, Port Number, Cable Length",
          "SELECT *, FROM sensor, WHERE id = 1",
        ],
      },
    },
    solutionCheck: {
      mode: "classify",
      correctMap: { f1: "M", f2: "S", f3: "C", f4: "W" },
      microCorrectOption: "As a [บทบาท], I want [สิ่งที่ต้องการ], So that [ประโยชน์ที่ได้รับ]",
    },
  },
  {
    challengeKey: "u2-edge-broker-web",
    title: "UNIT 2: เส้นทางข้อมูล Edge – Broker – Web App",
    orderIndex: 3,
    difficulty: "medium",
    maxScore: 10,
    xpReward: 50,
    config: {
      mode: "order",
      unitCode: "UNIT 2",
      story:
        "จงเรียงลำดับการเดินทางของข้อมูลอุณหภูมิจากเซนเซอร์ห้องเรียนไปจนถึงหน้าจอ Web Dashboard ให้ถูกต้องตามสถาปัตยกรรม 3 ชั้น",
      blocks: [
        { id: "edge-read", text: "1. เซนเซอร์ DHT22 ส่งสัญญาณเข้าขา GPIO ของ Pico W" },
        { id: "edge-pub", text: "2. Pico W ส่ง Packet (Publish) ผ่าน TCP Port 1883" },
        { id: "broker", text: "3. Mosquitto Broker (Pi 5) ตรวจสอบ Topic และส่งต่อ" },
        { id: "ws", text: "4. Web App รับข้อมูลแบบ Real-time ผ่าน WebSocket Port 9001" },
        { id: "dom", text: "5. JavaScript อัปเดตตัวเลขบน DOM หน้าเบราว์เซอร์" },
      ],
      hints: [
        "ข้อมูลเริ่มต้นจากฮาร์ดแวร์ฝั่ง Edge Device (Pico W) เสมอ",
        "Pico W สื่อสารกับ Broker ด้วย TCP 1883 ส่วน Web Browser สื่อสารผ่าน WebSocket 9001",
        "ลำดับที่ถูกต้องคือ edge-read -> edge-pub -> broker -> ws -> dom",
      ],
      microQuestion: {
        prompt: "เหตุใดในการออกแบบ Topic Hierarchy จึงควรใช้ชื่อสั้น ชัดเจน เป็นตัวพิมพ์เล็กทั้งหมด เช่น school/room1/temp?",
        options: [
          "อ่านง่าย เป็นระบบ ลดโอกาสพิมพ์ผิดและทำ Wildcard Subscription ได้แม่นยำ",
          "เพื่อบังคับให้เซนเซอร์วัดค่าได้เฉพาะตอนกลางวัน",
          "เพราะโปรโตคอล TCP ไม่อนุญาตให้มีตัวเลขในรหัสโค้ด",
        ],
      },
    },
    solutionCheck: {
      mode: "order",
      correctOrder: ["edge-read", "edge-pub", "broker", "ws", "dom"],
      microCorrectOption: "อ่านง่าย เป็นระบบ ลดโอกาสพิมพ์ผิดและทำ Wildcard Subscription ได้แม่นยำ",
    },
  },
  {
    challengeKey: "u3-sprint0-env",
    title: "UNIT 3: เตรียมสภาพแวดล้อม Sprint 0 (Hello MQTT)",
    orderIndex: 4,
    difficulty: "easy",
    maxScore: 10,
    xpReward: 45,
    config: {
      mode: "order",
      unitCode: "UNIT 3",
      story:
        "ก่อนเข้าสู่ Sprint 1 เราต้องติดตั้งและทดสอบเชื่อมต่อเครือข่ายให้สำเร็จ จงเรียงลำดับขั้นตอนเตรียม Sprint 0 เพื่อพิสูจน์ว่า 'Hello MQTT' ทำงานได้จริง",
      blocks: [
        { id: "mosq", text: "1. ตั้งค่า Mosquitto บน Raspberry Pi 5 เปิด Port 1883 และ 9001" },
        { id: "wifi", text: "2. เขียน MicroPython เชื่อมต่อ Wi-Fi คลื่น 2.4GHz บน Pico W" },
        { id: "conn", text: "3. เชื่อมต่อ client.connect() ไปยัง IP ของ MQTT Broker" },
        { id: "ping", text: "4. ทดสอบ Publish ข้อความ 'Hello MQTT' แล้วเห็นผลฝั่งรับ" },
      ],
      hints: [
        "Broker ต้องถูกเปิดรอรับการเชื่อมต่อก่อนที่บอร์ด Edge จะเชื่อมต่อเข้ามาได้",
        "Pico W ต้องจับ Wi-Fi ให้ได้ IP Address เสียก่อนจึงจะเรียก client.connect() ได้",
        "ลำดับที่ถูกต้องคือ mosq -> wifi -> conn -> ping",
      ],
      microQuestion: {
        prompt: "ข้อใดคือข้อจำกัดสำคัญของการเชื่อมต่อ Wi-Fi บนบอร์ด Raspberry Pi Pico W?",
        options: [
          "รองรับเฉพาะคลื่น 2.4GHz (ไม่รองรับ 5GHz)",
          "ใช้ได้เฉพาะสาย LAN ไม่สามารถเชื่อม Wi-Fi ได้",
          "ต้องต่อกับจอ HDMI 4K ก่อนจึงจะเปิด Wi-Fi ได้",
        ],
      },
    },
    solutionCheck: {
      mode: "order",
      correctOrder: ["mosq", "wifi", "conn", "ping"],
      microCorrectOption: "รองรับเฉพาะคลื่น 2.4GHz (ไม่รองรับ 5GHz)",
    },
  },
  {
    challengeKey: "u4-pico-edge-flow",
    title: "UNIT 4: วงจรควบคุม Edge Device & Callback",
    orderIndex: 5,
    difficulty: "medium",
    maxScore: 10,
    xpReward: 55,
    config: {
      mode: "order",
      unitCode: "UNIT 4",
      story:
        "ใน Sprint 1 เฟิร์มแวร์บน Pico W ต้องทั้งอ่านค่าเซนเซอร์และรอรับคำสั่งจากเว็บแอปโดยไม่ค้าง จงเรียงลำดับการทำงานใน Main Loop ของ Edge Device",
      blocks: [
        { id: "check", text: "1. เรียก client.check_msg() เพื่อตรวจคำสั่งที่ส่งเข้ามาแบบ Non-blocking" },
        { id: "callback", text: "2. เมื่อมีคำสั่งตรง Topic ฟังก์ชัน Callback สั่งเปิด/ปิด Relay หรือ LED" },
        { id: "sensor", text: "3. เมื่อครบคาบเวลาที่ตั้งไว้ ให้อ่านค่าจาก Sensor (GPIO/ADC)" },
        { id: "pub", text: "4. ส่งค่าที่อ่านได้เป็น JSON String ผ่าน client.publish()" },
        { id: "recover", text: "5. ดักจับ OSError เพื่อ Reconnect อัตโนมัติหากสัญญาณ Wi-Fi/Broker ขาด" },
      ],
      hints: [
        "ต้องหมั่นตรวจข้อความขาเข้าก่อน (check_msg) เพื่อให้ Callback ตอบสนองปุ่มกดจากแอปได้ทันใจ",
        "ใช้ try...except OSError เป็นเกราะป้องกันไม่ให้บอร์ดหยุดทำงานถาวรเมื่อเน็ตกระตุก",
        "ลำดับที่ถูกต้องคือ check -> callback -> sensor -> pub -> recover",
      ],
      microQuestion: {
        prompt: "เหตุใดจึงควรใช้การเช็กเวลา ticks_ms() แทนการใช้ time.sleep(60) ยาวๆ ในระบบที่มีการกดสั่งงานจากแอป?",
        options: [
          "เพราะ time.sleep(60) ทำให้บอร์ดหยุดนิ่งและไม่รับคำสั่ง check_msg() นานถึง 60 วินาที",
          "เพราะ ticks_ms() ช่วยลดการใช้ไฟฟ้าของหน้าจอผู้ใช้ลง 90%",
          "เพราะ MicroPython ไม่อนุญาตให้ import โมดูล time",
        ],
      },
    },
    solutionCheck: {
      mode: "order",
      correctOrder: ["check", "callback", "sensor", "pub", "recover"],
      microCorrectOption: "เพราะ time.sleep(60) ทำให้บอร์ดหยุดนิ่งและไม่รับคำสั่ง check_msg() นานถึง 60 วินาที",
    },
  },
  {
    challengeKey: "u5-websocket-dom",
    title: "UNIT 5: แยกชั้นโครงสร้าง Web App ควบคุม IoT",
    orderIndex: 6,
    difficulty: "medium",
    maxScore: 10,
    xpReward: 50,
    config: {
      mode: "classify",
      unitCode: "UNIT 5",
      story:
        "ใน Sprint 2 เราสร้างเว็บแอปควบคุมอุปกรณ์ IoT แบบแยกความรับผิดชอบ (Separation of Concerns) จงจับคู่ชิ้นส่วนโค้ดเข้ากับเทคโนโลยีหลักให้ถูกต้อง",
      categories: [
        { id: "html", label: "HTML (โครงสร้างหน้าเว็บ)", badgeCls: "bg-orange-100 text-orange-800 border-orange-200" },
        { id: "css", label: "CSS (ตกแต่ง & Responsive)", badgeCls: "bg-sky-100 text-sky-800 border-sky-200" },
        { id: "js", label: "JavaScript + MQTT.js (เชื่อมต่อ & DOM)", badgeCls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
      ],
      items: [
        { id: "w1", text: "<button id='btn-fan'>เปิดพัดลม</button> และ <span id='temp-val'>--</span>" },
        { id: "w2", text: "display: grid; grid-template-columns: repeat(2, 1fr);" },
        { id: "w3", text: "mqtt.connect('ws://broker-ip:9001') และ client.publish()" },
        { id: "w4", text: "document.getElementById('temp-val').innerText = data.temp" },
      ],
      hints: [
        "แท็ก <button> และ <span> กำหนดโครงสร้างองค์ประกอบบนหน้าเว็บ (HTML)",
        "CSS Grid/Flexbox ใช้จัดวางหน้าตาให้รองรับทั้งมือถือและคอมพิวเตอร์",
        "การต่อ MQTT WebSocket และการอัปเดต DOM ด้วย getElementById เป็นหน้าที่ของ JavaScript",
      ],
      microQuestion: {
        prompt: "เหตุใดเว็บเบราว์เซอร์จึงต้องเชื่อมต่อ MQTT Broker ผ่าน Port 9001 (WebSocket) แทนที่จะใช้ Port 1883 โดยตรง?",
        options: [
          "เบราว์เซอร์ทำงานบนมาตรฐาน HTTP/WebSocket ไม่สามารถเปิด Raw TCP Socket ตรงไปที่ 1883 ได้",
          "Port 1883 ใช้ได้เฉพาะเครื่องที่ลงระบบปฏิบัติการ Windows เท่านั้น",
          "WebSocket 9001 สามารถจ่ายไฟฟ้า 5V ไปยังหลอด LED ได้โดยตรง",
        ],
      },
    },
    solutionCheck: {
      mode: "classify",
      correctMap: { w1: "html", w2: "css", w3: "js", w4: "js" },
      microCorrectOption: "เบราว์เซอร์ทำงานบนมาตรฐาน HTTP/WebSocket ไม่สามารถเปิด Raw TCP Socket ตรงไปที่ 1883 ได้",
    },
  },
  {
    challengeKey: "u6-qa-bug-triage",
    title: "UNIT 6: คัดแยกบั๊กด้วย Severity & Priority (QA Testing)",
    orderIndex: 7,
    difficulty: "hard",
    maxScore: 10,
    xpReward: 60,
    config: {
      mode: "classify",
      unitCode: "UNIT 6",
      story:
        "ทีม QA ตรวจพบบั๊ก 3 รายการระหว่างทดสอบ Integrated IoT System จงช่วยจัดระดับความเร่งด่วน (Triage) เพื่อกำหนดลำดับการแก้ไขก่อนส่งมอบ",
      categories: [
        { id: "p0", label: "Blocker / P0 (แก้ทันที ห้ามส่งมอบ)", badgeCls: "bg-rose-100 text-rose-800 border-rose-200" },
        { id: "ui", label: "Severity ต่ำ แต่ Priority สูง (แก้ก่อน Demo)", badgeCls: "bg-amber-100 text-amber-800 border-amber-200" },
        { id: "low", label: "Minor / P3 (บันทึก Backlog แก้รอบถัดไป)", badgeCls: "bg-slate-100 text-slate-700 border-slate-200" },
      ],
      items: [
        { id: "b1", text: "กดปุ่มปิดปั๊มน้ำฉุกเฉินบนเว็บแล้ว Pico W ไม่ตัดไฟเลย" },
        { id: "b2", text: "สะกดชื่อโรงเรียนบนหัวเว็บ Demo Day ผิด แต่ระบบควบคุมทำงานครบ" },
        { id: "b3", text: "ขอบปุ่มย่อยในหน้าตั้งค่าคลาดเคลื่อนไป 2px เมื่อซูมหน้าจอ 150%" },
      ],
      hints: [
        "ความผิดพลาดที่กระทบฟังก์ชันหลักและความปลอดภัย (สั่งตัดไฟไม่ทำงาน) คือ Blocker P0",
        "คำสะกดผิดบนหัวข้อหลักไม่ทำให้ระบบพัง (Severity ต่ำ) แต่กระทบภาพลักษณ์วันส่งมอบมาก (Priority สูง)",
        "ระยะขอบ 2px ในหน้าตั้งค่าย่อยส่งผลกระทบน้อย เก็บไว้ปรับแต่งภายหลังได้",
      ],
      microQuestion: {
        prompt: "ข้อใดจัดเป็นการทดสอบ Edge Case (กรณีขอบเขต) ของระบบแจ้งเตือนอุณหภูมิที่ตั้งเกณฑ์ไว้ >= 30°C?",
        options: [
          "ทดสอบค่า 29.9°C, 30.0°C และกรณีเซนเซอร์อ่านได้ค่า None หรือ NaN",
          "ทดสอบเฉพาะตอนอุณหภูมิห้องปกติ 25°C เพียงค่าเดียว",
          "เปลี่ยนสีพื้นหลังเว็บแอปเป็นสีเขียวอย่างเดียว",
        ],
      },
    },
    solutionCheck: {
      mode: "classify",
      correctMap: { b1: "p0", b2: "ui", b3: "low" },
      microCorrectOption: "ทดสอบค่า 29.9°C, 30.0°C และกรณีเซนเซอร์อ่านได้ค่า None หรือ NaN",
    },
  },
  {
    challengeKey: "u7-deploy-maintain",
    title: "UNIT 7: การส่งมอบระบบภาคสนาม & Maintenance Log",
    orderIndex: 8,
    difficulty: "medium",
    maxScore: 10,
    xpReward: 55,
    config: {
      mode: "order",
      unitCode: "UNIT 7",
      story:
        "ถึงเวลาส่งมอบระบบ IoT จากโต๊ะทดลองสู่การใช้งานจริง (Production Deployment) จงเรียงลำดับขั้นตอน Deployment และจัดทำ Change Request ให้สมบูรณ์",
      blocks: [
        { id: "autostart", text: "1. บันทึกโค้ดเป็น main.py บน Pico W เพื่อให้รันอัตโนมัติเมื่อเสียบไฟ" },
        { id: "manual", text: "2. จัดทำ User Manual และ README (Wiring, Topic, IP Broker)" },
        { id: "uat", text: "3. ให้ผู้ใช้จริงทดลองใช้งานหน้างานและเก็บ Feedback" },
        { id: "cr", text: "4. บันทึกปัญหา/ความต้องการใหม่เป็น Change Request ใน Maintenance Log" },
      ],
      hints: [
        "อุปกรณ์ภาคสนามจะไม่มีสาย USB เสียบ Thonny จึงต้องตั้งชื่อ main.py เพื่อ Auto-boot ก่อน",
        "ส่งมอบเอกสารคู่มือก่อนให้ผู้ใช้จริงทำ UAT และรวบรวมความเห็นกลับมาเป็น Change Request",
        "ลำดับที่ถูกต้องคือ autostart -> manual -> uat -> cr",
      ],
      microQuestion: {
        prompt: "เหตุใดไฟล์โปรแกรมหลักบน Raspberry Pi Pico W จึงต้องตั้งชื่อว่า main.py เมื่อนำไปติดตั้งใช้งานจริง?",
        options: [
          "MicroPython จะรัน boot.py และ main.py อัตโนมัติทันทีที่บอร์ดได้รับไฟเลี้ยงโดยไม่ต้องใช้คอมพิวเตอร์สั่ง",
          "เพราะไฟล์ชื่ออื่นจะทำให้เซนเซอร์ DHT22 อ่านค่าได้เป็นศูนย์ตลอดเวลา",
          "เพราะ Web Browser บังคับให้ดาวน์โหลดไฟล์ main.py ก่อนเปิดหน้าเว็บ",
        ],
      },
    },
    solutionCheck: {
      mode: "order",
      correctOrder: ["autostart", "manual", "uat", "cr"],
      microCorrectOption:
        "MicroPython จะรัน boot.py และ main.py อัตโนมัติทันทีที่บอร์ดได้รับไฟเลี้ยงโดยไม่ต้องใช้คอมพิวเตอร์สั่ง",
    },
  },
  {
    challengeKey: "u8-star-demo-day",
    title: "UNIT 8: นำเสนอ Demo Day ด้วยโครงสร้าง STAR",
    orderIndex: 9,
    difficulty: "hard",
    maxScore: 10,
    xpReward: 65,
    config: {
      mode: "order",
      unitCode: "UNIT 8",
      story:
        "วัน Demo Day ทีมต้องนำเสนอผลงานภายใน 5 นาทีให้ชัดเจนและน่าประทับใจ จงเรียงลำดับการเล่าเรื่องตามโครงสร้าง STAR Storytelling",
      blocks: [
        { id: "sit", text: "1. Situation: อธิบายปัญหาจริงในห้องเรียนหรือโรงเรียนที่พบ" },
        { id: "task", text: "2. Task: ระบุเป้าหมาย ขอบเขต MVP และบทบาทของสมาชิกในทีม" },
        { id: "act", text: "3. Action: อธิบายสถาปัตยกรรม Edge–Broker–Web และสาธิตระบบสด 3 ส่วน" },
        { id: "res", text: "4. Result: สรุปผลการทดสอบ บทเรียน Sprint Retrospective และก้าวถัดไป" },
      ],
      hints: [
        "STAR ย่อมาจาก Situation -> Task -> Action -> Result",
        "เปิดเรื่องด้วยปัญหาจริงก่อน ระบุหน้าที่และเป้าหมาย แล้วค่อยลงรายละเอียดและ Live Demo",
        "ลำดับที่ถูกต้องคือ sit -> task -> act -> res",
      ],
      microQuestion: {
        prompt: "สิ่งที่วิศวกรซอฟต์แวร์มืออาชีพต้องเตรียมไว้เสมอสำหรับเหตุการณ์ไม่คาดคิดระหว่าง Live Demo (Contingency Plan) คือข้อใด?",
        options: [
          "วิดีโอบันทึกการสาธิตที่ทดสอบผ่านแล้วสำรองไว้ เผื่อ Wi-Fi หรือเครือข่ายขัดข้องกะทันหัน",
          "ปิดเครื่องเซิร์ฟเวอร์และถอดสายเซนเซอร์ออกก่อนขึ้นเวทีทั้งหมด",
          "ไม่ต้องทดสอบล่วงหน้าเพื่อให้ดูตื่นเต้นเหมือนงานแสดงสด",
        ],
      },
    },
    solutionCheck: {
      mode: "order",
      correctOrder: ["sit", "task", "act", "res"],
      microCorrectOption:
        "วิดีโอบันทึกการสาธิตที่ทดสอบผ่านแล้วสำรองไว้ เผื่อ Wi-Fi หรือเครือข่ายขัดข้องกะทันหัน",
    },
  },
];

export function buildIotSeDemoClientChallenges(seed = 2569): ChallengeClientView[] {
  return buildOrderClassifyDemoChallenges(IOT_SE_DEMO_CHALLENGES, "demo-iot-", seed);
}
