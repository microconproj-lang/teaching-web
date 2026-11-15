import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db, isDatabaseReachable } from "@/core/db";
import {
  arenaMatches,
  classrooms,
  coinLedger,
  enrollments,
  labFiles,
  lessonProgress,
  semesters,
  studentInventory,
  studentPets,
  users,
  xpLedger,
} from "@/core/db/schema";
import type { SessionUser } from "@/core/auth/session";
import { buildGuestDefaultState, type PlatformClientState } from "@/core/platform/types";

/**
 * โหลดสถานะเต็มของผู้ใช้สำหรับ AppShell และทุกหน้า (Coins, Pets, Inventory, Lab, Lessons, Arena)
 * หากยังไม่ได้ Login หรือ PostgreSQL ออฟไลน์ จะคืนค่าเริ่มต้นสำหรับ Guest / Preview อย่างปลอดภัย
 */
export async function loadServerPlatformState(
  session: SessionUser | null
): Promise<PlatformClientState> {
  const base = buildGuestDefaultState();

  if (!session) {
    return base;
  }

  const dbConnected = await isDatabaseReachable();
  if (!dbConnected) {
    return {
      ...base,
      authenticated: true,
      dbConnected: false,
      userId: session.userId,
      fullName: session.fullName,
      email: session.email,
      role: session.role,
    };
  }

  try {
    const [u] = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        displayName: users.displayName,
        email: users.email,
        role: users.role,
        avatarKey: users.avatarKey,
        equippedThemeKey: users.equippedThemeKey,
        equippedFrameKey: users.equippedFrameKey,
        equippedEffectKey: users.equippedEffectKey,
        arenaAp: users.arenaAp,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!u) {
      return {
        ...base,
        authenticated: true,
        dbConnected: true,
        userId: session.userId,
        fullName: session.fullName,
        email: session.email,
        role: session.role,
      };
    }

    // Starter gift idempotently if user has no coin history yet
    const [coinCountRow] = await db
      .select({ cnt: sql<number>`COUNT(*)::int` })
      .from(coinLedger)
      .where(eq(coinLedger.studentId, u.id));
    if ((coinCountRow?.cnt ?? 0) === 0) {
      await db.insert(coinLedger).values({
        studentId: u.id,
        sourceType: "starter_gift",
        refKey: "welcome-bonus",
        amount: 120,
        description: "Coins เริ่มต้นต้อนรับเข้าสู่แพลตฟอร์ม",
      });
    }

    // Ensure at least one starter pet exists if user has none
    let petRows = await db
      .select()
      .from(studentPets)
      .where(eq(studentPets.studentId, u.id))
      .orderBy(desc(studentPets.isActive), desc(studentPets.hatchedAt));

    if (petRows.length === 0) {
      const [insertedPet] = await db
        .insert(studentPets)
        .values({
          studentId: u.id,
          speciesKey: "shiba-script",
          nickname: "ปุกปุย",
          rarity: "common",
          growthXp: 20,
          hunger: 85,
          closeness: 45,
          trait: "ชอบช่วยตรวจ Syntax",
          habitatKey: "habitat-desk",
          isActive: true,
        })
        .returning();
      petRows = insertedPet ? [insertedPet] : [];
    }

    const [coinSumRow] = await db
      .select({ sum: sql<number>`COALESCE(SUM(${coinLedger.amount}), 0)::int` })
      .from(coinLedger)
      .where(eq(coinLedger.studentId, u.id));

    const logRows = await db
      .select()
      .from(coinLedger)
      .where(eq(coinLedger.studentId, u.id))
      .orderBy(desc(coinLedger.createdAt))
      .limit(25);

    const completionRows = await db
      .select({ sourceType: coinLedger.sourceType, refKey: coinLedger.refKey })
      .from(coinLedger)
      .where(
        and(
          eq(coinLedger.studentId, u.id),
          inArray(coinLedger.sourceType, ["adventure_chest", "lesson_exercise"])
        )
      );

    const invRows = await db
      .select()
      .from(studentInventory)
      .where(eq(studentInventory.studentId, u.id));

    const fileRows = await db
      .select()
      .from(labFiles)
      .where(eq(labFiles.studentId, u.id))
      .orderBy(desc(labFiles.updatedAt));

    const lessonRows = await db
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.studentId, u.id));

    const arenaRows = await db
      .select({ problemKey: arenaMatches.problemKey, passed: arenaMatches.passed })
      .from(arenaMatches)
      .where(and(eq(arenaMatches.studentId, u.id), eq(arenaMatches.passed, true)));

    const [sem] = await db.select().from(semesters).where(eq(semesters.isCurrent, true)).limit(1);
    let xpSum = 0;
    if (sem) {
      const [xpRow] = await db
        .select({ sum: sql<number>`COALESCE(SUM(${xpLedger.xpAmount}), 0)::int` })
        .from(xpLedger)
        .where(and(eq(xpLedger.studentId, u.id), eq(xpLedger.semesterId, sem.id)));
      xpSum = xpRow?.sum ?? 0;
    }

    let roomName: string | undefined;
    let studentNumber: number | undefined;
    if (u.role === "student") {
      const [enr] = await db
        .select({ roomName: classrooms.name, studentNumber: enrollments.studentNumber })
        .from(enrollments)
        .innerJoin(classrooms, eq(enrollments.classroomId, classrooms.id))
        .where(and(eq(enrollments.studentId, u.id), eq(enrollments.status, "active")))
        .orderBy(desc(enrollments.enrolledAt))
        .limit(1);
      roomName = enr?.roomName;
      studentNumber = enr?.studentNumber;
    }

    const clearedAdventureKeys = completionRows
      .filter((l) => l.sourceType === "adventure_chest" && l.refKey?.startsWith("stage:"))
      .map((l) => l.refKey!.replace("stage:", ""));

    const claimedIslandChests = completionRows
      .filter((l) => l.sourceType === "adventure_chest" && l.refKey?.startsWith("chest:"))
      .map((l) => l.refKey!.replace("chest:", ""));

    const solvedLabKeys = completionRows
      .filter((l) => l.sourceType === "lesson_exercise" && l.refKey?.startsWith("lab:"))
      .map((l) => l.refKey!.replace("lab:", ""));

    const lessonChecks: Record<string, string[]> = {};
    for (const row of lessonRows) {
      lessonChecks[row.lessonKey] = row.completedCheckKeys ?? [];
    }

    return {
      loaded: true,
      authenticated: true,
      dbConnected: true,
      userId: u.id,
      fullName: u.displayName || u.fullName,
      email: u.email,
      role: u.role,
      roomName,
      studentNumber,
      coins: coinSumRow?.sum ?? 0,
      xp: xpSum,
      ap: u.arenaAp,
      avatarKey: u.avatarKey ?? "vector-node",
      equippedThemeKey: u.equippedThemeKey,
      equippedFrameKey: u.equippedFrameKey,
      equippedEffectKey: u.equippedEffectKey,
      inventory: invRows.map((r) => ({
        itemKey: r.itemKey,
        category: r.category,
        quantity: r.quantity,
      })),
      coinLogs: logRows.map((l) => ({
        id: l.id,
        sourceType: l.sourceType,
        amount: l.amount,
        description: l.description,
        createdAt: l.createdAt.toISOString(),
      })),
      pets: petRows.map((p) => ({
        id: p.id,
        speciesKey: p.speciesKey,
        nickname: p.nickname,
        rarity: p.rarity,
        growthXp: p.growthXp,
        hunger: p.hunger,
        closeness: p.closeness,
        trait: p.trait,
        habitatKey: p.habitatKey,
        isActive: p.isActive,
      })),
      labFiles: fileRows.map((f) => ({
        id: f.id,
        title: f.title,
        language: f.language === "pseudocode" ? "pseudocode" : "python",
        code: f.code,
        updatedAt: f.updatedAt.toISOString(),
      })),
      lessonChecks,
      clearedAdventureKeys,
      claimedIslandChests,
      solvedLabKeys,
      solvedArenaKeys: Array.from(new Set(arenaRows.map((a) => a.problemKey))),
    };
  } catch {
    return {
      ...base,
      authenticated: true,
      dbConnected: false,
      userId: session.userId,
      fullName: session.fullName,
      email: session.email,
      role: session.role,
    };
  }
}

