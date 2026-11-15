import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseReachable } from "@/core/db";
import { getCurrentSession } from "@/core/auth/session";
import { ADVENTURE_ISLANDS } from "@/core/config/curriculum";
import { grantUniqueCoins } from "@/core/platform/rewards";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  const body = (await req.json().catch(() => null)) as {
    kind?: "stage" | "chest";
    key?: string;
  } | null;

  if (!body?.kind || !body?.key) {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  let coinAmount = 0;
  let xpAmount = 0;
  let description = "";

  if (body.kind === "stage") {
    for (const isl of ADVENTURE_ISLANDS) {
      const st = isl.stages.find((s) => s.key === body.key);
      if (st) {
        coinAmount = st.coinReward;
        xpAmount = st.xpReward;
        description = `ผ่านด่าน ${st.code} ${st.title} (${isl.name})`;
        break;
      }
    }
  } else {
    const isl = ADVENTURE_ISLANDS.find((i) => i.key === body.key);
    if (isl) {
      coinAmount = isl.chestCoins;
      xpAmount = 50;
      description = `เปิดหีบสมบัติประจำ${isl.name}`;
    }
  }

  if (coinAmount <= 0) {
    return NextResponse.json({ error: "ไม่พบด่านหรือหีบสมบัติ" }, { status: 404 });
  }

  if (!session || !(await isDatabaseReachable())) {
    return NextResponse.json({ ok: true, localMode: true, grantedCoins: coinAmount, xpAmount });
  }

  const out = await db.transaction((tx) =>
    grantUniqueCoins(tx, {
      studentId: session.userId,
      sourceType: "adventure_chest",
      refKey: `${body.kind}:${body.key}`,
      amount: coinAmount,
      description,
      xpAmount,
      boostCloseness: 8,
    })
  );

  return NextResponse.json({ ok: true, ...out });
}

