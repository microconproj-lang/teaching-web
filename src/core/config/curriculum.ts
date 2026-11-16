import { V21103_COURSE } from "@/content/courses/v21103/course";
import { V21103_LESSONS } from "@/content/courses/v21103/lessons";
import {
  V21103_ADVENTURE_ISLANDS,
  V21103_ARENA_CHALLENGES,
  V21103_LAB_PROBLEMS,
} from "@/content/courses/v21103/practice";
import { V21202_COURSE } from "@/content/courses/v21202/course";
import { V21202_LESSONS } from "@/content/courses/v21202/lessons";
import {
  V21202_ADVENTURE_ISLANDS,
  V21202_ARENA_CHALLENGES,
  V21202_LAB_PROBLEMS,
} from "@/content/courses/v21202/practice";
import { V23202_COURSE } from "@/content/courses/v23202/course";
import { V23202_LESSONS } from "@/content/courses/v23202/lessons";
import {
  V23202_ADVENTURE_ISLANDS,
  V23202_ARENA_CHALLENGES,
  V23202_LAB_PROBLEMS,
} from "@/content/courses/v23202/practice";
import type {
  AdventureIslandDef,
  ArenaProblemDef,
  CourseDef,
  InteractiveLessonDef,
  LabProblemDef,
} from "@/core/config/curriculum-types";

export * from "@/core/config/curriculum-types";

// ============================================================================
// 1. รายวิชาหลัก ม.1 - ม.3
// ============================================================================

export const COURSES: CourseDef[] = [
  V21103_COURSE,
  {
    code: "ว22103",
    slug: "v22103",
    gradeLevel: 2,
    gradeLabel: "ชั้นมัธยมศึกษาปีที่ 2",
    title: "การเขียนโปรแกรมคอมพิวเตอร์ (Python)",
    subtitle: "ฝึกเขียนภาษา Python ตั้งแต่ตัวแปร String Slicing, List, Dict จนถึงลูปและฟังก์ชัน",
    semesterLabel: "ม.2 · เปิดให้เรียนรู้ครบทุกสไลด์และ Lab",
    status: "active",
    theme: "dark-navy",
    tags: ["Python", "String Slicing", "List & Dict", "Loops", "Functions"],
    moduleKey: "python-quest-m2",
    stats: { lessonsCount: 2, exercisesCount: 6, missionsCount: 6, slidesCount: 14 },
    units: [
      {
        unitNo: 1,
        title: "UNIT 1 : โครงสร้างข้อมูลและ String Slicing",
        description: "เข้าใจ Index บวก-ลบ การตัดคำ text[start:stop:step] และการจัดการ List",
        status: "active",
        lessonKeys: ["m2-string-slicing", "m2-list-loops"],
      },
      {
        unitNo: 2,
        title: "UNIT 2 : ฟังก์ชันและ Dictionary",
        description: "แยกงานเป็นฟังก์ชันย่อยด้วย def และค้นหาข้อมูลแบบ Key-Value",
        status: "coming_soon",
        lessonKeys: [],
      },
    ],
  },
  {
    code: "ว23103",
    slug: "v23103",
    gradeLevel: 3,
    gradeLabel: "ชั้นมัธยมศึกษาปีที่ 3 (พื้นฐาน)",
    title: "ความมั่นคงไซเบอร์และโครงงานโค้ด",
    subtitle: "ตรวจจับลิงก์ปลอม ถอดรหัสลับซีซาร์ และพัฒนาโปรแกรมขนาดย่อมด้วย Python",
    semesterLabel: "ม.3 · เปิดโหมดฝึกปฏิบัติและภารกิจ",
    status: "active",
    theme: "teal-shield",
    tags: ["Cyber Hygiene", "Phishing", "Cryptography", "Mini Project"],
    moduleKey: "cyber-defense-m3",
    stats: { lessonsCount: 2, exercisesCount: 4, missionsCount: 4, slidesCount: 10 },
    units: [
      {
        unitNo: 1,
        title: "UNIT 1 : การเข้ารหัสลับและวิเคราะห์ภัยไซเบอร์",
        description: "จำลอง Caesar Cipher ด้วย Python และจับผิด URL ปลอมอย่างมืออาชีพ",
        status: "active",
        lessonKeys: ["m3-caesar-cipher", "m3-phishing-defense"],
      },
    ],
  },
  V21202_COURSE,
  V23202_COURSE,
];

// ============================================================================
// 2. บทเรียนสไลด์ Interactive + Visualizer + ภารกิจเขียนโค้ดในหน้าเรียน
// ============================================================================

export const INTERACTIVE_LESSONS: InteractiveLessonDef[] = [
  {
    key: "m2-string-slicing",
    courseCode: "ว22103",
    gradeLevel: 2,
    unitNo: 1,
    title: "String (str) และเทคนิค String Slicing",
    subtitle: "เข้าใจดัชนีบวก-ลบ และการตัดข้อความด้วย text[start:stop:step] แบบเห็นภาพจริง",
    durationMin: 15,
    iconBg: "blue",
    slides: [
      {
        id: "s1",
        kind: "concept",
        title: "String คือกล่องตัวอักษรที่เรียงตาม Index",
        subtitle: "ทุกตัวอักษรในข้อความมีตำแหน่งประจำตัว (เริ่มต้นที่ 0 เสมอ)",
        body: [
          "ในภาษา Python ข้อความ (String) เปรียบเสมือนขบวนตู้รถไฟที่แต่ละตู้เก็บตัวอักษร 1 ตัว",
          "ดัชนีบวกนับจากซ้ายไปขวา: 0, 1, 2, ... ส่วนดัชนีลบนับจากขวาไปซ้าย: -1, -2, -3, ...",
        ],
        codeSnippet: `word = "COMPUTER"\nprint(word[0])   # 'C'\nprint(word[-1])  # 'R'`,
        callout: "จำง่ายๆ: ตัวแรกคือ [0] และตัวสุดท้ายคือ [-1] เสมอ ไม่ว่าจะยาวเท่าไร",
      },
      {
        id: "s2",
        kind: "visualizer",
        title: "ลองเลื่อนดู Index & String Slicing ของจริง",
        subtitle: "ปรับค่า start, stop, step เพื่อดูตำแหน่งที่ถูกดึงออกมาทีละตัว",
        body: [
          "รูปแบบเต็มคือ text[start : stop : step] โดย Python จะหยิบตั้งแต่ start ไปจนถึงก่อน stop (ไม่รวมตำแหน่ง stop!)",
        ],
        visualizerType: "string-slicing",
      },
      {
        id: "s3",
        kind: "quiz",
        title: "ทดสอบความเข้าใจ: Slicing & Negative Index",
        body: ["ลองวิเคราะห์ผลลัพธ์โดยยังไม่เปิดคอมไพเลอร์ดูครับ"],
        quiz: {
          checkKey: "quiz-m2-slicing-1",
          question: 'กำหนดให้ name = "PYTHON" คำสั่ง print(name[1:4]) จะได้ข้อความใด?',
          options: ["PYT", "YTH", "YTHO", "THO"],
          correctIndex: 1,
          explanation: "start=1 คือ 'Y', stop=4 คือหยุดก่อน index 4 จึงหยิบ index 1, 2, 3 ได้ 'YTH'",
          coinReward: 10,
        },
      },
      {
        id: "s4",
        kind: "mission",
        title: "ภารกิจลงมือทำ: จัดการชื่อให้เรียบร้อย",
        subtitle: "ใช้ .strip() และ .title() หรือ Slicing จัดรูปแบบชื่อ-สกุล",
        body: [
          "รับข้อมูล 1 บรรทัดที่อาจมีช่องว่างหัวท้ายปะปน (เช่น '  somchai jaidee  ') แล้วจัดให้เป็นตัวพิมพ์ใหญ่ขึ้นต้นทุกคำและไม่มีช่องว่างเกิน",
        ],
        mission: {
          checkKey: "mission-m2-clean-name",
          filename: "clean_name.py",
          prompt: "อ่านข้อความจาก input() ตัดช่องว่างหัวท้ายด้วย .strip() แล้วแปลงด้วย .title() จากนั้น print ออกมา",
          starterCode: `raw = input()\nclean = raw.strip().title()\nprint(clean)\n`,
          hints: [
            "ใช้ raw = input() เพื่อรับค่าทดสอบ",
            "เมธอด .strip() ใช้ตัดช่องว่างด้านหน้าและด้านหลังข้อความ",
            "ต่อด้วย .title() เพื่อทำให้อักษรตัวแรกของแต่ละคำเป็นตัวพิมพ์ใหญ่",
          ],
          testCases: [
            { label: "กรณี 1: เว้นวรรคหัวท้าย + พิมพ์เล็ก", stdin: ["  somchai jaidee  "], expectedOutput: "Somchai Jaidee" },
            { label: "กรณี 2: ข้อความสั้น", stdin: ["   pccpl   "], expectedOutput: "Pccpl" },
          ],
          coinReward: 20,
          xpReward: 40,
        },
      },
    ],
  },
  {
    key: "m2-list-loops",
    courseCode: "ว22103",
    gradeLevel: 2,
    unitNo: 1,
    title: "ตะกร้าข้อมูล List และลูป for",
    subtitle: "เก็บหลายค่าในตัวแปรเดียวและวนรอบคำนวณผลรวม-ค่าเฉลี่ยอย่างรวดเร็ว",
    durationMin: 15,
    iconBg: "purple",
    slides: [
      {
        id: "s1",
        kind: "visualizer",
        title: "ดูการทำงานของ List และ Loop ทีละรอบ",
        subtitle: "คลิกเล่นหรือก้าวทีละขั้นเพื่อสังเกตการเปลี่ยนค่าตัวแปรสะสม",
        body: ["ลูป for จะหยิบสมาชิกจาก List ทีละช่องตั้งแต่ index 0 จนครบทุกรายการ"],
        visualizerType: "loop-list",
      },
      {
        id: "s2",
        kind: "mission",
        title: "ภารกิจลงมือทำ: คำนวณผลรวมคะแนนเฉพาะที่ผ่าน",
        body: ["เขียนโปรแกรมหาผลรวมของตัวเลขใน scores = [12, 8, 15, 5, 20] ที่มีค่าตั้งแต่ 10 ขึ้นไป แล้ว print ผลลัพธ์"],
        mission: {
          checkKey: "mission-m2-filter-sum",
          filename: "filter_sum.py",
          prompt: "รวมเฉพาะคะแนน >= 10 จาก scores = [12, 8, 15, 5, 20] แล้ว print(total)",
          starterCode: `scores = [12, 8, 15, 5, 20]\ntotal = 0\nfor s in scores:\n    if s >= 10:\n        total += s\nprint(total)\n`,
          hints: [
            "ตั้ง total = 0 ก่อนเริ่มลูป",
            "เช็กเงื่อนไข if s >= 10: ก่อนบวกเข้า total",
          ],
          testCases: [{ label: "ผลรวมคะแนนผ่านเกณฑ์ (12+15+20)", expectedOutput: "47" }],
          coinReward: 20,
          xpReward: 40,
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
  ...V21103_LESSONS,
  ...V21202_LESSONS,
  ...V23202_LESSONS,
];

// ============================================================================
// 3. โจทย์ Coding Lab (แยกจอซ้าย-ขวา + Test Cases)
// ============================================================================

export const LAB_PROBLEMS: LabProblemDef[] = [
  {
    key: "lab-m2-clean-name",
    courseCode: "ว22103",
    gradeLevel: 2,
    title: "จัดชื่อให้เรียบร้อย (String)",
    difficulty: "ง่าย",
    topic: "String Methods",
    description:
      "อ่านข้อความจาก input() ที่อาจมีเว้นวรรคเกินและตัวพิมพ์เล็ก-ใหญ่ปนกัน จากนั้นตัดเว้นวรรคหัวท้ายและทำให้ตัวอักษรแรกของทุกคำเป็นตัวพิมพ์ใหญ่",
    filename: "clean_name.py",
    starterCode: `name = input()\nprint(name.strip().title())\n`,
    hint: "ใช้เมธอด .strip() แล้วต่อด้วย .title()",
    coinReward: 15,
    testCases: [
      { label: "เว้นวรรค + ตัวพิมพ์เล็ก", stdin: ["  alice wonderland  "], expectedOutput: "Alice Wonderland" },
      { label: "ตัวพิมพ์ใหญ่ทั้งหมด", stdin: ["SOMCHAI PCCPL"], expectedOutput: "Somchai Pccpl" },
    ],
  },
  {
    key: "lab-m2-slice-code",
    courseCode: "ว22103",
    gradeLevel: 2,
    title: "รหัสนักเรียนแบบย่อ (Slicing)",
    difficulty: "ง่าย",
    topic: "String Slicing",
    description:
      "รับรหัสวิชา เช่น 'ว22103-PYTHON' แล้วพิมพ์เฉพาะอักษร 6 ตัวสุดท้าย (กลับด้านด้วย step -1 หรือตัดช่วงปกติ: จงพิมพ์ 6 ตัวสุดท้ายตามลำดับเดิม)",
    filename: "slice_code.py",
    starterCode: `code = input().strip()\nprint(code[-6:])\n`,
    hint: "ใช้ Negative Slice code[-6:] เพื่อดึง 6 ตัวท้ายสุด",
    coinReward: 20,
    testCases: [
      { label: "รหัสว22103-PYTHON", stdin: ["ว22103-PYTHON"], expectedOutput: "PYTHON" },
      { label: "รหัส M2-CODING", stdin: ["M2-CODING"], expectedOutput: "CODING" },
    ],
  },
  {
    key: "lab-m2-grade-avg",
    courseCode: "ว22103",
    gradeLevel: 2,
    title: "สรุปสถิติคะแนนห้องเรียน (List)",
    difficulty: "ปานกลาง",
    topic: "List & Loop",
    description:
      "กำหนด list คะแนนคะแนน 5 ช่องจากค่าที่ป้อน (คั่นด้วยช่องว่าง) จงคำนวณคะแนนสูงสุดและค่าเฉลี่ยทศนิยม 1 ตำแหน่ง",
    filename: "stats.py",
    starterCode: `nums = [int(x) for x in input().split()]\nmx = max(nums)\navg = sum(nums) / len(nums)\nprint(f"MAX={mx} AVG={avg:.1f}")\n`,
    hint: "ใช้ max(nums), sum(nums) / len(nums) และจัดรูปแบบ f\"{avg:.1f}\"",
    coinReward: 25,
    testCases: [
      { label: "ชุดคะแนน 1", stdin: ["10 20 30 40 50"], expectedOutput: "MAX=50 AVG=30.0" },
      { label: "ชุดคะแนน 2", stdin: ["18 14 20"], expectedOutput: "MAX=20 AVG=17.3" },
    ],
  },
  {
    key: "lab-m3-password-check",
    courseCode: "ว23103",
    gradeLevel: 3,
    title: "ตัวตรวจรหัสผ่านแข็งแรง (Security)",
    difficulty: "ท้าทาย",
    topic: "Cyber Security",
    description:
      "รับรหัสผ่านจาก input() ถ้ามีความยาวอย่างน้อย 8 ตัวและมีตัวเลขอย่างน้อย 1 ตัวให้พิมพ์ STRONG มิฉะนั้นพิมพ์ WEAK",
    filename: "pw_check.py",
    starterCode: `pw = input().strip()\nhas_digit = False\nfor ch in pw:\n    if ch.isdigit():\n        has_digit = True\nif len(pw) >= 8 and has_digit:\n    print("STRONG")\nelse:\n    print("WEAK")\n`,
    hint: "วนลูปเช็ก ch.isdigit() คู่กับเงื่อนไข len(pw) >= 8",
    coinReward: 30,
    testCases: [
      { label: "รหัสผ่านแข็งแรง", stdin: ["pccpl2026"], expectedOutput: "STRONG" },
      { label: "สั้นเกินไป", stdin: ["abc12"], expectedOutput: "WEAK" },
      { label: "ไม่มีตัวเลข", stdin: ["abcdefghij"], expectedOutput: "WEAK" },
    ],
  },
  ...V21103_LAB_PROBLEMS,
  ...V21202_LAB_PROBLEMS,
  ...V23202_LAB_PROBLEMS,
];

// ============================================================================
// 4. หมู่เกาะล่าสมบัติ (Treasure Map) ม.1 - ม.3
// ============================================================================

export const ADVENTURE_ISLANDS: AdventureIslandDef[] = [
  ...V21103_ADVENTURE_ISLANDS,
  {
    key: "island-string-m2",
    order: 3,
    courseCode: "ว22103",
    gradeLevel: 2,
    name: "เกาะตัวอักษร String",
    subtitle: "ม.2 · ฝึก Indexing, Slicing และการแปลงข้อความ",
    requiredLessonKey: "m2-string-slicing",
    chestCoins: 40,
    accentGradient: "from-indigo-500 to-purple-600",
    stages: [
      {
        key: "adv-m2-1",
        code: "3-1",
        title: "พลิกกลับข้อความลับ",
        topicTag: "Step -1",
        difficulty: "easy",
        coinReward: 10,
        xpReward: 35,
        prompt: "อ่านข้อความ s = input().strip() แล้วพิมพ์ข้อความแบบกลับหลังด้วย Slicing s[::-1]",
        starterCode: `s = input().strip()\nprint(s[::-1])\n`,
        hint: "Slicing s[::-1] จะอ่านจากท้ายกลับมาหน้า",
        testCases: [
          { label: "CODE -> EDOC", stdin: ["CODE"], expectedOutput: "EDOC" },
          { label: "PCCPL -> LPCCP", stdin: ["PCCPL"], expectedOutput: "LPCCP" },
        ],
      },
      {
        key: "adv-m2-2",
        code: "3-2",
        title: "นับจำนวนสระในคำ",
        topicTag: "String + Loop",
        difficulty: "medium",
        coinReward: 12,
        xpReward: 40,
        prompt: "อ่านข้อความภาษาอังกฤษตัวพิมพ์เล็ก s = input().strip() แล้วนับว่ามีสระ a, e, i, o, u กี่ตัว",
        starterCode: `s = input().strip().lower()\ncount = 0\nfor ch in s:\n    if ch in "aeiou":\n        count += 1\nprint(count)\n`,
        hint: "ตรวจสอบ ch in \"aeiou\" ภายในลูป for",
        testCases: [
          { label: "computer", stdin: ["computer"], expectedOutput: "3" },
          { label: "python", stdin: ["python"], expectedOutput: "1" },
        ],
      },
    ],
  },
  {
    key: "island-list-m2",
    order: 4,
    courseCode: "ว22103",
    gradeLevel: 2,
    name: "เกาะสายโซ่ List & Loop",
    subtitle: "ม.2 · จัดการรายการข้อมูล หาผลรวม และคัดกรองค่า",
    requiredLessonKey: "m2-list-loops",
    chestCoins: 45,
    accentGradient: "from-violet-500 to-fuchsia-600",
    stages: [
      {
        key: "adv-m2-3",
        code: "4-1",
        title: "นับเลขคู่ในตะกร้า",
        topicTag: "Modulo %",
        difficulty: "medium",
        coinReward: 12,
        xpReward: 40,
        prompt: "อ่านเลขหลายตัวคั่นด้วยเว้นวรรค แล้วพิมพ์จำนวนของเลขคู่ทั้งหมด",
        starterCode: `nums = [int(x) for x in input().split()]\nc = 0\nfor n in nums:\n    if n % 2 == 0:\n        c += 1\nprint(c)\n`,
        hint: "เลขคู่คือเลขที่ n % 2 == 0",
        testCases: [
          { label: "ชุดที่ 1", stdin: ["2 5 8 11 14"], expectedOutput: "3" },
          { label: "ไม่มีเลขคู่", stdin: ["1 3 5"], expectedOutput: "0" },
        ],
      },
    ],
  },
  {
    key: "island-cyber-m3",
    order: 5,
    courseCode: "ว23103",
    gradeLevel: 3,
    name: "เกาะนักสืบไซเบอร์",
    subtitle: "ม.3 · เข้ารหัสลับ ตรวจจับโดเมน และการป้องกันบัญชี",
    requiredLessonKey: "m3-caesar-cipher",
    chestCoins: 50,
    accentGradient: "from-emerald-500 to-cyan-600",
    stages: [
      {
        key: "adv-m3-1",
        code: "5-1",
        title: "ตรวจสอบอีเมลโรงเรียน",
        topicTag: "Validation",
        difficulty: "medium",
        coinReward: 15,
        xpReward: 45,
        prompt: "อ่านอีเมล e = input().strip().lower() ถ้าลงท้ายด้วย @pccpl.ac.th พิมพ์ VALID มิฉะนั้น INVALID",
        starterCode: `e = input().strip().lower()\nif e.endswith("@pccpl.ac.th"):\n    print("VALID")\nelse:\n    print("INVALID")\n`,
        hint: "ใช้เมธอด .endswith(\"@pccpl.ac.th\")",
        testCases: [
          { label: "อีเมลโรงเรียน", stdin: ["nong.p@pccpl.ac.th"], expectedOutput: "VALID" },
          { label: "อีเมลอื่น", stdin: ["hacker@gmail.com"], expectedOutput: "INVALID" },
        ],
      },
    ],
  },
  {
    key: "island-boss",
    order: 6,
    courseCode: "ว23103",
    gradeLevel: 3,
    name: "เกาะจอมบั๊ก (Boss Island)",
    subtitle: "บอสใหญ่ประจำภาคเรียน · รวมทักษะทุกชั้นปีเพื่อปลดหีบสมบัติทองคำ",
    chestCoins: 150,
    accentGradient: "from-amber-500 to-rose-600",
    stages: [
      {
        key: "adv-boss-1",
        code: "BOSS",
        title: "ปราบบอสจอมบั๊ก: FizzBuzz ฉบับโค้ด",
        topicTag: "Boss Challenge",
        difficulty: "boss",
        coinReward: 40,
        xpReward: 100,
        prompt:
          "รับเลข n = int(input()) พิมพ์ 1 ถึง n โดยถ้าหาร 3 ลงตัวพิมพ์ PCC, หาร 5 ลงตัวพิมพ์ PL, หารทั้งคู่ลงตัวพิมพ์ PCCPL",
        starterCode: `n = int(input())\nfor i in range(1, n + 1):\n    if i % 15 == 0:\n        print("PCCPL")\n    elif i % 3 == 0:\n        print("PCC")\n    elif i % 5 == 0:\n        print("PL")\n    else:\n        print(i)\n`,
        hint: "ต้องเช็ก i % 15 == 0 ก่อน i % 3 == 0 และ i % 5 == 0 เสมอ",
        testCases: [
          { label: "n = 5", stdin: ["5"], expectedOutput: "1\n2\nPCC\n4\nPL" },
          { label: "n = 15 (บรรทัดสุดท้ายเป็น PCCPL)", stdin: ["15"], expectedOutput: "1\n2\nPCC\n4\nPL\nPCC\n7\n8\nPCC\nPL\n11\nPCC\n13\n14\nPCCPL" },
        ],
      },
    ],
  },
  ...V21202_ADVENTURE_ISLANDS,
  ...V23202_ADVENTURE_ISLANDS,
];

// ============================================================================
// 5. Code Arena โจทย์ประลอง & อันดับซีซัน
// ============================================================================

export const ARENA_CHALLENGES: ArenaProblemDef[] = [
  ...V21103_ARENA_CHALLENGES,
  {
    key: "arena-palindrome",
    title: "คำพาลินโดรม (Palindrome Check)",
    courseCode: "ว22103",
    gradeLevel: 2,
    difficulty: "Silver",
    timeLimitSec: 240,
    apRewardWin: 42,
    coinReward: 30,
    prompt:
      "รับคำ 1 คำจาก input().strip().lower() หากอ่านจากหน้าไปหลังและหลังมาหน้าเหมือนกัน พิมพ์ YES มิฉะนั้นพิมพ์ NO",
    starterCode: `w = input().strip().lower()\nif w == w[::-1]:\n    print("YES")\nelse:\n    print("NO")\n`,
    testCases: [
      { label: "Level", stdin: ["Level"], expectedOutput: "YES" },
      { label: "Radar", stdin: ["radar"], expectedOutput: "YES" },
      { label: "Python", stdin: ["python"], expectedOutput: "NO" },
    ],
  },
  {
    key: "arena-second-max",
    title: "คะแนนอันดับสองของห้อง",
    courseCode: "ว23103",
    gradeLevel: 3,
    difficulty: "Gold",
    timeLimitSec: 300,
    apRewardWin: 60,
    coinReward: 45,
    prompt:
      "รับรายการตัวเลขไม่ซ้ำกันอย่างน้อย 2 ตัวคั่นด้วยช่องว่าง แล้วพิมพ์ค่าที่มากเป็นอันดับ 2",
    starterCode: `nums = sorted([int(x) for x in input().split()], reverse=True)\nprint(nums[1])\n`,
    testCases: [
      { label: "ชุดตัวเลข 1", stdin: ["10 45 22 99 64"], expectedOutput: "64" },
      { label: "ชุดตัวเลข 2", stdin: ["5 12"], expectedOutput: "5" },
    ],
  },
  ...V21202_ARENA_CHALLENGES,
  ...V23202_ARENA_CHALLENGES,
];

export const ARENA_SAMPLE_LEADERBOARD = [
  { rank: 1, displayName: "กัปตัน · ม.3/1", room: "ม.3/1", ap: 1620, streak: 7, solved: 18 },
  { rank: 2, displayName: "ข้าวฟ่าง · ม.2/1", room: "ม.2/1", ap: 1485, streak: 5, solved: 15 },
  { rank: 3, displayName: "ต้นกล้า · ม.2/2", room: "ม.2/2", ap: 1340, streak: 4, solved: 12 },
  { rank: 4, displayName: "ปันปัน · ม.1/1", room: "ม.1/1", ap: 1190, streak: 3, solved: 9 },
];

