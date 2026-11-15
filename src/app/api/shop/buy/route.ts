import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db, isDatabaseReachable } from "@/core/db";
import { coinLedger, studentInventory, studentPets } from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { rollPetFromEgg, SHOP_ITEMS } from "@/core/config/shop";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  const body = (await req.json().catch(() => null)) as { itemKey?: string; nickname?: string } | null;
  const item = SHOP_ITEMS.find((i) => i.key === body?.itemKey);
  if (!item) {
    return NextResponse.json({ error: "ไม่พบสินค้าที่เลือก" }, { status: 404 });
  }

  if (!session || !(await isDatabaseReachable())) {
    if (item.category === "egg") {
      const species = rollPetFromEgg(item.key);
      return NextResponse.json({
        ok: true,
        localMode: true,
        newPet: {
          id: `pet-${Date.now()}`,
          speciesKey: species.key,
          nickname: body?.nickname?.trim() || species.name,
          rarity: species.rarity,
          growthXp: 10,
          hunger: 90,
          closeness: 35,
          trait: species.traitDefault,
          habitatKey: "habitat-desk",
          isActive: true,
        },
      });
    }
    return NextResponse.json({ ok: true, localMode: true });
  }

  try {
    const result = await db.transaction(async (tx) => {
      const [sumRow] = await tx
        .select({ sum: sql<number>`COALESCE(SUM(${coinLedger.amount}), 0)::int` })
        .from(coinLedger)
        .where(eq(coinLedger.studentId, session.userId));
      const balance = sumRow?.sum ?? 0;

      if (balance < item.price) {
        return { error: `Coins ไม่พอ (มี ${balance} แต่ต้องใช้ ${item.price} Coins)`, status: 400 as const };
      }

      // Check non-consumable duplicate ownership
      if (item.category !== "egg" && item.category !== "food") {
        const owned = await tx
          .select({ itemKey: studentInventory.itemKey })
          .from(studentInventory)
          .where(and(eq(studentInventory.studentId, session.userId), eq(studentInventory.itemKey, item.key)))
          .limit(1);
        if (owned.length > 0) {
          return { error: "คุณเป็นเจ้าของไอเทมชิ้นนี้แล้ว", status: 400 as const };
        }
      }

      await tx.insert(coinLedger).values({
        studentId: session.userId,
        sourceType: "shop_purchase",
        refKey: `buy:${item.key}:${Date.now()}`,
        amount: -item.price,
        description: `ซื้อ ${item.title} จากร้านคุณเหมียว`,
      });

      let newPet = null;
      if (item.category === "egg") {
        const species = rollPetFromEgg(item.key);
        const [pet] = await tx
          .insert(studentPets)
          .values({
            studentId: session.userId,
            speciesKey: species.key,
            nickname: body?.nickname?.trim() || species.name,
            rarity: species.rarity,
            growthXp: 10,
            hunger: 90,
            closeness: 40,
            trait: species.traitDefault,
            habitatKey: "habitat-desk",
            isActive: false,
          })
          .returning();
        newPet = pet;
      } else {
        const [existingInv] = await tx
          .select()
          .from(studentInventory)
          .where(and(eq(studentInventory.studentId, session.userId), eq(studentInventory.itemKey, item.key)))
          .limit(1);

        if (existingInv) {
          await tx
            .update(studentInventory)
            .set({ quantity: existingInv.quantity + 1 })
            .where(and(eq(studentInventory.studentId, session.userId), eq(studentInventory.itemKey, item.key)));
        } else {
          await tx.insert(studentInventory).values({
            studentId: session.userId,
            itemKey: item.key,
            category: item.category,
            quantity: 1,
          });
        }
      }

      return { ok: true, coins: balance - item.price, newPet };
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error("Shop buy error:", err);
    return NextResponse.json({ error: "ไม่สามารถดำเนินการซื้อได้" }, { status: 500 });
  }
}

