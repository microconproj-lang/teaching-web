import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/core/db";
import { auditLogs, moduleAssignments } from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ assignmentId: string }> }
) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "teacher" && session.role !== "admin")) {
    return NextResponse.json({ error: "เฉพาะครูผู้สอนหรือแอดมินเท่านั้น" }, { status: 403 });
  }

  const { assignmentId } = await context.params;
  const body = (await req.json().catch(() => null)) as {
    isPublished?: boolean;
    focusMode?: boolean;
    disablePaste?: boolean;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const updates: Partial<typeof moduleAssignments.$inferInsert> = {};
  if (typeof body.isPublished === "boolean") updates.isPublished = body.isPublished;
  if (typeof body.focusMode === "boolean") updates.focusMode = body.focusMode;
  if (typeof body.disablePaste === "boolean") updates.disablePaste = body.disablePaste;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "ไม่มีค่าที่ต้องการแก้ไข" }, { status: 400 });
  }

  const [updated] = await db
    .update(moduleAssignments)
    .set(updates)
    .where(eq(moduleAssignments.id, assignmentId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "ไม่พบงานมอบหมาย" }, { status: 404 });
  }

  await db.insert(auditLogs).values({
    actorId: session.userId,
    action: "assignment.update_settings",
    targetType: "module_assignment",
    targetId: assignmentId,
    payload: updates,
  });

  return NextResponse.json({ ok: true, assignment: updated });
}

