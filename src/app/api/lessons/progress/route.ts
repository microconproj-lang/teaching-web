import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, isDatabaseReachable } from "@/core/db";
import { lessonProgress } from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { INTERACTIVE_LESSONS } from "@/core/config/curriculum";
import { grantUniqueCoins } from "@/core/platform/rewards";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  const body = (await req.json().catch(() => null)) as {
    lessonKey?: string;
    lastSlide?: number;
    completedCheckKey?: string;
  } | null;

  const lesson = INTERACTIVE_LESSONS.find((l) => l.key === body?.lessonKey);
  if (!lesson) {
    return NextResponse.json({ error: "ไม่พบบทเรียนที่ระบุ" }, { status: 404 });
  }

  let coinReward = 0;
  let xpReward = 0;
  if (body?.completedCheckKey) {
    for (const s of lesson.slides) {
      if (s.quiz?.checkKey === body.completedCheckKey) coinReward = s.quiz.coinReward;
      if (s.mission?.checkKey === body.completedCheckKey) {
        coinReward = s.mission.coinReward;
        xpReward = s.mission.xpReward;
      }
    }
  }

  if (!session || !(await isDatabaseReachable())) {
    return NextResponse.json({ ok: true, localMode: true, coinReward, xpReward });
  }

  const res = await db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(lessonProgress)
      .where(and(eq(lessonProgress.studentId, session.userId), eq(lessonProgress.lessonKey, lesson.key)))
      .limit(1);

    const prevKeys = existing?.completedCheckKeys ?? [];
    const nextKeys =
      body?.completedCheckKey && !prevKeys.includes(body.completedCheckKey)
        ? [...prevKeys, body.completedCheckKey]
        : prevKeys;

    const slideIndex = Math.max(0, Math.min(lesson.slides.length - 1, body?.lastSlide ?? 0));

    if (!existing) {
      await tx.insert(lessonProgress).values({
        studentId: session.userId,
        lessonKey: lesson.key,
        lastSlide: slideIndex,
        completedCheckKeys: nextKeys,
      });
    } else {
      await tx
        .update(lessonProgress)
        .set({
          lastSlide: Math.max(existing.lastSlide, slideIndex),
          completedCheckKeys: nextKeys,
          updatedAt: new Date(),
        })
        .where(and(eq(lessonProgress.studentId, session.userId), eq(lessonProgress.lessonKey, lesson.key)));
    }

    let grantedCoins = 0;
    if (body?.completedCheckKey && coinReward > 0) {
      const rewardRes = await grantUniqueCoins(tx, {
        studentId: session.userId,
        sourceType: "lesson_exercise",
        refKey: `lesson:${lesson.key}:${body.completedCheckKey}`,
        amount: coinReward,
        description: `ผ่านกิจกรรมในบทเรียน: ${lesson.title}`,
        xpAmount: xpReward,
        boostCloseness: 6,
      });
      grantedCoins = rewardRes.grantedCoins;
    }

    return { ok: true, grantedCoins, completedCheckKeys: nextKeys };
  });

  return NextResponse.json(res);
}

