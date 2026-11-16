import { eq } from "drizzle-orm";
import { db, pool } from "../src/core/db";
import {
  academicYears,
  challenges,
  classrooms,
  coinLedger,
  enrollments,
  moduleAssignments,
  modules,
  semesters,
  staffAllowlist,
  studentInventory,
  studentPets,
  users,
} from "../src/core/db/schema";
import { algoQuestManifest } from "../src/modules/algo-quest-m1/manifest";
import { DEMO_CHALLENGES } from "../src/modules/algo-quest-m1/demo-data";
import { iotSeM3Manifest } from "../src/modules/iot-se-m3/manifest";
import { IOT_SE_DEMO_CHALLENGES } from "../src/modules/iot-se-m3/demo-data";
import { microbitM1Manifest } from "../src/modules/microbit-m1/manifest";
import { MICROBIT_M1_DEMO_CHALLENGES } from "../src/modules/microbit-m1/demo-data";
import type { ChallengeClientView, ModuleManifest } from "../src/core/modules/contract";

interface SeedChallengeInput {
  challengeKey: string;
  title: string;
  orderIndex: number;
  difficulty: ChallengeClientView["difficulty"];
  maxScore: number;
  xpReward: number;
  config: unknown;
  solutionCheck: unknown;
}

/**
 * บันทึกหรืออัปเดตโมดูล พร้อมด่านทดสอบและมอบหมายให้ห้องเรียนเป้าหมาย
 */
async function upsertModuleAndAssign(params: {
  manifest: ModuleManifest;
  entryPath: string;
  challengesList: SeedChallengeInput[];
  semesterId: string;
  classroomId?: string;
  weightPercent: string;
  focusMode: boolean;
}) {
  const { manifest, entryPath, challengesList, semesterId, classroomId, weightPercent, focusMode } = params;

  let [mod] = await db
    .select()
    .from(modules)
    .where(eq(modules.moduleKey, manifest.moduleKey))
    .limit(1);

  if (!mod) {
    [mod] = await db
      .insert(modules)
      .values({
        moduleKey: manifest.moduleKey,
        version: manifest.version,
        title: manifest.title,
        description: manifest.description,
        runtimeType: manifest.runtimeType,
        entryPath,
        targetGrades: manifest.targetGrades,
        competencyTags: manifest.competencyTags,
        manifest: manifest as unknown as Record<string, unknown>,
      })
      .returning();
  } else {
    [mod] = await db
      .update(modules)
      .set({
        version: manifest.version,
        title: manifest.title,
        description: manifest.description,
        targetGrades: manifest.targetGrades,
        competencyTags: manifest.competencyTags,
        manifest: manifest as unknown as Record<string, unknown>,
        updatedAt: new Date(),
      })
      .where(eq(modules.id, mod.id))
      .returning();
  }

  for (const ch of challengesList) {
    await db
      .insert(challenges)
      .values({
        moduleId: mod.id,
        challengeKey: ch.challengeKey,
        title: ch.title,
        orderIndex: ch.orderIndex,
        difficulty: ch.difficulty,
        maxScore: ch.maxScore.toFixed(2),
        xpReward: ch.xpReward,
        config: ch.config as Record<string, unknown>,
        solutionCheck: ch.solutionCheck as Record<string, unknown>,
        isPublished: true,
      })
      .onConflictDoNothing();
  }

  if (classroomId) {
    await db
      .insert(moduleAssignments)
      .values({
        semesterId,
        classroomId,
        moduleId: mod.id,
        weightPercent,
        isPublished: true,
        focusMode,
        disablePaste: true,
      })
      .onConflictDoNothing();
  }
}

async function main() {
  const adminEmail = (process.env.INITIAL_ADMIN_EMAIL ?? "admin@pccpl.ac.th").toLowerCase();

  // 1. Seed initial admin/teacher allowlist
  await db
    .insert(staffAllowlist)
    .values([
      { email: adminEmail, assignedRole: "admin", note: "Initial admin" },
      { email: "teacher.demo@pccpl.ac.th", assignedRole: "teacher", note: "Demo teacher" },
    ])
    .onConflictDoNothing();

  // 2. Seed Academic Year & Semester (2569)
  let [year] = await db.select().from(academicYears).where(eq(academicYears.yearBe, 2569)).limit(1);
  if (!year) {
    [year] = await db
      .insert(academicYears)
      .values({
        yearBe: 2569,
        label: "ปีการศึกษา 2569",
        startsOn: "2026-05-16",
        endsOn: "2027-03-31",
        isCurrent: true,
      })
      .returning();
  }

  let [sem1] = await db
    .select()
    .from(semesters)
    .where(eq(semesters.academicYearId, year.id))
    .limit(1);
  if (!sem1) {
    [sem1] = await db
      .insert(semesters)
      .values({
        academicYearId: year.id,
        termNo: 1,
        label: "ภาคเรียนที่ 1/2569",
        startsOn: "2026-05-16",
        endsOn: "2026-10-15",
        isCurrent: true,
        isLocked: false,
      })
      .returning();
  }

  // 3. Seed Sample Classrooms ม.1/1, ม.2/1, ม.3/1
  const roomDefs = [
    { gradeLevel: 1, roomNo: 1, name: "ม.1/1" },
    { gradeLevel: 2, roomNo: 1, name: "ม.2/1" },
    { gradeLevel: 3, roomNo: 1, name: "ม.3/1" },
  ];

  for (const r of roomDefs) {
    await db
      .insert(classrooms)
      .values({
        academicYearId: year.id,
        gradeLevel: r.gradeLevel,
        roomNo: r.roomNo,
        name: r.name,
      })
      .onConflictDoNothing();
  }

  const [m1Room] = await db
    .select()
    .from(classrooms)
    .where(eq(classrooms.name, "ม.1/1"))
    .limit(1);

  const [m3Room] = await db
    .select()
    .from(classrooms)
    .where(eq(classrooms.name, "ม.3/1"))
    .limit(1);

  // 4. Seed Demo Student + Enrollment
  let [demoStudent] = await db
    .select()
    .from(users)
    .where(eq(users.email, "student.demo@pccpl.ac.th"))
    .limit(1);
  if (!demoStudent) {
    [demoStudent] = await db
      .insert(users)
      .values({
        email: "student.demo@pccpl.ac.th",
        fullName: "นักเรียน ทดสอบ (ม.1/1)",
        displayName: "นักเรียนทดสอบ",
        role: "student",
      })
      .returning();
  }

  if (m1Room) {
    await db
      .insert(enrollments)
      .values({
        studentId: demoStudent.id,
        academicYearId: year.id,
        classroomId: m1Room.id,
        studentNumber: 1,
        status: "active",
      })
      .onConflictDoNothing();
  }

  // 5. Seed Modules + Challenges + Assignments
  await upsertModuleAndAssign({
    manifest: algoQuestManifest,
    entryPath: "@/modules/algo-quest-m1/Player",
    challengesList: DEMO_CHALLENGES,
    semesterId: sem1.id,
    classroomId: m1Room?.id,
    weightPercent: "20.00",
    focusMode: false,
  });

  await upsertModuleAndAssign({
    manifest: iotSeM3Manifest,
    entryPath: "@/modules/iot-se-m3/Player",
    challengesList: IOT_SE_DEMO_CHALLENGES,
    semesterId: sem1.id,
    classroomId: m3Room?.id,
    weightPercent: "30.00",
    focusMode: true,
  });

  await upsertModuleAndAssign({
    manifest: microbitM1Manifest,
    entryPath: "@/modules/microbit-m1/Player",
    challengesList: MICROBIT_M1_DEMO_CHALLENGES,
    semesterId: sem1.id,
    classroomId: m1Room?.id,
    weightPercent: "25.00",
    focusMode: true,
  });

  // 6. Seed starter coins & virtual pet for demo student
  const existingCoins = await db
    .select({ id: coinLedger.id })
    .from(coinLedger)
    .where(eq(coinLedger.studentId, demoStudent.id))
    .limit(1);

  if (existingCoins.length === 0) {
    await db.insert(coinLedger).values({
      studentId: demoStudent.id,
      sourceType: "starter_gift",
      refKey: "welcome-bonus",
      amount: 120,
      description: "ของขวัญต้อนรับเปิดเทอมจากคุณครู",
    });
  }

  await db
    .insert(studentInventory)
    .values({
      studentId: demoStudent.id,
      itemKey: "navy-pro",
      category: "theme",
      quantity: 1,
    })
    .onConflictDoNothing();

  const existingPets = await db
    .select({ id: studentPets.id })
    .from(studentPets)
    .where(eq(studentPets.studentId, demoStudent.id))
    .limit(1);

  if (existingPets.length === 0) {
    await db.insert(studentPets).values({
      studentId: demoStudent.id,
      speciesKey: "shiba-script",
      nickname: "ปุกปุย",
      rarity: "common",
      growthXp: 25,
      hunger: 85,
      closeness: 45,
      trait: "ชอบช่วยตรวจโค้ด",
      habitatKey: "habitat-desk",
      isActive: true,
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });

