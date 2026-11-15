import { notFound, redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db, isDatabaseReachable } from "@/core/db";
import {
  challenges,
  moduleAssignments,
  modules,
  studentChallengeProgress,
} from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { generateStudentSeed } from "@/core/grading/anti-cheat";
import { getRegisteredModule } from "@/core/modules/registry";
import type { ChallengeClientView, ChallengeProgressView } from "@/core/modules/contract";
import { getShuffledBlocks } from "@/modules/algo-quest-m1/grader";

export default async function LearnModulePage(props: {
  params: Promise<{ assignmentId: string }>;
  searchParams: Promise<{ stage?: string; module?: string }>;
}) {
  const { assignmentId } = await props.params;
  const { stage, module: demoModuleParam } = await props.searchParams;
  const session = await getCurrentSession();

  // โหมดตัวอย่างบนเครื่องพัฒนา (ไม่ต้องเชื่อมต่อฐานข้อมูล)
  if (assignmentId === "demo") {
    const requestedModuleKey =
      demoModuleParam === "iot-se-m3"
        ? "iot-se-m3"
        : demoModuleParam === "microbit-m1"
          ? "microbit-m1"
          : "algo-quest-m1";
    const modDef = getRegisteredModule(requestedModuleKey);
    if (!modDef) notFound();

    const PlayerComponent = (await modDef.loadPlayer()).default;
    let clientChallenges: ChallengeClientView[] = [];

    if (requestedModuleKey === "iot-se-m3") {
      const { buildIotSeDemoClientChallenges } = await import("@/modules/iot-se-m3/demo-data");
      clientChallenges = buildIotSeDemoClientChallenges(2569);
    } else if (requestedModuleKey === "microbit-m1") {
      const { buildMicrobitDemoClientChallenges } = await import("@/modules/microbit-m1/demo-data");
      clientChallenges = buildMicrobitDemoClientChallenges(2569);
    } else {
      const { DEMO_CHALLENGES } = await import("@/modules/algo-quest-m1/demo-data");
      clientChallenges = DEMO_CHALLENGES.map((ch, idx) => ({
        id: ch.id,
        challengeKey: ch.challengeKey,
        title: ch.title,
        orderIndex: ch.orderIndex,
        difficulty: ch.difficulty,
        maxScore: ch.maxScore,
        xpReward: ch.xpReward,
        studentSeed: 2569 + idx,
        config: { ...ch.config, blocks: getShuffledBlocks(ch.config.blocks, 2569 + idx) },
      }));
    }

    return (
      <div className="min-h-screen bg-[#F4F7FD] text-[#092551]">
        <PlayerComponent
          assignmentId="demo"
          moduleKey={modDef.manifest.moduleKey}
          challenges={clientChallenges}
          disablePaste={true}
          focusMode={true}
          initialChallengeId={stage}
          backHref={session ? "/dashboard" : "/"}
          unlockAll={true}
        />
      </div>
    );
  }

  if (!session) {
    redirect("/");
  }

  if (!(await isDatabaseReachable())) {
    redirect("/learn/demo");
  }

  const [assignmentRow] = await db
    .select({ assignment: moduleAssignments, mod: modules })
    .from(moduleAssignments)
    .innerJoin(modules, eq(moduleAssignments.moduleId, modules.id))
    .where(eq(moduleAssignments.id, assignmentId))
    .limit(1);

  if (!assignmentRow) notFound();

  const modDef = getRegisteredModule(assignmentRow.mod.moduleKey);
  if (!modDef) notFound();

  const challengeRows = await db
    .select()
    .from(challenges)
    .where(eq(challenges.moduleId, assignmentRow.mod.id))
    .orderBy(asc(challenges.orderIndex));

  const clientChallenges: ChallengeClientView[] = challengeRows.map((ch) => {
    const seed = generateStudentSeed(session.userId, ch.id, assignmentRow.assignment.semesterId);
    const rawConfig = { ...ch.config };

    if (
      (assignmentRow.mod.moduleKey === "algo-quest-m1" ||
        assignmentRow.mod.moduleKey === "iot-se-m3" ||
        assignmentRow.mod.moduleKey === "microbit-m1") &&
      Array.isArray(rawConfig.blocks)
    ) {
      rawConfig.blocks = getShuffledBlocks(rawConfig.blocks as { id: string; text: string }[], seed);
    }

    return {
      id: ch.id,
      challengeKey: ch.challengeKey,
      title: ch.title,
      orderIndex: ch.orderIndex,
      difficulty: ch.difficulty,
      maxScore: Number(ch.maxScore),
      xpReward: ch.xpReward,
      config: rawConfig,
      studentSeed: seed,
    };
  });

  const progressRows = await db
    .select({
      challengeId: studentChallengeProgress.challengeId,
      passed: studentChallengeProgress.passed,
      bestStars: studentChallengeProgress.bestStars,
    })
    .from(studentChallengeProgress)
    .where(
      and(
        eq(studentChallengeProgress.assignmentId, assignmentId),
        eq(studentChallengeProgress.studentId, session.userId)
      )
    );

  const progress: Record<string, ChallengeProgressView> = {};
  for (const p of progressRows) {
    progress[p.challengeId] = { passed: p.passed, bestStars: p.bestStars };
  }

  const PlayerComponent = (await modDef.loadPlayer()).default;

  return (
    <div className="min-h-screen bg-paper text-cloth-deep">
      <PlayerComponent
        assignmentId={assignmentRow.assignment.id}
        moduleKey={assignmentRow.mod.moduleKey}
        challenges={clientChallenges}
        disablePaste={assignmentRow.assignment.disablePaste}
        focusMode={assignmentRow.assignment.focusMode}
        progress={progress}
        initialChallengeId={stage}
        backHref="/dashboard"
        unlockAll={session.role !== "student"}
      />
    </div>
  );
}
