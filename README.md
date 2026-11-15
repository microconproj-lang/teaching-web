# teaching-web

แหล่งเรียนรู้คอมพิวเตอร์และเทคโนโลยี (ระดับชั้น ม.1 – ม.3) บน Raspberry Pi 5 + Nginx + PostgreSQL 16 (Next.js + Drizzle ORM)

## เอกสารออกแบบระบบ
- [แผนการพัฒนาภาพรวม (PROJECT_PLAN.md)](./PROJECT_PLAN.md)
- [สคีมาฐานข้อมูล PostgreSQL (docs/DATABASE_SCHEMA.sql)](./docs/DATABASE_SCHEMA.sql)
- [Tech Stack, โครงสร้างโปรเจกต์ และวิธีจำลองบน Windows (docs/TECH_STACK_AND_STRUCTURE.md)](./docs/TECH_STACK_AND_STRUCTURE.md)

## การรันทดสอบบน Windows (Local Development)

1. คัดลอกไฟล์สภาพแวดล้อม:
   ```powershell
   Copy-Item .env.example .env
   ```
2. ติดตั้ง Dependencies และรันเซิร์ฟเวอร์พัฒนา:
   ```powershell
   npm install
   npm run dev
   ```
   > แม้ยังไม่ได้เปิด PostgreSQL ก็สามารถเปิด `http://localhost:3000` และเข้า `/learn/demo` เพื่อทดลองเล่น Module ตัวอย่างได้ทันที
3. เมื่อติดตั้ง Docker Desktop แล้ว ให้เปิด PostgreSQL + Nginx จำลอง Pi 5:
   ```powershell
   docker compose --env-file .env -f docker/docker-compose.yml up -d postgres
   npm run db:seed
   ```
   หรือรันทั้งระบบ (`postgres` + `app` + `nginx`) บนพอร์ต 80:
   ```powershell
   docker compose --env-file .env -f docker/docker-compose.yml up -d --build
   ```
