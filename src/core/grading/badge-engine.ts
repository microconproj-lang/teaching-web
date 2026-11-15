import { and, eq, inArray, sql } from "drizzle-orm";
import type { Database } from "@/core/db";
import { badges, challenges, studentBadges, studentChallengeProgress, xpLedger } from "@/core/db/schema";
import { BADGE_DEFINITIONS, getBadgeDefinition, type BadgeDefinition } from "@/core/grading/badges";

type Tx = Parameters<Parameters<Database["transaction"]>[0]>[0];

export interface AwardBadgeParams {
  studentId: string;
  semesterId: string;
  assignmentId: string;
  moduleId: string;
  passed: boolean;
  stars: number;
  hintsUsed: number;
  attemptNo: number;
}

/**
 * ตรวจเงื่อนไขและมอบ Badge ใหม่ (เรียกภายใน Transaction เดียวกับการบันทึกคะแนน)
 * คืนค่ารายการ Badge ที่ได้รับใหม่ในการส่งครั้งนี้ เพื่อให้หน้าเว็บแสดงฉลอง
 */
export async function awardBadges(tx: Tx, p: AwardBadgeParams): Promise<BadgeDefinition[]> {
  const candidates: string[] = [];

  if (p.passed) candidates.push("first-mission");
  if (p.stars === 3) candidates.push("perfect-star");
  if (p.passed && p.hintsUsed === 0) candidates.push("zero-hint");
  if (p.passed && p.attemptNo >= 3) candidates.push("never-give-up");

  if (p.passed) {
    const [totalRow] = await tx
      .select({ total: sql<number>`COUNT(*)::int` })
      .from(challenges)
      .where(and(eq(challenges.moduleId, p.moduleId), eq(challenges.isPublished, true)));
    const [doneRow] = await tx
      .select({ done: sql<number>`COUNT(*)::int` })
      .from(studentChallengeProgress)
      .where(
        and(
          eq(studentChallengeProgress.assignmentId, p.assignmentId),
          eq(studentChallengeProgress.studentId, p.studentId),
          eq(studentChallengeProgress.passed, true)
        )
      );
    if ((totalRow?.total ?? 0) > 0 && (doneRow?.done ?? 0) >= (totalRow?.total ?? 0)) {
      candidates.push("quest-complete");
    }
  }

  if (candidates.length === 0) return [];

  // ให้แน่ใจว่ามีนิยาม Badge อยู่ในฐานข้อมูล
  await tx
    .insert(badges)
    .values(
      BADGE_DEFINITIONS.map((b) => ({
        badgeKey: b.key,
        title: b.title,
        description: b.description,
        iconPath: b.iconKey,
      }))
    )
    .onConflictDoNothing();

  const rows = await tx.select().from(badges).where(inArray(badges.badgeKey, candidates));
  const awarded: BadgeDefinition[] = [];

  for (const row of rows) {
    const inserted = await tx
      .insert(studentBadges)
      .values({ studentId: p.studentId, badgeId: row.id, semesterId: p.semesterId })
      .onConflictDoNothing()
      .returning();

    if (inserted.length === 0) continue;

    const def = getBadgeDefinition(row.badgeKey);
    if (!def) continue;
    awarded.push(def);

    if (def.xpBonus > 0) {
      await tx.insert(xpLedger).values({
        studentId: p.studentId,
        semesterId: p.semesterId,
        sourceType: "badge",
        sourceId: row.id,
        xpAmount: def.xpBonus,
        description: `ได้รับเหรียญ ${def.title}`,
      });
    }
  }

  return awarded;
}

