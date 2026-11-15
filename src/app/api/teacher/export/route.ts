import { NextRequest, NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/core/db";
import {
  classrooms,
  enrollments,
  moduleAssignments,
  studentChallengeProgress,
  users,
} from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { buildCsvWithBom } from "@/core/grading/csv-export";

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "teacher" && session.role !== "admin")) {
    return NextResponse.json({ error: "เฉพาะครูผู้สอนหรือผู้ดูแลระบบเท่านั้น" }, { status: 403 });
  }

  const assignmentId = req.nextUrl.searchParams.get("assignmentId");
  if (!assignmentId) {
    return NextResponse.json({ error: "กรุณาระบุ assignmentId" }, { status: 400 });
  }

  const [assignment] = await db
    .select({
      id: moduleAssignments.id,
      classroomId: moduleAssignments.classroomId,
      roomName: classrooms.name,
    })
    .from(moduleAssignments)
    .innerJoin(classrooms, eq(moduleAssignments.classroomId, classrooms.id))
    .where(eq(moduleAssignments.id, assignmentId))
    .limit(1);

  if (!assignment) {
    return NextResponse.json({ error: "ไม่พบงานที่ระบุ" }, { status: 404 });
  }

  const roster = await db
    .select({
      studentId: users.id,
      studentNumber: enrollments.studentNumber,
      fullName: users.fullName,
      email: users.email,
    })
    .from(enrollments)
    .innerJoin(users, eq(enrollments.studentId, users.id))
    .where(and(eq(enrollments.classroomId, assignment.classroomId), eq(enrollments.status, "active")))
    .orderBy(asc(enrollments.studentNumber));

  const progressRows = await db
    .select()
    .from(studentChallengeProgress)
    .where(eq(studentChallengeProgress.assignmentId, assignment.id));

  const byStudent = new Map<
    string,
    { totalScore: number; totalStars: number; passedCount: number; flagged: boolean }
  >();

  for (const row of progressRows) {
    const current = byStudent.get(row.studentId) ?? {
      totalScore: 0,
      totalStars: 0,
      passedCount: 0,
      flagged: false,
    };
    current.totalScore += Number(row.bestScore);
    current.totalStars += row.bestStars;
    if (row.passed) current.passedCount += 1;
    if (row.hasReviewFlag) current.flagged = true;
    byStudent.set(row.studentId, current);
  }

  const headers = ["เลขที่", "ชื่อ-สกุล", "อีเมล", "คะแนนรวม", "ดาวรวม", "จำนวนด่านที่ผ่าน", "สถานะตรวจสอบ"];
  const rows = roster.map((s) => {
    const stat = byStudent.get(s.studentId);
    return [
      s.studentNumber,
      s.fullName,
      s.email,
      stat ? stat.totalScore.toFixed(2) : "0.00",
      stat ? stat.totalStars : 0,
      stat ? stat.passedCount : 0,
      stat?.flagged ? "ควรสุ่มตรวจ" : "ปกติ",
    ];
  });

  const csv = buildCsvWithBom(headers, rows);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="grades-${encodeURIComponent(assignment.roomName)}.csv"`,
    },
  });
}

