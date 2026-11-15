import { and, eq, sql } from "drizzle-orm";
import type { Database } from "@/core/db";
import { coinLedger, semesters, studentPets, xpLedger, type CoinSourceType } from "@/core/db/schema";

type Tx = Parameters<Parameters<Database["transaction"]>[0]>[0];

/**
 * มอบ Coins แบบ Idempotent ตาม refKey เพื่อกันการปั๊มเหรียญซ้ำจากการส่งด่านเดิม
 */
export async function grantUniqueCoins(
  tx: Tx,
  params: {
    studentId: string;
    sourceType: CoinSourceType;
    refKey: string;
    amount: number;
    description: string;
    xpAmount?: number;
    boostCloseness?: number;
  }
): Promise<{ grantedCoins: number; totalCoins: number }> {
  if (params.amount <= 0) {
    const [row] = await tx
      .select({ sum: sql<number>`COALESCE(SUM(${coinLedger.amount}), 0)::int` })
      .from(coinLedger)
      .where(eq(coinLedger.studentId, params.studentId));
    return { grantedCoins: 0, totalCoins: row?.sum ?? 0 };
  }

  const existing = await tx
    .select({ id: coinLedger.id })
    .from(coinLedger)
    .where(and(eq(coinLedger.studentId, params.studentId), eq(coinLedger.refKey, params.refKey)))
    .limit(1);

  let grantedCoins = 0;
  if (existing.length === 0) {
    await tx.insert(coinLedger).values({
      studentId: params.studentId,
      sourceType: params.sourceType,
      refKey: params.refKey,
      amount: params.amount,
      description: params.description,
    });
    grantedCoins = params.amount;

    if (params.xpAmount && params.xpAmount > 0) {
      const [sem] = await tx.select().from(semesters).where(eq(semesters.isCurrent, true)).limit(1);
      if (sem) {
        await tx.insert(xpLedger).values({
          studentId: params.studentId,
          semesterId: sem.id,
          sourceType: "challenge_clear",
          xpAmount: params.xpAmount,
          description: params.description,
        });
      }
    }

    if (params.boostCloseness && params.boostCloseness > 0) {
      await tx
        .update(studentPets)
        .set({
          closeness: sql`LEAST(100, ${studentPets.closeness} + ${params.boostCloseness})`,
          growthXp: sql`${studentPets.growthXp} + ${params.boostCloseness}`,
          updatedAt: new Date(),
        })
        .where(and(eq(studentPets.studentId, params.studentId), eq(studentPets.isActive, true)));
    }
  }

  const [sumRow] = await tx
    .select({ sum: sql<number>`COALESCE(SUM(${coinLedger.amount}), 0)::int` })
    .from(coinLedger)
    .where(eq(coinLedger.studentId, params.studentId));

  return { grantedCoins, totalCoins: sumRow?.sum ?? 0 };
}

