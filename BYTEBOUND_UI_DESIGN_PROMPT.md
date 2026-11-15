# UI Design Prompt --- Computer Science Learning Platform (ม.1--ม.3)

> ใช้เอกสารนี้เป็น Master Prompt สำหรับสั่ง AI UI Builder / Coding Agent
> ให้ออกแบบและพัฒนาหน้าเว็บไซต์ โดยยึดเอกลักษณ์ด้านภาพและประสบการณ์ผู้ใช้เป็นหลัก
> ไม่ใช่หน้า Dashboard สำเร็จรูปทั่วไป

------------------------------------------------------------------------

## 1. บทบาทและเป้าหมาย

คุณคือ **Award-winning Digital Product Designer + Creative Frontend
Engineer** ที่เชี่ยวชาญการออกแบบแพลตฟอร์มการเรียนรู้สำหรับวัยรุ่นตอนต้น (อายุประมาณ
12--15 ปี)

ออกแบบเว็บไซต์แหล่งเรียนรู้คอมพิวเตอร์และเทคโนโลยีสำหรับนักเรียน **ม.1--ม.3**
และครูผู้สอน โดยเปลี่ยนการเรียนวิทยาการคำนวณให้รู้สึกเหมือนการสำรวจโลก ทดลอง แก้ปริศนา
และสร้างสิ่งต่าง ๆ ด้วยตัวเอง

เว็บไซต์ต้องมีบุคลิกชัดเจน จดจำได้ และดูเหมือนผลิตภัณฑ์ดิจิทัลที่มีทีมออกแบบจริง ไม่ใช่
Template จาก AI หรือ Admin Dashboard ทั่วไป

**แนวคิดหลัก (Creative Direction):** \# "BYTEBOUND --- Explore.
Experiment. Evolve." โลกดิจิทัลที่นักเรียนเป็นนักสำรวจและนักแก้ปัญหา
แต่ละบทเรียนคือพื้นที่ทดลอง แต่ละ Challenge คือภารกิจ
และความก้าวหน้าคือเส้นทางการเติบโตของตัวเอง

ชื่อ BYTEBOUND เป็นชื่อแนวคิดชั่วคราว สามารถเปลี่ยนเป็นชื่อโรงเรียนหรือชื่อโครงการจริงได้
โดยคงระบบภาพและแนวคิดไว้

------------------------------------------------------------------------

## 2. กลุ่มผู้ใช้และหลัก UX

### นักเรียน ม.1--ม.3

-   ต้องเข้าใจหน้าเว็บได้ภายในไม่กี่วินาที ไม่ต้องอ่านคู่มือยาว
-   ภาษากระชับ เป็นมิตร มีพลัง และไม่ใช้ศัพท์เทคนิคเกินระดับ
-   ให้ความรู้สึกสนุกและท้าทายแบบเกม แต่ไม่ดูเป็นเกมเด็กเล็ก
-   ไม่ทำให้ผู้เรียนที่คะแนนน้อยรู้สึกอับอาย
-   ให้ความสำคัญกับความพยายาม การลองผิดลองถูก และการพัฒนาจากสถิติส่วนตัว
-   ใช้งานได้ทั้งคอมพิวเตอร์ แท็บเล็ต และมือถือ

### ครูผู้สอน

-   มองเห็นความคืบหน้าของห้องและรายบุคคลได้รวดเร็ว
-   ดูคะแนน งานที่ยังไม่ส่ง จุดที่นักเรียนติดขัด และหลักฐานการทำงานได้
-   ส่งออกคะแนน CSV/XLSX ได้
-   หน้าครูต้องเป็นมืออาชีพ อ่านข้อมูลง่าย ไม่ใช้ลูกเล่นรบกวนการทำงาน

------------------------------------------------------------------------

## 3. Art Direction --- ภาษาภาพที่ต้องมีเอกลักษณ์

### 3.1 บุคลิกภาพ

ผสมผสาน: - **Editorial / Swiss-inspired layout:** การจัดวางแบบนิตยสาร
มีลำดับสายตาและพื้นที่ว่างอย่างตั้งใจ - **Retro-futuristic computer lab:**
กลิ่นอายห้องทดลองคอมพิวเตอร์ยุคอนาคต ไม่ใช่หน้าจอเกม 8-bit - **Playful technical
graphics:** เส้นกริด พิกัด แผนที่ เส้นทาง โหนด สัญลักษณ์วงจร และตัวเลขกำกับ -
**Youth culture:** สดใหม่ กล้าหาญ มีจังหวะและความสนุก แต่ไม่ใช้ภาพการ์ตูนเด็กเล็ก

### 3.2 สีหลัก

ใช้สีอย่างมีวินัย ไม่ทำให้ทั้งหน้ากลายเป็นสีรุ้ง

-   Background หลัก: Warm off-white `#F4F1E8`
-   Ink / Text: Deep charcoal `#171A1C`
-   Primary accent: Electric cobalt `#315CFF`
-   Secondary accent: Acid lime `#C7F36B`
-   Highlight: Signal orange `#FF7048`
-   Surface: White `#FFFFFF`
-   Muted surface: `#E8E6DD`

หลักการใช้สี: - พื้นที่ส่วนใหญ่เป็น off-white หรือ charcoal ตาม Theme - ใช้ cobalt
เป็นสี Action และจุดนำสายตา - ใช้ lime เฉพาะสถานะสำเร็จ XP หรือความก้าวหน้า - ใช้
orange สำหรับภารกิจใหม่หรือจุดที่ต้องสังเกต - หลีกเลี่ยง Gradient ม่วง-น้ำเงินแบบ AI
Dashboard - รองรับ Dark Mode โดยออกแบบเป็นระบบ ไม่ใช่แค่กลับสี

### 3.3 Typography

-   ใช้ฟอนต์ไทยที่อ่านง่ายและมีบุคลิก เช่น IBM Plex Sans Thai / Anuphan / Noto
    Sans Thai
-   ตัวเลข XP, Level, Score ใช้ฟอนต์ที่มีลักษณะ Technical / Monospace เช่น IBM
    Plex Mono
-   หัวข้อใหญ่มีน้ำหนักและขนาดชัดเจน
-   หลีกเลี่ยงตัวอักษรบางเกินไปหรือฟอนต์แนว Sci-fi ที่อ่านภาษาไทยยาก

### 3.4 Graphic Motifs

สร้างระบบกราฟิกเฉพาะของแพลตฟอร์ม: - Coordinate grid และเส้นพิกัดบาง ๆ -
Node-and-connection diagrams - Pixel fragments แบบใช้เป็นรายละเอียด
ไม่ใช่ธีมหลัก - Mission stamps / Serial numbers / Module IDs - Progress
route และเส้นทางเชื่อมบทเรียน - Custom icon set ที่มีน้ำหนักเส้นเดียวกัน -
รูปทรงวงกลมตัด เส้นเฉียง และกรอบแบบ technical label

**ข้อห้าม:** ห้ามใช้ภาพหุ่นยนต์น่ารักเป็นโลโก้หลัก, สมอง AI เรืองแสง, ภาพ stock
เด็กยิ้มหน้าคอม, Glassmorphism หนัก ๆ, Gradient ม่วงฟ้า, Card
ทุกอย่างหน้าตาเหมือนกัน หรือ Emoji เป็นไอคอนหลัก

------------------------------------------------------------------------

## 4. Design Principle --- หน้าตาต้องไม่เหมือน AI Template

1.  **Asymmetric composition:** ไม่จัดทุกอย่างเป็น Grid 3 คอลัมน์เท่ากันตลอดเวลา
2.  **Strong hierarchy:** มีจุดเด่นหลักหนึ่งจุดในแต่ละหน้าจอ
3.  **Editorial spacing:** ใช้พื้นที่ว่างเพื่อสร้างจังหวะ ไม่อัด Card เต็มหน้าจอ
4.  **Custom components:** ออกแบบ Mission Card, Progress Map, XP Meter,
    Badge และ Challenge Panel ให้มีเอกลักษณ์เฉพาะ
5.  **Meaningful motion:** Animation ต้องสื่อสถานะ เช่น ปลดล็อกด่าน ได้ XP
    หรือเชื่อมเส้นทาง ไม่ใช่ขยับเพื่อความสวย
6.  **Functional first:** ลูกเล่นต้องไม่ทำให้การเข้าเรียน ส่งงาน หรือดูคะแนนช้าลง
7.  **No fake interface:**
    ห้ามสร้างปุ่มหรือกราฟที่ดูเหมือนใช้งานได้แต่ไม่มีการทำงานจริง

------------------------------------------------------------------------

## 5. Information Architecture

ออกแบบโครงสร้างหลักดังนี้

### Student Area

1.  **Home / Mission Control**
    -   ทักทายผู้เรียนและแสดงชื่อ/Avatar
    -   ภารกิจที่ควรทำต่อ (Continue Learning)
    -   แสดง Level, XP และความคืบหน้าภาพรวม
    -   งานที่ใกล้ครบกำหนด
    -   Personal Best หรือความสำเร็จล่าสุด
    -   ไม่เน้นอันดับแข่งขันเป็นองค์ประกอบหลัก
2.  **Learning Worlds / Learning Map**
    -   แสดงเส้นทางการเรียนเป็นแผนที่ ไม่ใช่รายการ Card ทั่วไป
    -   ตัวอย่าง World:
        -   World 01 --- Logic & Algorithm
        -   World 02 --- Python Quest
        -   World 03 --- Network & Systems
        -   World 04 --- Cyber Defense
        -   World 05 --- Data & AI Lab
    -   แสดงสถานะ Locked / Available / In Progress / Completed
    -   มีเส้นเชื่อมและจุดปลดล็อกที่เข้าใจง่าย
    -   ครูสามารถกำหนดให้เปิดหรือปิด Module ได้
3.  **Module Detail**
    -   เป้าหมายการเรียนรู้
    -   สิ่งที่จะได้ฝึก
    -   ระดับความยากและเวลาประมาณการ
    -   รายการ Challenge และเงื่อนไขปลดล็อก
    -   Progress ของผู้เรียนใน Module
4.  **Challenge Workspace**
    -   พื้นที่ทำภารกิจต้องเด่นที่สุด
    -   แสดงโจทย์และคำใบ้แบบเป็นขั้น
    -   มี Interactive Canvas ตามประเภทโจทย์
    -   มี Run / Check / Reset / Hint ที่แยกหน้าที่ชัดเจน
    -   Feedback ต้องบอกว่าผิดตรงไหนและควรคิดต่ออย่างไร ไม่เฉลยทันที
    -   มีสถานะบันทึก Draft และรองรับการเชื่อมต่อกลับเมื่ออินเทอร์เน็ตหลุด
    -   หลังผ่านภารกิจแสดงผลลัพธ์ ดาว XP และคำถามยืนยันความเข้าใจ
5.  **My Portfolio**
    -   ความคืบหน้าแยกตาม Module
    -   ดาวและคะแนนสูงสุดเทียบกับคะแนนล่าสุด
    -   ประวัติ Attempt และ Feedback
    -   Badges / Achievements
    -   แสดงพัฒนาการของตัวเองมากกว่าการเปรียบเทียบกับเพื่อน
6.  **Assignments**
    -   รายการงานที่ได้รับมอบหมาย
    -   สถานะและกำหนดส่ง
    -   ตัวกรองตามวิชา/Module/สถานะ

### Teacher Area

1.  **Teacher Overview**
    -   ภาพรวมแต่ละห้อง
    -   งานที่มอบหมายและอัตราการส่ง
    -   นักเรียนที่ต้องการความช่วยเหลือ
    -   สรุปคะแนนและความคืบหน้า
2.  **Class Heatmap**
    -   Matrix: นักเรียน × Challenge
    -   3 ดาว / ผ่าน / ติดขัด / ยังไม่ทำ
    -   ใช้สีร่วมกับ Icon หรือ Label เพื่อไม่พึ่งสีอย่างเดียว
    -   คลิกเพื่อ Drill-down รายบุคคล
3.  **Student Detail**
    -   คะแนนและ Attempt History
    -   เวลาที่ใช้และจำนวนครั้งที่ลอง
    -   Code Evolution / Playback Timeline
    -   Review Indicator สำหรับสัญญาณที่ควรตรวจสอบ โดยไม่ตัดสินว่าโกงอัตโนมัติ
4.  **Gradebook & Export**
    -   คะแนนตามภาคเรียนและห้อง
    -   Weighted Grading / Rubric
    -   Export CSV/XLSX เรียงตามเลขที่นักเรียน

### Admin Area

-   จัดการปีการศึกษาและภาคเรียน
-   จัดการห้องเรียนและรายชื่อนักเรียน
-   จัดการสิทธิ์ Student / Teacher / Admin
-   จัดการ Module Registry และการเปิดใช้งาน Module
-   ตั้งค่าระบบพื้นฐาน

------------------------------------------------------------------------

## 6. หน้าแรกนักเรียน --- Visual Composition ที่ต้องการ

ออกแบบ Desktop First แล้วปรับ Responsive

### Top Navigation

-   โลโก้/Wordmark BYTEBOUND
-   Navigation: Explore, Missions, My Progress
-   ตัวเลือกภาคเรียนหรือชั้นเรียนตามความเหมาะสม
-   XP และ Avatar อยู่ด้านขวา
-   Navigation ต้องกะทัดรัด ไม่เหมือน Admin Navbar

### Hero Section

สร้าง Hero ที่มีเอกลักษณ์: - Headline ใหญ่ เช่น "Your next idea starts here." -
คำโปรยไทย: "พื้นที่ทดลองความคิด ที่ทุก Bug คือจุดเริ่มต้นของการเรียนรู้" - มี Mission of
the Day เป็นจุดเด่น - ใช้ภาพกราฟิกแผนที่/วงจร/พิกัดที่สร้างขึ้นเฉพาะ ไม่ใช้ภาพ stock -
วางองค์ประกอบแบบ Asymmetric และมีหมายเลข/Label ประกอบ

### Continue Your Journey

-   แสดง Module ที่กำลังเรียน
-   Progress เป็นเส้นทางหรือแถบสถานะที่มีเอกลักษณ์
-   ปุ่ม Continue ที่เด่นและเห็นชัด

### Explore Worlds

-   แสดง World เป็นพื้นที่/สถานี/โซนที่มีเอกลักษณ์แตกต่างกัน
-   ใช้สี Accent ที่มีระบบ
-   ไม่ใช้ Card แบบสำเร็จรูปเหมือนกันทุกใบ
-   แสดงจำนวน Mission และสถานะการปลดล็อก

### Personal Progress

-   XP / Level / Stars / Streak
-   แสดงความก้าวหน้าส่วนตัวโดยไม่ทำให้รู้สึกแข่งขันกดดัน
-   ใช้ Visualization ที่อ่านง่ายและมีประโยชน์จริง

------------------------------------------------------------------------

## 7. Challenge UX แยกตามระดับชั้น

ออกแบบระบบ Challenge ให้รองรับเนื้อหาและความยากที่ต่างกัน

### ม.1 --- Discover

-   Block-to-Code Puzzle
-   Parsons Problem
-   Binary & Pixel Art
-   Maze: Loop / Condition
-   UI ควรมีคำแนะนำชัด ปุ่มใหญ่ และ Feedback ทันที

### ม.2 --- Experiment

-   Sorting & Searching Race
-   Logic Gate Lab
-   Packet Routing Puzzle
-   UI ควรเปิดพื้นที่ให้ทดลอง เปรียบเทียบ และเห็นผลลัพธ์เป็นภาพ

### ม.3 --- Build & Defend

-   Python Data & Mini-App
-   Cyber Escape Room
-   AI / Teachable Classifier Mini-Lab
-   UI ควรให้ความรู้สึกเหมือน Workshop / Lab ที่จริงจังขึ้น

ระดับชั้นที่สูงขึ้นควรมีความซับซ้อนของเครื่องมือเพิ่มขึ้นอย่างค่อยเป็นค่อยไป แต่ยังใช้ Design
System เดียวกัน

------------------------------------------------------------------------

## 8. Gamification System

ใช้ Gamification เพื่อสนับสนุนการเรียน ไม่ใช่ทำให้เป็นเกมแข่งอันดับอย่างเดียว

-   XP: ได้จากการทำภารกิจและความพยายาม
-   Level: แสดงความก้าวหน้าระยะยาว
-   3-Star Mastery:
    -   1 ดาว: ผ่านเกณฑ์ขั้นต่ำ
    -   2 ดาว: ผ่านเงื่อนไขเวลา/จำนวนก้าว
    -   3 ดาว: แสดงความเข้าใจหรือวิธีแก้ที่มีประสิทธิภาพ
-   Badges:
    -   Bug Hunter
    -   Zero Hint Master
    -   7-Day Streak
    -   Team Helper
-   Personal Best: เปรียบเทียบกับผลงานเดิมของตัวเอง
-   Class Progress: แสดงความคืบหน้ารวมของห้อง
-   Leaderboard ถ้ามี ให้แสดง Top 10 หรือ Tier League เท่านั้น
    หลีกเลี่ยงการเปิดเผยอันดับท้าย ๆ

Animation ที่ควรมี: - XP เพิ่มขึ้นอย่างนุ่มนวล - ดาวปรากฏเมื่อผ่านเงื่อนไข -
เส้นทางไปยังด่านถัดไปถูกปลดล็อก - Badge ได้รับการประทับตรา - มี Reduced Motion
mode

------------------------------------------------------------------------

## 9. Login Experience

-   ใช้หน้า Login ที่เรียบง่าย มีบุคลิกต่อเนื่องกับหน้าเว็บ
-   ปุ่ม "เข้าสู่ระบบด้วยบัญชี Google โรงเรียน"
-   แสดงข้อความว่าใช้บัญชี `@pccpl.ac.th`
-   ไม่ต้องมีฟอร์มสมัครสมาชิกทั่วไป หากระบบใช้ Google Workspace SSO
-   แยกหน้าตา/ทางเข้าของนักเรียน ครู และผู้ดูแลตามสิทธิ์หลัง Login
-   ห้ามออกแบบให้ผู้ใช้เข้าใจผิดว่า Login สำเร็จโดยยังไม่ได้เชื่อมระบบจริง

------------------------------------------------------------------------

## 10. Responsive & Classroom UX

### Desktop

-   ใช้พื้นที่กว้างให้เกิดประโยชน์
-   Challenge Workspace อาจแบ่งเป็นโจทย์ / พื้นที่ทดลอง / ผลลัพธ์
-   ตารางครูต้องอ่านง่ายและเลื่อนในแนวนอนได้เมื่อจำเป็น

### Tablet

-   ลดจำนวนคอลัมน์
-   รักษาพื้นที่ Interactive Canvas
-   Navigation ปรับเป็นรูปแบบที่แตะง่าย

### Mobile

-   ใช้ Single Column
-   ปุ่มหลักมีขนาดเหมาะกับนิ้ว
-   ไม่ซ่อน Action สำคัญไว้ใน Hover
-   Challenge ที่ซับซ้อนต้องมี Layout ที่ใช้งานได้จริง ไม่ใช่แค่ย่อ Desktop ลงมา

### Performance

-   ให้ความสำคัญกับโหลดเร็วบน Wi-Fi โรงเรียน
-   ใช้ SVG / WebP / AVIF และหลีกเลี่ยงวิดีโอพื้นหลังขนาดใหญ่
-   Animation ใช้ CSS/Canvas อย่างพอดี
-   โหลด Module แบบ Lazy Load
-   Interactive Logic ควรรันฝั่ง Browser เป็นหลัก
-   มี Low-bandwidth / Offline-tolerant states
-   หลีกเลี่ยงเอฟเฟกต์ที่ใช้ GPU หนักโดยไม่จำเป็น

------------------------------------------------------------------------

## 11. Accessibility & Content Design

-   Contrast ต้องอ่านได้ชัด
-   ใช้สีร่วมกับข้อความหรือ Icon เพื่อบอกสถานะ
-   รองรับ Keyboard Navigation และ Focus State
-   มี Label ที่ชัดเจนสำหรับ Input
-   ไม่ใช้ข้อความเล็กเกินไป
-   ใช้ภาษาที่เหมาะกับนักเรียน ม.1--ม.3
-   Error Message ต้องสุภาพและแนะนำวิธีแก้
-   หลีกเลี่ยงการใช้คำว่า "ล้มเหลว" กับผู้เรียน ใช้ "ลองอีกครั้ง" หรือ "ยังไม่ผ่านด่านนี้"
-   รองรับ Reduced Motion

------------------------------------------------------------------------

## 12. Component Direction

ออกแบบ Component ให้มีภาษาภาพเฉพาะ:

-   `MissionCard`: มี Mission ID, Difficulty, XP Reward, Status
    และภาพกราฟิกประจำภารกิจ
-   `WorldMap`: แผนที่เส้นทางบทเรียนพร้อม Node และ Unlock State
-   `XPBar`: แถบ XP ที่มีตัวเลขและ Animation
-   `LevelStamp`: ป้าย Level แบบตราประทับ
-   `MasteryStars`: ดาว 0--3 ดวง พร้อมคำอธิบายเกณฑ์
-   `BadgeTile`: เหรียญความสำเร็จแบบ Collectible
-   `ChallengePanel`: พื้นที่โจทย์และ Hint
-   `CodeWorkspace`: Editor / Blockly / Parsons / Output ตามชนิด Module
-   `AttemptTimeline`: ลำดับการลองและผลลัพธ์
-   `ClassHeatmap`: ตารางสถานะห้องเรียน
-   `TeacherInsight`: สรุปนักเรียนหรือด่านที่ต้องติดตาม
-   `EmptyState`: มีข้อความและ Action ที่ช่วยให้เริ่มต้นได้
-   `OfflineStatus`: บอกสถานะ Draft / Syncing / Saved / Offline

อย่าใช้ Component ทุกตัวเป็น Card ขอบมนเงาเหมือนกันทั้งหมด
ต้องมีความหลากหลายด้านโครงสร้าง แต่คง Design Token ร่วมกัน

------------------------------------------------------------------------

## 13. Technical Constraints --- ห้ามขัดกับแผนระบบ

การออกแบบ UI ต้องสอดคล้องกับข้อกำหนดใน Project Plan:

-   กลุ่มผู้ใช้: นักเรียน ม.1--ม.3 และครู
-   Login: Google Workspace `@pccpl.ac.th`
-   Roles: Student / Teacher / Admin
-   Server: Raspberry Pi 5 ARM64, RAM 16 GB, NVMe SSD 256 GB, Nginx
-   เป้าหมายการใช้งาน: ประมาณ 25 คนต่อห้อง และรองรับการออกแบบถึง 150
    Concurrent Users
-   Tech Stack ที่พิจารณา: Next.js + TypeScript + Tailwind CSS หรือ
    SvelteKit หรือ React + FastAPI
-   Database: PostgreSQL 16/17
-   Valkey/Redis เป็นส่วนเสริมสำหรับ Session, Cache และ Leaderboard
-   Interactive Logic ทำงานฝั่ง Browser เป็นหลัก
-   รองรับ Module ใหม่ผ่าน Core Platform + Standard Module Contract
-   เก็บคะแนนและ Submission แยกตามปีการศึกษา/ภาคเรียน
-   รองรับ CSV/XLSX Export สำหรับครู
-   Responsive และ Offline-tolerant
-   คำนึงถึง PDPA และการแสดงข้อมูลนักเรียนตามสิทธิ์

**ข้อสำคัญ:** อย่าคิดค้น Feature ที่ต้องใช้ Backend หนักโดยไม่จำเป็น และอย่าออกแบบ UI
ที่บังคับให้ต้องโหลดภาพหรือ Animation ขนาดใหญ่ทุกหน้า

------------------------------------------------------------------------

## 14. Output ที่ต้องส่งมอบจาก AI UI Builder

ให้ทำงานตามลำดับนี้:

### Step 1 --- Define the Visual System

ส่ง: - Mood & Art Direction - Color Tokens - Typography Scale - Spacing /
Radius / Border / Shadow - Icon Style - Motion Principles - Light/Dark
Theme

### Step 2 --- Design Key Screens

ออกแบบอย่างน้อย: 1. Student Login 2. Student Home / Mission Control 3.
Learning Worlds Map 4. Module Detail 5. Challenge Workspace 6. Student
Portfolio 7. Teacher Overview 8. Teacher Class Heatmap 9. Student Detail
/ Attempt Timeline 10. Admin Module Management

### Step 3 --- Build a Consistent Design System

สร้าง Components และ States: - Default / Hover / Focus / Active /
Disabled - Loading / Empty / Error / Success / Offline - Locked / In
Progress / Completed

### Step 4 --- Prototype the Core Journey

ทำ Flow ให้คลิกได้จริง: 1. Login 2. เข้าหน้า Mission Control 3. เลือก World 4.
เปิด Module 5. เข้า Challenge 6. ทดลองทำและกดตรวจ 7. ผ่านด่านและรับ XP/Stars
8. กลับไปดู Portfolio

### Step 5 --- Responsive QA

ตรวจอย่างน้อยที่ความกว้าง: - Mobile: 390px - Tablet: 768px - Desktop: 1440px

------------------------------------------------------------------------

## 15. Quality Gate --- เกณฑ์ตัดสินว่างานผ่านหรือไม่

ก่อนส่งงาน ให้ตรวจตัวเองด้วยคำถามเหล่านี้:

-   [ ] เห็นหน้าแรกแล้วรู้สึกว่าเป็นผลิตภัณฑ์เฉพาะ ไม่ใช่ Template สำเร็จรูปหรือไม่?
-   [ ] มี Visual Signature ที่จำได้ เช่น World Map, Mission ID, Technical
    Labels หรือไม่?
-   [ ] นักเรียน ม.1 เข้าใจว่าจะเริ่มตรงไหนหรือไม่?
-   [ ] นักเรียน ม.3 ยังรู้สึกว่า UI มีความเท่และไม่เด็กเกินไปหรือไม่?
-   [ ] ครูดูคะแนนและหานักเรียนที่ต้องช่วยได้เร็วหรือไม่?
-   [ ] ทุก Action สำคัญมีสถานะและ Feedback หรือไม่?
-   [ ] Mobile ใช้งานได้จริงหรือเพียงแค่ย่อ Desktop?
-   [ ] Animation มีเหตุผลและปิดได้หรือไม่?
-   [ ] หน้าเว็บโหลดเร็วและไม่พึ่ง Asset หนักเกินไปหรือไม่?
-   [ ] Design สอดคล้องกับระบบ Login, Role, Semester และ Module ตาม
    Project Plan หรือไม่?

**หากหน้าตายังดูเหมือน Admin Template, SaaS Dashboard ทั่วไป หรือเว็บที่สร้างจาก
Prompt มาตรฐาน ให้กลับไปปรับ Composition, Typography, Graphic Motifs และ
Custom Components ก่อนเริ่มเพิ่มลูกเล่น**

------------------------------------------------------------------------

## 16. Final Master Prompt (คัดลอกส่วนนี้ไปใช้ได้ทันที)

ออกแบบและพัฒนาเว็บไซต์แหล่งเรียนรู้คอมพิวเตอร์และเทคโนโลยีสำหรับนักเรียน ม.1--ม.3
และครู โดยใช้ Creative Direction "BYTEBOUND --- Explore. Experiment.
Evolve." เว็บไซต์ต้องให้ความรู้สึกเหมือนโลกทดลองทางดิจิทัลที่นักเรียนสำรวจภารกิจ แก้ปัญหา
ทดลองเขียนโปรแกรม และสร้างทักษะของตนเอง

สร้าง Visual Identity ที่แตกต่างจาก AI-generated dashboard ทั่วไป ใช้แนว
Editorial Swiss-inspired layout ผสม Retro-futuristic computer lab และ
Playful technical graphics ใช้ Warm off-white, Deep charcoal, Electric
cobalt, Acid lime และ Signal orange เป็นชุดสีหลัก จัดองค์ประกอบแบบ Asymmetric
มี Typography ที่แข็งแรง มี Coordinate Grid, Node Map, Mission ID, Technical
Labels และ Custom Icons เป็น Visual Signature

ห้ามใช้ Gradient ม่วง-น้ำเงินแบบ SaaS, Glassmorphism หนัก ๆ, Card ซ้ำ ๆ ทุกส่วน,
ภาพ stock เด็กหน้าคอม, หุ่นยนต์การ์ตูนน่ารัก หรือ Emoji เป็นไอคอนหลัก ต้องออกแบบ
Mission Card, Learning World Map, XP Meter, Badge, Challenge Workspace
และ Teacher Heatmap ให้มีเอกลักษณ์เฉพาะ

สร้าง Student Experience ที่เริ่มจาก Mission Control, Learning Worlds, Module
Detail, Challenge Workspace, Portfolio และ Assignments รวมถึง Teacher
Experience สำหรับ Overview, Class Heatmap, Student Detail, Gradebook และ
Export และ Admin Experience สำหรับจัดการปีการศึกษา ภาคเรียน ห้องเรียน ผู้ใช้ และ
Module

Gamification ต้องสนับสนุนการเรียนรู้ด้วย XP, Level, 3-Star Mastery, Badges,
Personal Best และ Learning Path
โดยไม่ทำให้ผู้เรียนคะแนนน้อยรู้สึกถูกจัดอันดับหรืออับอาย รองรับ Challenge ที่เหมาะกับ ม.1
(Discover), ม.2 (Experiment), ม.3 (Build & Defend)

ทุกหน้าต้อง Responsive, Accessible, โหลดเร็วบน Wi-Fi โรงเรียน และคำนึงถึง
Raspberry Pi 5 โดยให้ Interactive Logic ทำงานบน Browser เป็นหลัก รองรับ
Google Workspace Login `@pccpl.ac.th`, Student/Teacher/Admin roles,
ภาคเรียน, คะแนน, Module Contract และ Offline-tolerant states ตาม Project
Plan

เริ่มจากสร้าง Design System ให้ชัดก่อน จากนั้นออกแบบ Key Screens และทำ Prototype
ของเส้นทางนักเรียนตั้งแต่ Login จนผ่าน Challenge และได้รับ XP พร้อมตรวจ Responsive
ที่ 390px, 768px และ 1440px

เป้าหมายสูงสุด: **เว็บไซต์ต้องดูเหมือน Digital Learning Product
ที่มีแบรนด์และบุคลิกของตัวเอง --- สนุกแบบวัยรุ่น เท่แบบห้องทดลอง
และใช้งานจริงได้ในห้องเรียน**
อย่าเลือกความสวยแบบสำเร็จรูปเหนือความชัดเจนและประสิทธิภาพ
