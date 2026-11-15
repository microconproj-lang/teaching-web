import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db, isDatabaseReachable } from "@/core/db";
import { arenaMatches, users } from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { ARENA_CHALLENGES } from "@/core/config/curriculum";
import { grantUniqueCoins } from "@/core/platform/rewards";
import { gradePythonChallenge } from "@/core/python/runner";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  const body = (await req.json().catch(() => null)) as {
    problemKey?: string;
    code?: string;
    mode?: "ranked" | "duel" | "practice";
    durationSec?: number;
  } | null;

  const challenge = ARENA_CHALLENGES.find((c) => c.key === body?.problemKey);
  if (!challenge) {
    return NextResponse.json({ error: "ไม่พบโจทย์ Code Arena" }, { status: 404 });
  }

  const graded = gradePythonChallenge(body?.code ?? "", challenge.testCases);
  const mode = body?.mode === "duel" || body?.mode === "practice" ? body.mode : "ranked";
  const apDelta = graded.passed
    ? mode === "ranked"
      ? challenge.apRewardWin
      : mode === "duel"
        ? Math.round(challenge.apRewardWin * 0.7)
        : 0
    : mode === "ranked"
      ? -8
      : 0;

  if (!session || !(await isDatabaseReachable())) {
    return NextResponse.json({
      ok: true,
      localMode: true,
      graded,
      apDelta,
      grantedCoins: graded.passed ? challenge.coinReward : 0,
    });
  }

  const out = await db.transaction(async (tx) => {
    await tx.insert(arenaMatches).values({
      studentId: session.userId,
      problemKey: challenge.key,
      mode,
      score: graded.score,
      apDelta,
      durationSec: Math.max(1, Math.round(body?.durationSec ?? 30)),
      passed: graded.passed,
    });

    if (apDelta !== 0) {
      await tx
        .update(users)
        .set({ arenaAp: sql`GREATEST(800, ${users.arenaAp} + ${apDelta})` })
        .where(eq(users.id, session.userId));
    }

    let grantedCoins = 0;
    if (graded.passed) {
      const coinRes = await grantUniqueCoins(tx, {
        studentId: session.userId,
        sourceType: "arena_match",
        refKey: `arena:${challenge.key}`,
        amount: challenge.coinReward,
        description: `พิชิตโจทย์ Code Arena: ${challenge.title}`,
        xpAmount: 35,
        boostCloseness: 8,
      });
      grantedCoins = coinRes.grantedCoins;
    }

    const [u] = await tx
      .select({ arenaAp: users.arenaAp })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    return { grantedCoins, newAp: u?.arenaAp ?? 1000 };
  });

  return NextResponse.json({
    ok: true,
    graded,
    apDelta,
    grantedCoins: out.grantedCoins,
    newAp: out.newAp,
  });
}

