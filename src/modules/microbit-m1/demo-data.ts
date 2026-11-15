import type { ChallengeClientView } from "@/core/modules/contract";
import {
  buildOrderClassifyDemoChallenges,
  type OrderClassifySeedItem,
} from "@/core/grading/order-classify";

export const MICROBIT_M1_DEMO_CHALLENGES: OrderClassifySeedItem[] = [
  {
    challengeKey: "u01-making",
    title: "Unit 01: กระบวนการ Design Thinking สร้าง micro:pet",
    orderIndex: 1,
    difficulty: "easy",
    maxScore: 10,
    xpReward: 40,
    config: {
      mode: "order",
      unitCode: "Unit 01",
      story:
        "ก่อนประดิษฐ์สัตว์เลี้ยงดิจิทัล micro:pet ด้วยกระดาษแข็งและ micro:bit จงเรียงลำดับ 5 ขั้นตอนของ Design Thinking จากขั้นแรกไปจนถึงการปรับปรุงต้นแบบ",
      blocks: [
        { id: "interview", text: "1. สัมภาษณ์ความต้องการของเพื่อนผู้ใช้ (Empathize)" },
        { id: "define", text: "2. สรุปโจทย์ปัญหาและคุณลักษณะของสัตว์เลี้ยง (Define)" },
        { id: "ideate", text: "3. ร่างภาพแนวคิดหลากหลายอย่างน้อย 5 แบบ (Ideate)" },
        { id: "prototype", text: "4. ประดิษฐ์ต้นแบบจากวัสดุใกล้ตัวกับ micro:bit (Prototype)" },
        { id: "feedback", text: "5. ทดสอบรับฟีดแบ็กและปรับแก้ให้ดีขึ้น (Test & Refine)" },
      ],
      hints: [
        "ต้องเริ่มต้นจากการพูดคุย/สัมภาษณ์ผู้ใช้เพื่อเข้าใจปัญหาจริงก่อน",
        "หลังสรุปโจทย์แล้วจึงร่างภาพ 5 ไอเดีย แล้วลงมือสร้าง Prototype จากวัสดุจริง",
        "ลำดับที่ถูกต้องคือ interview -> define -> ideate -> prototype -> feedback",
      ],
      microQuestion: {
        prompt: "หลังเขียนโปรแกรม MakeCode เสร็จ หากต้องการนำโค้ดลงบอร์ด micro:bit ด้วยสาย USB ต้องบันทึกไฟล์นามสกุลใด?",
        options: [".hex", ".mp4", ".docx"],
      },
    },
    solutionCheck: {
      mode: "order",
      correctOrder: ["interview", "define", "ideate", "prototype", "feedback"],
      microCorrectOption: ".hex",
    },
  },
  {
    challengeKey: "u02-algorithms",
    title: "Unit 02: จำแนก 4 องค์ประกอบคอมพิวเตอร์บน micro:bit",
    orderIndex: 2,
    difficulty: "easy",
    maxScore: 10,
    xpReward: 40,
    config: {
      mode: "classify",
      unitCode: "Unit 02",
      story:
        "จับคู่ชิ้นส่วนและอุปกรณ์ของบอร์ด micro:bit ในกิจกรรม Fidget Cube ให้ตรงกับ 4 องค์ประกอบของเครื่องคอมพิวเตอร์",
      categories: [
        { id: "IN", label: "Input (รับเข้า)", badgeCls: "bg-sky-100 text-sky-800 border-sky-200" },
        { id: "PROC", label: "Processor (ประมวลผล)", badgeCls: "bg-indigo-100 text-indigo-800 border-indigo-200" },
        { id: "MEM", label: "Memory (หน่วยความจำ)", badgeCls: "bg-amber-100 text-amber-800 border-amber-200" },
        { id: "OUT", label: "Output (แสดงผล)", badgeCls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
      ],
      items: [
        { id: "btn", text: "ปุ่มกด A / B และ Event 'on shake'" },
        { id: "cpu", text: "ชิป Cortex-M ประมวลผลคำสั่ง MakeCode" },
        { id: "ram", text: "RAM / Flash ที่เก็บตัวแปรและไฟล์โปรแกรม" },
        { id: "led", text: "แผงหน้าจอ LED 5×5 ดวงแสดงหน้ายิ้ม/เศร้า" },
      ],
      hints: [
        "Input รับเหตุการณ์จากผู้ใช้ เช่น การกดปุ่มและการเขย่า",
        "Output แสดงผลให้ผู้ใช้เห็น เช่น หน้าจอ LED 5×5",
        "Processor คือชิปคิดคำนวณ ส่วน Memory คือที่เก็บโปรแกรมและตัวแปร",
      ],
      microQuestion: {
        prompt: "คำสั่งแบบ 'on button A pressed' เป็นแนวคิดการเขียนโปรแกรมรูปแบบใด?",
        options: ["Event Handler (รอรับเหตุการณ์)", "Hardware Short Circuit", "Pixel Brightness"],
      },
    },
    solutionCheck: {
      mode: "classify",
      correctMap: { btn: "IN", cpu: "PROC", ram: "MEM", led: "OUT" },
      microCorrectOption: "Event Handler (รอรับเหตุการณ์)",
    },
  },
  {
    challengeKey: "u03-variables",
    title: "Unit 03: เลือกชนิดข้อมูล (Variable Types) ให้เหมาะกับโครงงาน",
    orderIndex: 3,
    difficulty: "easy",
    maxScore: 10,
    xpReward: 45,
    config: {
      mode: "classify",
      unitCode: "Unit 03",
      story:
        "ในโครงงาน Scorekeeper และ Everything Counts จงจำแนกตัวอย่างข้อมูลต่อไปนี้ลงใน Data Type ที่ถูกต้อง",
      categories: [
        { id: "NUM", label: "Number (ตัวเลข)", badgeCls: "bg-blue-100 text-blue-800 border-blue-200" },
        { id: "STR", label: "String (ข้อความ)", badgeCls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
        { id: "BOOL", label: "Boolean (True/False)", badgeCls: "bg-purple-100 text-purple-800 border-purple-200" },
        { id: "ARR", label: "Array (ชุดข้อมูล)", badgeCls: "bg-amber-100 text-amber-800 border-amber-200" },
      ],
      items: [
        { id: "steps", text: "steps = 124 (นับจำนวนก้าวเดิน)" },
        { id: "name", text: 'petName = "Bibo" (ชื่อสัตว์เลี้ยงบนจอ)' },
        { id: "flag", text: "isReady = True (สถานะเริ่มเล่นเกม)" },
        { id: "notes", text: 'playlist = ["Do", "Mi", "Sol"]' },
      ],
      hints: [
        "ข้อมูลที่ใส่เครื่องหมายคำพูด \"...\" คือ String ส่วนค่า True/False คือ Boolean",
        "ตัวเลขใช้บวกลบคะแนนคือ Number และรายการหลายตัวใน [...] คือ Array",
      ],
      microQuestion: {
        prompt: "ความแตกต่างสำคัญระหว่าง Constant และ Variable คือข้อใด?",
        options: [
          "Constant มีค่าคงที่ตลอดการทำงาน แต่ Variable เปลี่ยนแปลงค่าได้ตามโปรแกรม",
          "Variable เก็บได้เฉพาะตัวอักษรภาษาไทยเท่านั้น",
          "Constant ใช้สร้างหน้าจอ LED ได้อย่างเดียว",
        ],
      },
    },
    solutionCheck: {
      mode: "classify",
      correctMap: { steps: "NUM", name: "STR", flag: "BOOL", notes: "ARR" },
      microCorrectOption: "Constant มีค่าคงที่ตลอดการทำงาน แต่ Variable เปลี่ยนแปลงค่าได้ตามโปรแกรม",
    },
  },
  {
    challengeKey: "u04-conditionals",
    title: "Unit 04: ลำดับการทำงานเกม Rock-Paper-Scissors (on shake)",
    orderIndex: 4,
    difficulty: "easy",
    maxScore: 10,
    xpReward: 45,
    config: {
      mode: "order",
      unitCode: "Unit 04",
      story:
        "เรียงลำดับตรรกะของโปรแกรมเป่ายิ้งฉุบด้วยเงื่อนไข if...else if...else เมื่อผู้เล่นเขย่าบอร์ด micro:bit",
      blocks: [
        { id: "shake", text: "1. ตรวจจับเหตุการณ์ on shake เมื่อผู้เล่นเขย่าบอร์ด" },
        { id: "rand", text: "2. สุ่มเลขเก็บใน hand = pick random 0 to 2" },
        { id: "if0", text: "3. if hand == 0 → แสดงรูปค้อน (Rock)" },
        { id: "elif1", text: "4. else if hand == 1 → แสดงรูปกระดาษ (Paper)" },
        { id: "else2", text: "5. else → แสดงรูปกรรไกร (Scissors)" },
      ],
      hints: [
        "ต้องเริ่มจาก Event (on shake) แล้วสุ่มค่า hand 0..2 ก่อนตัดสินใจด้วยเงื่อนไข",
        "โครงสร้างเงื่อนไขเรียงจาก if -> else if -> else ตามลำดับ: shake -> rand -> if0 -> elif1 -> else2",
      ],
      microQuestion: {
        prompt: "ถ้าไม่ใส่ 'else if / else' แต่แยกเป็น 'if' เดี่ยวๆ และลืมตั้งช่วงตัวเลขสุ่มให้ดี อาจเกิดปัญหาใด?",
        options: [
          "เงื่อนไขอาจทำงานซ้อนหรือไม่มีทางเลือกสำรองเมื่อค่าไม่ตรงกรณีใดเลย",
          "จอ LED จะกลับด้าน X และ Y อัตโนมัติ",
          "สาย USB จะตัดการเชื่อมต่อทันที",
        ],
      },
    },
    solutionCheck: {
      mode: "order",
      correctOrder: ["shake", "rand", "if0", "elif1", "else2"],
      microCorrectOption: "เงื่อนไขอาจทำงานซ้อนหรือไม่มีทางเลือกสำรองเมื่อค่าไม่ตรงกรณีใดเลย",
    },
  },
  {
    challengeKey: "u05-iteration",
    title: "Unit 05: จับคู่ชนิดของ Loop ให้ตรงกับงานวนซ้ำ (Iteration)",
    orderIndex: 5,
    difficulty: "medium",
    maxScore: 10,
    xpReward: 50,
    config: {
      mode: "classify",
      unitCode: "Unit 05",
      story:
        "เลือกประเภทของลูปและขาต่อเสียงดนตรีใน Unit 5 (Iteration & Get Loopy!) ให้ถูกต้องตรงสถานการณ์",
      categories: [
        { id: "REPEAT", label: "Repeat N Times", badgeCls: "bg-sky-100 text-sky-800 border-sky-200" },
        { id: "FOR", label: "For Loop (ใช้ index)", badgeCls: "bg-purple-100 text-purple-800 border-purple-200" },
        { id: "WHILE", label: "While Loop (เช็กเงื่อนไข)", badgeCls: "bg-amber-100 text-amber-800 border-amber-200" },
        { id: "PIN", label: "Audio Pins (P0 + GND)", badgeCls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
      ],
      items: [
        { id: "sq", text: "กะพริบไฟหัวใจซ้ำ 4 ครั้งเป๊ะ (รู้จำนวนรอบแน่นอน)" },
        { id: "idx", text: "วนจุด LED จาก x = 0 ถึง 4 โดยเปลี่ยนตำแหน่งตามตัวแปรนับ" },
        { id: "wait", text: "เล่นเสียงเตือนวนต่อไปเรื่อยๆ ตราบที่ยังไม่มีใครกดปุ่ม A" },
        { id: "spk", text: "คีบปากจระเข้ต่อหูฟังเข้ากับ micro:bit เพื่อฟังทำนองเพลง" },
      ],
      hints: [
        "ถ้าต้องใช้ตัวเลขลำดับ (0, 1, 2, 3, 4) เปลี่ยนพิกัด LED ใช้ For Loop",
        "ถ้าทำซ้ำตามเงื่อนไข True/False ใช้ While Loop ส่วนการต่อหูฟังต้องคีบ P0 + GND",
      ],
      microQuestion: {
        prompt: "ในกิจกรรม 'Walk a square' ถ้าใช้ Repeat แทนการวางบล็อกเดินซ้ำ 4 ด้าน ช่วยโปรแกรมดีขึ้นอย่างไร?",
        options: [
          "ลดจำนวนบล็อกโค้ด แก้ไขระยะทางหรือจังหวะครั้งเดียวมีผลครบทั้ง 4 ด้าน",
          "ทำให้หน้าจอ micro:bit ขยายขนาดเป็น 10×10",
          "ช่วยไม่ต้องใช้ถ่านไฟฉาย",
        ],
      },
    },
    solutionCheck: {
      mode: "classify",
      correctMap: { sq: "REPEAT", idx: "FOR", wait: "WHILE", spk: "PIN" },
      microCorrectOption: "ลดจำนวนบล็อกโค้ด แก้ไขระยะทางหรือจังหวะครั้งเดียวมีผลครบทั้ง 4 ด้าน",
    },
  },
  {
    challengeKey: "u06-mini-project",
    title: "Unit 06: วางแผนสร้าง Mini Project Showcase",
    orderIndex: 6,
    difficulty: "medium",
    maxScore: 10,
    xpReward: 50,
    config: {
      mode: "order",
      unitCode: "Unit 06",
      story:
        "เรียงลำดับขั้นตอนการพัฒนาโครงงานย่อยกลางภาค (Mini Project) ตั้งแต่สำรวจปัญหาจนถึงการเขียนบันทึกสะท้อนคิด",
      blocks: [
        { id: "scope", text: "1. เลือกปัญหาใกล้ตัวและระบุ I/P/O ของชิ้นงาน" },
        { id: "mockup", text: "2. ออกแบบต้นแบบ Mockup และวาง Logic ตัวแปร/เงื่อนไข/ลูป" },
        { id: "code", text: "3. เขียนโค้ด MakeCode ทีละฟีเจอร์หลัก (MVP)" },
        { id: "test", text: "4. ทดลองบนบอร์ดจริง แก้ไขบั๊กกับเพื่อนร่วมชั้น" },
        { id: "diary", text: "5. นำเสนอ Showcase และเขียนบันทึก Project Reflection" },
      ],
      hints: [
        "เริ่มจากระบุปัญหาและ Input/Process/Output ก่อนวาด Mockup และลงมือเขียนโค้ด",
        "ลำดับที่ถูกต้องคือ scope -> mockup -> code -> test -> diary",
      ],
      microQuestion: {
        prompt: "บันทึกสะท้อนคิด (Project Reflection / Diary) มีประโยชน์สำคัญต่อผู้พัฒนาอย่างไร?",
        options: [
          "ช่วยให้เห็นปัญหาที่เกิดระหว่างทำ วิธีแก้บั๊ก และแนวทางต่อยอดใน Final Project",
          "ใช้ซ่อนซอร์สโค้ดไม่ให้ครูตรวจ",
          "ทำให้ไฟล์ .hex รันเร็วขึ้น 2 เท่า",
        ],
      },
    },
    solutionCheck: {
      mode: "order",
      correctOrder: ["scope", "mockup", "code", "test", "diary"],
      microCorrectOption: "ช่วยให้เห็นปัญหาที่เกิดระหว่างทำ วิธีแก้บั๊ก และแนวทางต่อยอดใน Final Project",
    },
  },
  {
    challengeKey: "u07-coordinates",
    title: "Unit 07: อ่านพิกัดจอ LED 5×5 (Coordinates & Brightness)",
    orderIndex: 7,
    difficulty: "medium",
    maxScore: 10,
    xpReward: 50,
    config: {
      mode: "classify",
      unitCode: "Unit 07",
      story:
        "จับคู่พิกัด (x, y) และคำสั่งควบคุมจอ LED 5×5 บน micro:bit ให้ตรงกับตำแหน่งและความหมายจริงบนบอร์ด",
      categories: [
        { id: "TL", label: "มุมซ้ายบนสุด", badgeCls: "bg-sky-100 text-sky-800 border-sky-200" },
        { id: "MID", label: "จุดกึ่งกลางจอ", badgeCls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
        { id: "TR", label: "มุมขวาบนสุด", badgeCls: "bg-amber-100 text-amber-800 border-amber-200" },
        { id: "BR", label: "มุมขวาล่างสุด", badgeCls: "bg-purple-100 text-purple-800 border-purple-200" },
      ],
      items: [
        { id: "p00", text: "led.plot(0, 0)" },
        { id: "p22", text: "led.plot(2, 2)" },
        { id: "p40", text: "led.plot(4, 0)" },
        { id: "p44", text: "led.plot(4, 4)" },
      ],
      hints: [
        "บน micro:bit แกน X วิ่งจากซ้าย (0) ไปขวา (4) ส่วนแกน Y วิ่งจากบน (0) ลงล่าง (4)",
        "ดังนั้น (0,0) คือมุมซ้ายบน, (2,2) คือตรงกลาง, (4,0) คือขวาบน, (4,4) คือขวาล่าง",
      ],
      microQuestion: {
        prompt: "ค่าความสว่าง (Brightness) ของหน้าจอ LED ใน MakeCode ตั้งค่าได้ตั้งแต่เท่าไรถึงเท่าไร?",
        options: ["0 ถึง 255", "1 ถึง 5", "-100 ถึง 100"],
      },
    },
    solutionCheck: {
      mode: "classify",
      correctMap: { p00: "TL", p22: "MID", p40: "TR", p44: "BR" },
      microCorrectOption: "0 ถึง 255",
    },
  },
  {
    challengeKey: "u08-booleans",
    title: "Unit 08: ประเมินผลนิพจน์บูลีน (AND / OR / NOT)",
    orderIndex: 8,
    difficulty: "medium",
    maxScore: 10,
    xpReward: 55,
    config: {
      mode: "classify",
      unitCode: "Unit 08",
      story:
        "กำหนดให้ตัวแปร CoinAHeads = True และ CoinBHeads = False จงจำแนกผลลัพธ์ของนิพจน์ตรรกะแต่ละข้อว่าเป็น True หรือ False",
      categories: [
        { id: "T", label: "True (จริง)", badgeCls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
        { id: "F", label: "False (เท็จ)", badgeCls: "bg-rose-100 text-rose-800 border-rose-200" },
      ],
      items: [
        { id: "e1", text: "CoinAHeads AND CoinBHeads" },
        { id: "e2", text: "CoinAHeads OR CoinBHeads" },
        { id: "e3", text: "NOT CoinBHeads" },
        { id: "e4", text: "CoinAHeads AND (NOT CoinBHeads)" },
      ],
      hints: [
        "AND จะเป็น True ก็ต่อเมื่อทั้งซ้ายและขวาเป็น True ทั้งคู่",
        "NOT False จะกลับค่าเป็น True ทำให้ True AND True เป็น True!",
      ],
      microQuestion: {
        prompt: "ในโครงงาน Sunscreen Monitor (เตือนทาครีมกันแดด) ใช้ตัวดำเนินการบูลีนใดเพื่อตรวจว่า 'อยู่กลางแจ้ง' และ 'แสง UV สูง' พร้อมกัน?",
        options: ["AND", "NOT", "XOR Only"],
      },
    },
    solutionCheck: {
      mode: "classify",
      correctMap: { e1: "F", e2: "T", e3: "T", e4: "T" },
      microCorrectOption: "AND",
    },
  },
  {
    challengeKey: "u09-binary",
    title: "Unit 09: เรียงค่าประจำหลักเลขฐานสอง 4 บิต & Cash Register",
    orderIndex: 9,
    difficulty: "medium",
    maxScore: 10,
    xpReward: 55,
    config: {
      mode: "order",
      unitCode: "Unit 09",
      story:
        "จัดเรียงค่าประจำหลักเลขฐานสอง 4 บิต (จากซ้ายไปขวา: หลักมากสุดไปน้อยสุด) ตามโครงงาน Binary Transmogrifier",
      blocks: [
        { id: "b8", text: "หลักที่ 1 (ซ้ายสุด): 2³ = 8" },
        { id: "b4", text: "หลักที่ 2: 2² = 4" },
        { id: "b2", text: "หลักที่ 3: 2¹ = 2" },
        { id: "b1", text: "หลักที่ 4 (ขวาสุด): 2⁰ = 1" },
      ],
      hints: [
        "เลขฐานสองอ่านจากหลักซ้ายสุด (ค่าประจำหลักสูงสุด) ไปยังขวาสุด (1)",
        "ลำดับคือ 8 -> 4 -> 2 -> 1 (b8 -> b4 -> b2 -> b1)",
      ],
      microQuestion: {
        prompt: "ข้อมูลขนาด 1 Byte ประกอบด้วยกี่ Bit และแทนจำนวนเต็มบวกไม่คิดเครื่องหมายได้ตั้งแต่ 0 ถึงเท่าไร?",
        options: ["8 Bits (เก็บค่า 0 ถึง 255)", "4 Bits (เก็บค่า 0 ถึง 10)", "16 Bits (เก็บค่า 0 ถึง 100)"],
      },
    },
    solutionCheck: {
      mode: "order",
      correctOrder: ["b8", "b4", "b2", "b1"],
      microCorrectOption: "8 Bits (เก็บค่า 0 ถึง 255)",
    },
  },
  {
    challengeKey: "u10-radio",
    title: "Unit 10: ขั้นตอนสื่อสารไร้สาย micro:bit Radio",
    orderIndex: 10,
    difficulty: "medium",
    maxScore: 10,
    xpReward: 60,
    config: {
      mode: "order",
      unitCode: "Unit 10",
      story:
        "จัดลำดับขั้นตอนการสื่อสารข้ามเครื่องในโครงงาน Pair Programming (เช่น Hot or Cold / Stop Thief!)",
      blocks: [
        { id: "grp", text: "1. on start: ตั้ง radio.setGroup(7) ให้ตรงกันทั้งคู่" },
        { id: "send", text: "2. เครื่องส่งเรียก radio.sendString('ALERT') เมื่อพบเหตุการณ์" },
        { id: "wave", text: "3. เสาอากาศส่งคลื่นแม่เหล็กไฟฟ้าความถี่ BLE ข้ามบอร์ด" },
        { id: "recv", text: "4. เครื่องรับทำงานในบล็อก on radio received(receivedString)" },
        { id: "show", text: "5. แสดงผลแจ้งเตือนหรือวัดความแรงสัญญาณ RSSI บน LED" },
      ],
      hints: [
        "ต้องกำหนดช่อง radio.setGroup(...) ใน on start ก่อนส่งหรือรับข้อมูลเสมอ",
        "ลำดับที่ถูกต้องคือ grp -> send -> wave -> recv -> show",
      ],
      microQuestion: {
        prompt: "รหัส Group ID ในคำสั่ง radio.setGroup() ของ MakeCode ตั้งค่าได้ตั้งแต่ช่วงใด?",
        options: ["0 ถึง 255", "1 ถึง 10 เท่านั้น", "1000 ถึง 9999"],
      },
    },
    solutionCheck: {
      mode: "order",
      correctOrder: ["grp", "send", "wave", "recv", "show"],
      microCorrectOption: "0 ถึง 255",
    },
  },
  {
    challengeKey: "u11-arrays",
    title: "Unit 11: ขั้นตอน Selection Sort ในโครงงาน Arrays",
    orderIndex: 11,
    difficulty: "hard",
    maxScore: 10,
    xpReward: 60,
    config: {
      mode: "order",
      unitCode: "Unit 11",
      story:
        "เรียงลำดับขั้นตอนการทำงาน 1 รอบของอัลกอริทึม Selection Sort สำหรับจัดเรียงตัวเลขใน Array (จากน้อยไปมาก)",
      blocks: [
        { id: "cur", text: "1. กำหนดตำแหน่งเริ่มต้นที่ยังไม่เรียง (เช่น index i = 0)" },
        { id: "scan", text: "2. กวาดเปรียบเทียบสมาชิกที่เหลือทั้งหมดทางด้านขวา" },
        { id: "min", text: "3. หาตำแหน่ง index ของสมาชิกที่มีค่าน้อยที่สุด (minIndex)" },
        { id: "swap", text: "4. สลับค่าที่ index i กับค่าที่ minIndex" },
        { id: "adv", text: "5. เลื่อน i ไปตำแหน่งถัดไปจนครบทั้งอาเรย์" },
      ],
      hints: [
        "Selection Sort หา 'ค่าน้อยสุดของช่วงที่เหลือ' ก่อนแล้วจึงนำมาสลับไว้ข้างหน้าสุดของรอบนั้น",
        "ลำดับคือ cur -> scan -> min -> swap -> adv",
      ],
      microQuestion: {
        prompt: "อาเรย์ list = [10, 20, 30, 40] สมาชิก list[0] มีค่าเท่าใด?",
        options: ["10 (Index เริ่มต้นที่ 0 เสมอ)", "20", "40"],
      },
    },
    solutionCheck: {
      mode: "order",
      correctOrder: ["cur", "scan", "min", "swap", "adv"],
      microCorrectOption: "10 (Index เริ่มต้นที่ 0 เสมอ)",
    },
  },
  {
    challengeKey: "u12-accel",
    title: "Unit 12: จำแนกค่าเซนเซอร์ความเร่ง 3 แกน (Accelerometer)",
    orderIndex: 12,
    difficulty: "hard",
    maxScore: 10,
    xpReward: 65,
    config: {
      mode: "classify",
      unitCode: "Unit 12",
      story:
        "จับคู่ค่าที่อ่านได้จาก Accelerometer (หน่วย milli-g) ในกิจกรรม Strike a Pose & Stand for Health ให้ตรงกับท่าทางของบอร์ด",
      categories: [
        { id: "SHAKE", label: "Shake (เขย่าแรง)", badgeCls: "bg-amber-100 text-amber-800 border-amber-200" },
        { id: "LEFT", label: "Tilt Left (เอียงซ้าย)", badgeCls: "bg-sky-100 text-sky-800 border-sky-200" },
        { id: "RIGHT", label: "Tilt Right (เอียงขวา)", badgeCls: "bg-purple-100 text-purple-800 border-purple-200" },
        { id: "FALL", label: "Free Fall (ร่วงหล่น)", badgeCls: "bg-rose-100 text-rose-800 border-rose-200" },
      ],
      items: [
        { id: "a1", text: "Strength > 1600 mg แกว่งขึ้นลงรวดเร็ว" },
        { id: "a2", text: "แกน X อ่านได้ -750 mg (ค่ายิ่งติดลบเมื่อเอียงซ้าย)" },
        { id: "a3", text: "แกน X อ่านได้ +750 mg (ค่าเป็นบวกเมื่อเอียงขวา)" },
        { id: "a4", text: "Strength เข้าใกล้ 0–150 mg ขณะลอยตกอิสระ" },
      ],
      hints: [
        "แกน X วัดการเอียงซ้าย (-) และเอียงขวา (+) ส่วน Free Fall ความเร่งรวมแทบเป็น 0",
        "เมื่อเขย่าแรงค่า Strength จะพุ่งสูงเกินแรงโน้มถ่วงปกติ (> 1600 mg)",
      ],
      microQuestion: {
        prompt: "ความแตกต่างระหว่าง Velocity (ความเร็ว) และ Acceleration (ความเร่ง) คือข้อใด?",
        options: [
          "Velocity คือความเร็ว ณ ขณะนั้น ส่วน Acceleration คืออัตราการเปลี่ยนแปลงของความเร็ว (เร็วขึ้น/ช้าลง/เปลี่ยนทิศ)",
          "Acceleration วัดเฉพาะเวลาเดินไปข้างหน้าเท่านั้น",
          "Velocity วัดอุณหภูมิของบอร์ด micro:bit",
        ],
      },
    },
    solutionCheck: {
      mode: "classify",
      correctMap: { a1: "SHAKE", a2: "LEFT", a3: "RIGHT", a4: "FALL" },
      microCorrectOption:
        "Velocity คือความเร็ว ณ ขณะนั้น ส่วน Acceleration คืออัตราการเปลี่ยนแปลงของความเร็ว (เร็วขึ้น/ช้าลง/เปลี่ยนทิศ)",
    },
  },
  {
    challengeKey: "u13-final",
    title: "Unit 13: เช็กลิสต์ส่งมอบ Final Project Showcase",
    orderIndex: 13,
    difficulty: "hard",
    maxScore: 10,
    xpReward: 80,
    config: {
      mode: "order",
      unitCode: "Unit 13",
      story:
        "จัดลำดับขั้นตอนปิดโครงงานปลายภาค Final Project ให้ครบถ้วนก่อนขึ้นเวที Showcase และส่งเกรด",
      blocks: [
        { id: "integrate", text: "1. รวมโค้ดขั้นสูง (Radio/Array/Coords/Accel) เข้ากับชิ้นงานประดิษฐ์" },
        { id: "verify", text: "2. ทดสอบสถานการณ์จริงและแก้ Edge Cases บนบอร์ด micro:bit" },
        { id: "share", text: "3. กด Share → Publish project บน MakeCode เพื่อรับ URL ซอร์สโค้ด" },
        { id: "showcase", text: "4. สาธิตการทำงานและตอบคำถามเพื่อนใน Final Showcase" },
        { id: "narrative", text: "5. เขียน Final Narrative สะท้อนผลลัพธ์ส่งพร้อมลิงก์โค้ด" },
      ],
      hints: [
        "ต้องประกอบและทดสอบให้สมบูรณ์ก่อนกด Publish รับลิงก์ Share URL",
        "ลำดับคือ integrate -> verify -> share -> showcase -> narrative",
      ],
      microQuestion: {
        prompt: "สิ่งที่ทำให้ Final Project โดดเด่นทั้งด้าน Coding และ Design Thinking คืออะไร?",
        options: [
          "แก้ปัญหาผู้ใช้ได้จริง ทดสอบซ้ำจากฟีดแบ็ก และเขียนโค้ดโครงสร้างสะอาดไม่มีบั๊ก",
          "ใช้เฉพาะสีไฟกระพริบโดยไม่กำหนดเป้าหมายปัญหา",
          "ไม่ทดสอบกับผู้ใช้จนกว่าจะจบภาคเรียน",
        ],
      },
    },
    solutionCheck: {
      mode: "order",
      correctOrder: ["integrate", "verify", "share", "showcase", "narrative"],
      microCorrectOption:
        "แก้ปัญหาผู้ใช้ได้จริง ทดสอบซ้ำจากฟีดแบ็ก และเขียนโค้ดโครงสร้างสะอาดไม่มีบั๊ก",
    },
  },
];

export function buildMicrobitDemoClientChallenges(seed = 2569): ChallengeClientView[] {
  return buildOrderClassifyDemoChallenges(MICROBIT_M1_DEMO_CHALLENGES, "demo-mbit-", seed);
}
