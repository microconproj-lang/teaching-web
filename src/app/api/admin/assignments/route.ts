import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/core/db";
import { moduleAssignments, modules } from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "admin" && session.role !== "teacher")) {
    return NextResponse.json({ error: "เฉพาะครูหรือแอดมินเท่านั้น" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as {
    semesterId?: string;
    classroomId?: string;
    moduleKey?: string;
    weightPercent?: number;
    isPublished?: boolean;
    disablePaste?: boolean;
    focusMode?: boolean;
  } | null;

  if (!body?.semesterId || !body?.classroomId || !body?.moduleKey) {
    return NextResponse.json({ error: "กรุณาระบุภาคเรียน ห้องเรียน และ Module" }, { status: 400 });
  }

  const [mod] = await db
    .select()
    .from(modules)
    .where(eq(modules.moduleKey, body.moduleKey))
    .limit(1);

  if (!mod) {
    return NextResponse.json({ error: `ไม่พบ Module ${body.moduleKey} ในฐานข้อมูล` }, { status: 404 });
  }

  try {
    const [created] = await db
      .insert(moduleAssignments)
      .values({
        semesterId: body.semesterId,
        classroomId: body.classroomId,
        moduleId: mod.id,
        weightPercent: Number(body.weightPercent ?? 10).toFixed(2),
        isPublished: body.isPublished ?? true,
        disablePaste: body.disablePaste ?? true,
        focusMode: body.focusMode ?? false,
        createdBy: session.userId,
      })
      .returning();

    return NextResponse.json({ ok: true, assignment: created });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "มอบหมายงานไม่สำเร็จ (ห้องนี้อาจมี Module นี้ในเทอมนี้แล้ว)" },
      { status: 400 }
    );
  }
}

