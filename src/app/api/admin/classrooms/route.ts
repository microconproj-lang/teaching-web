import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/db";
import { classrooms } from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as {
    academicYearId?: string;
    gradeLevel?: number;
    roomNo?: number;
  } | null;

  if (
    !body?.academicYearId ||
    !body.gradeLevel ||
    ![1, 2, 3].includes(body.gradeLevel) ||
    !body.roomNo ||
    body.roomNo < 1
  ) {
    return NextResponse.json({ error: "ข้อมูลห้องเรียนไม่ถูกต้อง (ชั้น 1–3 และเลขห้อง > 0)" }, { status: 400 });
  }

  try {
    const [created] = await db
      .insert(classrooms)
      .values({
        academicYearId: body.academicYearId,
        gradeLevel: body.gradeLevel,
        roomNo: body.roomNo,
        name: `ม.${body.gradeLevel}/${body.roomNo}`,
      })
      .returning();

    return NextResponse.json({ ok: true, classroom: created });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "ไม่สามารถสร้างห้องเรียนได้ (อาจมีห้องนี้อยู่แล้ว)" },
      { status: 400 }
    );
  }
}

