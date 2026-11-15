import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/core/db";
import { auditLogs, classrooms, enrollments, users } from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { getAllowedGoogleDomain } from "@/core/auth/google";

/**
 * นำเข้ารายชื่อนักเรียนจาก CSV รูปแบบ: เลขที่,ชื่อ-สกุล,อีเมล(@pccpl.ac.th)
 */
export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as {
    classroomId?: string;
    csvText?: string;
  } | null;

  if (!body?.classroomId || !body?.csvText?.trim()) {
    return NextResponse.json({ error: "กรุณาเลือกห้องเรียนและวางข้อมูล CSV" }, { status: 400 });
  }

  const [room] = await db
    .select()
    .from(classrooms)
    .where(eq(classrooms.id, body.classroomId))
    .limit(1);

  if (!room) {
    return NextResponse.json({ error: "ไม่พบห้องเรียนที่เลือก" }, { status: 404 });
  }

  const allowedDomain = getAllowedGoogleDomain();
  const lines = body.csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const parsedRows: { studentNumber: number; fullName: string; email: string }[] = [];
  const errors: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // ข้ามแถวหัวตารางถ้ามีคำว่า email หรือ เลขที่
    if (i === 0 && /email|เลขที่|student_number/i.test(line)) continue;

    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    if (cols.length < 3) {
      errors.push(`บรรทัดที่ ${i + 1}: ต้องมี 3 คอลัมน์ (เลขที่,ชื่อ-สกุล,อีเมล)`);
      continue;
    }

    const num = Number(cols[0]);
    const fullName = cols[1];
    const email = cols[2].toLowerCase();

    if (!Number.isInteger(num) || num <= 0) {
      errors.push(`บรรทัดที่ ${i + 1}: เลขที่ไม่ถูกต้อง (${cols[0]})`);
      continue;
    }
    if (!fullName) {
      errors.push(`บรรทัดที่ ${i + 1}: ไม่มีชื่อ-สกุล`);
      continue;
    }
    if (!email.endsWith(`@${allowedDomain}`)) {
      errors.push(`บรรทัดที่ ${i + 1}: อีเมล ${email} ต้องเป็นโดเมน @${allowedDomain}`);
      continue;
    }

    parsedRows.push({ studentNumber: num, fullName, email });
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.slice(0, 5).join(" | "), errors }, { status: 400 });
  }

  if (parsedRows.length === 0) {
    return NextResponse.json({ error: "ไม่พบข้อมูลนักเรียนที่นำเข้าได้" }, { status: 400 });
  }

  const importedCount = await db.transaction(async (tx) => {
    let count = 0;
    for (const item of parsedRows) {
      let [student] = await tx.select().from(users).where(eq(users.email, item.email)).limit(1);
      if (!student) {
        [student] = await tx
          .insert(users)
          .values({
            email: item.email,
            fullName: item.fullName,
            displayName: item.fullName.split(" ")[0] ?? item.fullName,
            role: "student",
          })
          .returning();
      }

      const [existingEnrollment] = await tx
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.studentId, student.id),
            eq(enrollments.academicYearId, room.academicYearId)
          )
        )
        .limit(1);

      if (existingEnrollment) {
        await tx
          .update(enrollments)
          .set({
            classroomId: room.id,
            studentNumber: item.studentNumber,
            status: "active",
          })
          .where(eq(enrollments.id, existingEnrollment.id));
      } else {
        await tx.insert(enrollments).values({
          studentId: student.id,
          academicYearId: room.academicYearId,
          classroomId: room.id,
          studentNumber: item.studentNumber,
          status: "active",
        });
      }
      count++;
    }

    await tx.insert(auditLogs).values({
      actorId: session.userId,
      action: "students.import_csv",
      targetType: "classroom",
      targetId: room.id,
      payload: { roomName: room.name, count },
    });

    return count;
  });

  return NextResponse.json({ ok: true, importedCount, roomName: room.name });
}

