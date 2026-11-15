import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, isDatabaseReachable } from "@/core/db";
import { studentInventory, studentPets, users } from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { EDITOR_THEMES, PROFILE_FRAMES } from "@/core/config/shop";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  const body = (await req.json().catch(() => null)) as {
    kind?: "theme" | "frame" | "effect" | "habitat";
    itemKey?: string;
  } | null;

  if (!body?.kind || !body?.itemKey) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  if (!session || !(await isDatabaseReachable())) {
    return NextResponse.json({ ok: true, localMode: true });
  }

  const isFreeDefault =
    (body.kind === "theme" && EDITOR_THEMES.some((t) => t.key === body.itemKey && t.price === 0)) ||
    (body.kind === "frame" && PROFILE_FRAMES.some((f) => f.key === body.itemKey && f.price === 0)) ||
    body.itemKey === "confetti" ||
    body.itemKey === "habitat-desk";

  if (!isFreeDefault) {
    const owned = await db
      .select({ itemKey: studentInventory.itemKey })
      .from(studentInventory)
      .where(and(eq(studentInventory.studentId, session.userId), eq(studentInventory.itemKey, body.itemKey)))
      .limit(1);
    if (owned.length === 0) {
      return NextResponse.json({ error: "กรุณาซื้อไอเทมนี้ก่อนสวมใส่" }, { status: 403 });
    }
  }

  if (body.kind === "theme") {
    await db
      .update(users)
      .set({ equippedThemeKey: body.itemKey, updatedAt: new Date() })
      .where(eq(users.id, session.userId));
  } else if (body.kind === "frame") {
    await db
      .update(users)
      .set({ equippedFrameKey: body.itemKey, updatedAt: new Date() })
      .where(eq(users.id, session.userId));
  } else if (body.kind === "effect") {
    await db
      .update(users)
      .set({ equippedEffectKey: body.itemKey, updatedAt: new Date() })
      .where(eq(users.id, session.userId));
  } else if (body.kind === "habitat") {
    await db
      .update(studentPets)
      .set({ habitatKey: body.itemKey, updatedAt: new Date() })
      .where(and(eq(studentPets.studentId, session.userId), eq(studentPets.isActive, true)));
  }

  return NextResponse.json({ ok: true });
}

