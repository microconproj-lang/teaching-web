import type {
  AdventureIslandDef,
  ArenaProblemDef,
  LabProblemDef,
} from "@/core/config/curriculum-types";

export const V23103_LAB_PROBLEMS: LabProblemDef[] = [
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
  {
    key: "lab-v23103-data-cleansing",
    courseCode: "ว23103",
    gradeLevel: 3,
    title: "Data Cleansing ข้อมูลเซนเซอร์ชุมชน (หน่วยที่ 3)",
    difficulty: "ปานกลาง",
    topic: "Data Cleansing & Stats",
    description:
      "รับชุดข้อมูลอุณหภูมิหลายค่าคั่นด้วยเว้นวรรค (อาจมีค่า error เช่น -999 หรือ 250) กรองเฉพาะช่วง 0 ถึง 60 องศาเซลเซียส แล้วพิมพ์จำนวนข้อมูลที่ใช้ได้และค่าเฉลี่ยทศนิยม 1 ตำแหน่ง (VALID=... AVG=...)",
    filename: "sensor_cleanse.py",
    starterCode: `nums = [int(x) for x in input().split()]\nvalid = [n for n in nums if 0 <= n <= 60]\navg = sum(valid) / len(valid) if valid else 0\nprint(f"VALID={len(valid)} AVG={avg:.1f}")\n`,
    hint: "คัดเฉพาะค่า 0 <= n <= 60 ก่อนใช้ sum(valid) / len(valid)",
    coinReward: 25,
    testCases: [
      { label: "ตัดค่า 999 และ -10 ออก", stdin: ["28 30 999 32 -10"], expectedOutput: "VALID=3 AVG=30.0" },
      { label: "ชุดข้อมูลจริง", stdin: ["24 27 29 31"], expectedOutput: "VALID=4 AVG=27.8" },
    ],
  },
  {
    key: "lab-v23103-iot-alert",
    courseCode: "ว23103",
    gradeLevel: 3,
    title: "แจ้งเตือนแอป IoT เกษตรและพลังงาน (หน่วยที่ 2)",
    difficulty: "ง่าย",
    topic: "IoT App Logic",
    description:
      "รับค่าความชื้นดิน moisture และอุณหภูมิ temp คั่นด้วยเว้นวรรค: หาก moisture < 35 พิมพ์ WATERING, มิฉะนั้นหาก temp > 38 พิมพ์ HEAT_WARN, กรณีอื่นพิมพ์ NORMAL",
    filename: "iot_farm_alert.py",
    starterCode: `moisture, temp = [int(x) for x in input().split()]\nif moisture < 35:\n    print("WATERING")\nelif temp > 38:\n    print("HEAT_WARN")\nelse:\n    print("NORMAL")\n`,
    hint: "ตรวจสอบความชื้นต่ำก่อน แล้วค่อยตรวจอุณหภูมิสูงเกิน 38 องศา",
    coinReward: 20,
    testCases: [
      { label: "ดินแห้ง 25%", stdin: ["25 32"], expectedOutput: "WATERING" },
      { label: "ดินชื้นพอแต่อากาศร้อน 41°C", stdin: ["60 41"], expectedOutput: "HEAT_WARN" },
      { label: "สภาพแวดล้อมปกติ", stdin: ["55 29"], expectedOutput: "NORMAL" },
    ],
  },
  {
    key: "lab-v23103-score-70-30",
    courseCode: "ว23103",
    gradeLevel: 3,
    title: "เช็กเกณฑ์คะแนน 70/30 รายวิชา ว23103",
    difficulty: "ง่าย",
    topic: "Course Evaluation",
    description:
      "รับคะแนนรวมจากใบงาน 1.1–4.3 (0..70) และคะแนนสอบย่อยภาคปฏิบัติ 3 ส่วน (0..30) คั่นด้วยเว้นวรรค หากข้อมูลเกินช่วงให้พิมพ์ INVALID มิฉะนั้นพิมพ์ผลรวม TOTAL=<ผลรวม>",
    filename: "grade_70_30.py",
    starterCode: `w, p = [int(x) for x in input().split()]\nif not (0 <= w <= 70 and 0 <= p <= 30):\n    print("INVALID")\nelse:\n    print(f"TOTAL={w + p}")\n`,
    hint: "ตรวจสอบ 0 <= w <= 70 and 0 <= p <= 30 ก่อนรวมคะแนน",
    coinReward: 20,
    testCases: [
      { label: "คะแนนครบเกณฑ์", stdin: ["64 27"], expectedOutput: "TOTAL=91" },
      { label: "คะแนนใบงานเกิน 70", stdin: ["75 20"], expectedOutput: "INVALID" },
    ],
  },
];

export const V23103_ADVENTURE_ISLANDS: AdventureIslandDef[] = [
  {
    key: "island-cyber-m3",
    order: 5,
    courseCode: "ว23103",
    gradeLevel: 3,
    name: "เกาะนักสืบไซเบอร์ & สื่อดิจิทัล",
    subtitle: "ม.3 (ว23103 · หน่วย 1) · เข้ารหัสลับ ตรวจจับโดเมน และความรับผิดชอบดิจิทัล",
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
    key: "island-innovation-m3",
    order: 6,
    courseCode: "ว23103",
    gradeLevel: 3,
    name: "เกาะนวัตกรรม IoT & Data Dashboard (หน่วย 2–4)",
    subtitle: "ม.3 (ว23103) · คัดกรองข้อมูลสะอาด ตรวจความน่าเชื่อถือ และสร้างโซลูชันชุมชน",
    requiredLessonKey: "v23103-u3-data-dashboard",
    chestCoins: 60,
    accentGradient: "from-teal-600 to-[#092551]",
    stages: [
      {
        key: "adv-v23103-clean",
        code: "D1",
        title: "ตัดข้อมูลว่าง NULL & จัดรูปแบบชื่อโซน",
        topicTag: "Data Cleansing",
        difficulty: "medium",
        coinReward: 15,
        xpReward: 45,
        prompt:
          "รับบรรทัดข้อความคั่นด้วยลูกน้ำ ',' เช่น ' north , NULL , south ' ตัดช่องว่างและข้ามคำว่า 'NULL' แล้วพิมพ์ชื่อที่ปรับตัวพิมพ์ขึ้นต้นใหญ่ (.title()) คั่นด้วยเว้นวรรค",
        starterCode: `parts = [p.strip() for p in input().split(",")]\nclean = [p.title() for p in parts if p and p.upper() != "NULL"]\nprint(" ".join(clean))\n`,
        hint: "ใช้ .split(\",\") แล้วคัดออกเมื่อ p ว่างหรือ p.upper() == \"NULL\"",
        testCases: [
          { label: "ตัด NULL และจัดรูป", stdin: ["  north zone , NULL , south zone "], expectedOutput: "North Zone South Zone" },
          { label: "ทุกค่าใช้ได้", stdin: ["farm a, farm b"], expectedOutput: "Farm A Farm B" },
        ],
      },
      {
        key: "adv-v23103-trust",
        code: "D2",
        title: "ประเมินความน่าเชื่อถือแหล่งข้อมูลชุมชน",
        topicTag: "ว 4.2 ม.3/3",
        difficulty: "medium",
        coinReward: 18,
        xpReward: 50,
        prompt:
          "รับคะแนน 3 ด้าน (0 หรือ 1) คั่นด้วยเว้นวรรค: has_source (มีแหล่งต้นตอ), checked_fact (ตรวจข้อมูลจริง), no_fallacy (ไม่ใช้เหตุผลวิบัติ) — ถ้าได้รวมครบ 3 พิมพ์ RELIABLE มิฉะนั้นพิมพ์ VERIFY",
        starterCode: `a, b, c = [int(x) for x in input().split()]\nprint("RELIABLE" if a + b + c == 3 else "VERIFY")\n`,
        hint: "ตรวจสอบผลรวมทั้ง 3 เกณฑ์เท่ากับ 3",
        testCases: [
          { label: "ผ่านครบทั้ง 3 ด้าน", stdin: ["1 1 1"], expectedOutput: "RELIABLE" },
          { label: "ขาดแหล่งต้นตอ", stdin: ["0 1 1"], expectedOutput: "VERIFY" },
        ],
      },
    ],
  },
  {
    key: "island-boss",
    order: 7,
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
];

export const V23103_ARENA_CHALLENGES: ArenaProblemDef[] = [
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
  {
    key: "arena-v23103-clean-outlier",
    title: "คัดกรองข้อมูลซ้ำ & Outlier (Data Cleansing)",
    courseCode: "ว23103",
    gradeLevel: 3,
    difficulty: "Silver",
    timeLimitSec: 240,
    apRewardWin: 45,
    coinReward: 35,
    prompt:
      "รับรายการจำนวนเต็มคั่นด้วยช่องว่าง ตัดค่าที่อยู่นอกช่วง 0..100 และตัดค่าที่ซ้ำกันออก แล้วพิมพ์ค่าเฉลี่ยทศนิยม 1 ตำแหน่ง",
    starterCode: `raw = [int(x) for x in input().split()]\nunique_valid = []\nfor x in raw:\n    if 0 <= x <= 100 and x not in unique_valid:\n        unique_valid.append(x)\navg = sum(unique_valid) / len(unique_valid) if unique_valid else 0\nprint(f"{avg:.1f}")\n`,
    testCases: [
      { label: "ตัดซ้ำ 20 และ Outlier 999/-1", stdin: ["20 20 40 999 -1 60"], expectedOutput: "40.0" },
      { label: "ข้อมูลช่วง 0..100", stdin: ["10 20 30 30"], expectedOutput: "20.0" },
    ],
  },
];
