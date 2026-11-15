import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, isDatabaseReachable } from "@/core/db";
import { studentInventory, studentPets } from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  const body = (await req.json().catch(() => null)) as {
    action?: "feed" | "play" | "rename" | "setActive";
    petId?: string;
    foodKey?: string;
    nickname?: string;
  } | null;

  if (!body?.action || !body?.petId) {
    return NextResponse.json({ error: "คำสั่งไม่ถูกต้อง" }, { status: 400 });
  }

  if (!session || !(await isDatabaseReachable())) {
    return NextResponse.json({ ok: true, localMode: true });
  }

  const [pet] = await db
    .select()
    .from(studentPets)
    .where(and(eq(studentPets.id, body.petId), eq(studentPets.studentId, session.userId)))
    .limit(1);

  if (!pet) {
    return NextResponse.json({ error: "ไม่พบสัตว์เลี้ยง" }, { status: 404 });
  }

  if (body.action === "setActive") {
    await db.update(studentPets).set({ isActive: false }).where(eq(studentPets.studentId, session.userId));
    await db
      .update(studentPets)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(studentPets.id, pet.id));
    return NextResponse.json({ ok: true });
  }

  if (body.action === "rename") {
    const clean = (body.nickname ?? "").trim();
    if (clean.length < 1 || clean.length > 20) {
      return NextResponse.json({ error: "ชื่อสัตว์เลี้ยงต้องยาว 1–20 ตัวอักษร" }, { status: 400 });
    }
    await db
      .update(studentPets)
      .set({ nickname: clean, updatedAt: new Date() })
      .where(eq(studentPets.id, pet.id));
    return NextResponse.json({ ok: true });
  }

  if (body.action === "play") {
    await db
      .update(studentPets)
      .set({
        closeness: Math.min(100, pet.closeness + 8),
        growthXp: pet.growthXp + 10,
        hunger: Math.max(0, pet.hunger - 4),
        updatedAt: new Date(),
      })
      .where(eq(studentPets.id, pet.id));
    return NextResponse.json({ ok: true });
  }

  if (body.action === "feed") {
    const foodKey = body.foodKey ?? "food-cookie";
    const [inv] = await db
      .select()
      .from(studentInventory)
      .where(and(eq(studentInventory.studentId, session.userId), eq(studentInventory.itemKey, foodKey)))
      .limit(1);

    if (!inv || inv.quantity <= 0) {
      return NextResponse.json({ error: "ไม่มีอาหารชนิดนี้ในคลัง กรุณาซื้อที่ร้านคุณเหมียว" }, { status: 400 });
    }

    if (inv.quantity === 1) {
      await db
        .delete(studentInventory)
        .where(and(eq(studentInventory.studentId, session.userId), eq(studentInventory.itemKey, foodKey)));
    } else {
      await db
        .update(studentInventory)
        .set({ quantity: inv.quantity - 1 })
        .where(and(eq(studentInventory.studentId, session.userId), eq(studentInventory.itemKey, foodKey)));
    }

    const isPremium = foodKey === "food-salmon";
    await db
      .update(studentPets)
      .set({
        hunger: Math.min(100, pet.hunger + (isPremium ? 55 : 25)),
        closeness: Math.min(100, pet.closeness + (isPremium ? 20 : 10)),
        growthXp: pet.growthXp + (isPremium ? 30 : 12),
        updatedAt: new Date(),
      })
      .where(eq(studentPets.id, pet.id));

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "ไม่รองรับคำสั่ง" }, { status: 400 });
}

