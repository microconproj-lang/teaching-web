import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/core/db";
import { academicYears, auditLogs, semesters } from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as {
    yearBe?: number;
    termNo?: 1 | 2 | 3;
    startsOn?: string;
    endsOn?: string;
    setAsCurrent?: boolean;
  } | null;

  if (!body?.yearBe || !body?.termNo || !body?.startsOn || !body?.endsOn) {
    return NextResponse.json({ error: "กรุณากรอกปีการศึกษา ภาคเรียน วันเริ่มต้น และวันสิ้นสุด" }, { status: 400 });
  }

  if (body.endsOn <= body.startsOn) {
    return NextResponse.json({ error: "วันสิ้นสุดต้องมากกว่าวันเริ่มต้น" }, { status: 400 });
  }

  try {
    const result = await db.transaction(async (tx) => {
      let [year] = await tx
        .select()
        .from(academicYears)
        .where(eq(academicYears.yearBe, body.yearBe!))
        .limit(1);

      if (!year) {
        if (body.setAsCurrent) {
          await tx.update(academicYears).set({ isCurrent: false }).where(eq(academicYears.isCurrent, true));
        }
        [year] = await tx
          .insert(academicYears)
          .values({
            yearBe: body.yearBe!,
            label: `ปีการศึกษา ${body.yearBe}`,
            startsOn: body.startsOn!,
            endsOn: body.endsOn!,
            isCurrent: Boolean(body.setAsCurrent),
          })
          .returning();
      }

      if (body.setAsCurrent) {
        await tx.update(semesters).set({ isCurrent: false }).where(eq(semesters.isCurrent, true));
        await tx.update(academicYears).set({ isCurrent: false }).where(eq(academicYears.isCurrent, true));
        await tx.update(academicYears).set({ isCurrent: true }).where(eq(academicYears.id, year.id));
      }

      const [createdSem] = await tx
        .insert(semesters)
        .values({
          academicYearId: year.id,
          termNo: body.termNo!,
          label: `ภาคเรียนที่ ${body.termNo}/${body.yearBe}`,
          startsOn: body.startsOn!,
          endsOn: body.endsOn!,
          isCurrent: Boolean(body.setAsCurrent),
          isLocked: false,
        })
        .returning();

      await tx.insert(auditLogs).values({
        actorId: session.userId,
        action: "semester.create",
        targetType: "semester",
        targetId: createdSem.id,
        payload: { yearBe: body.yearBe, termNo: body.termNo, setAsCurrent: Boolean(body.setAsCurrent) },
      });

      return createdSem;
    });

    return NextResponse.json({ ok: true, semester: result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "ไม่สามารถสร้างภาคเรียนได้" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as {
    semesterId?: string;
    setCurrent?: boolean;
    isLocked?: boolean;
  } | null;

  if (!body?.semesterId) {
    return NextResponse.json({ error: "กรุณาระบุ semesterId" }, { status: 400 });
  }

  const updated = await db.transaction(async (tx) => {
    const [target] = await tx
      .select()
      .from(semesters)
      .where(eq(semesters.id, body.semesterId!))
      .limit(1);

    if (!target) return null;

    if (body.setCurrent) {
      await tx.update(semesters).set({ isCurrent: false }).where(eq(semesters.isCurrent, true));
      await tx.update(academicYears).set({ isCurrent: false }).where(eq(academicYears.isCurrent, true));
      await tx
        .update(academicYears)
        .set({ isCurrent: true })
        .where(eq(academicYears.id, target.academicYearId));
    }

    const [row] = await tx
      .update(semesters)
      .set({
        ...(body.setCurrent ? { isCurrent: true } : {}),
        ...(typeof body.isLocked === "boolean" ? { isLocked: body.isLocked } : {}),
      })
      .where(eq(semesters.id, target.id))
      .returning();

    await tx.insert(auditLogs).values({
      actorId: session.userId,
      action: body.setCurrent ? "semester.set_current" : "semester.toggle_lock",
      targetType: "semester",
      targetId: target.id,
      payload: { setCurrent: body.setCurrent, isLocked: body.isLocked },
    });

    return row;
  });

  if (!updated) {
    return NextResponse.json({ error: "ไม่พบภาคเรียนที่ระบุ" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, semester: updated });
}

