import type { ChallengeClientView } from "@/core/modules/contract";
import { getShuffledBlocks } from "@/modules/algo-quest-m1/grader";

export interface DemoChallengeGradeTarget {
  challengeConfig: Record<string, unknown>;
  solutionCheck: Record<string, unknown>;
  maxScore: number;
}

interface DemoModuleEntry {
  buildClientChallenges: (seed: number) => Promise<ChallengeClientView[]>;
  findGradeTarget: (challengeId: string) => Promise<DemoChallengeGradeTarget | null>;
}

const DEMO_MODULES: Record<string, DemoModuleEntry> = {
  "algo-quest-m1": {
    buildClientChallenges: async (seed) => {
      const { DEMO_CHALLENGES } = await import("@/modules/algo-quest-m1/demo-data");
      return DEMO_CHALLENGES.map((ch, idx) => ({
        id: ch.id,
        challengeKey: ch.challengeKey,
        title: ch.title,
        orderIndex: ch.orderIndex,
        difficulty: ch.difficulty,
        maxScore: ch.maxScore,
        xpReward: ch.xpReward,
        studentSeed: seed + idx,
        config: { ...ch.config, blocks: getShuffledBlocks(ch.config.blocks, seed + idx) },
      }));
    },
    findGradeTarget: async (challengeId) => {
      const { DEMO_CHALLENGES } = await import("@/modules/algo-quest-m1/demo-data");
      const found = DEMO_CHALLENGES.find(
        (c) => c.id === challengeId || c.challengeKey === challengeId
      );
      return found
        ? {
            challengeConfig: found.config as unknown as Record<string, unknown>,
            solutionCheck: found.solutionCheck as unknown as Record<string, unknown>,
            maxScore: found.maxScore,
          }
        : null;
    },
  },
  "cyber-defense-m3": {
    buildClientChallenges: async (seed) => {
      const { buildCyberDefenseDemoClientChallenges } = await import(
        "@/modules/cyber-defense-m3/demo-data"
      );
      return buildCyberDefenseDemoClientChallenges(seed);
    },
    findGradeTarget: async (challengeId) => {
      const { CYBER_DEFENSE_M3_DEMO_CHALLENGES } = await import(
        "@/modules/cyber-defense-m3/demo-data"
      );
      const found = CYBER_DEFENSE_M3_DEMO_CHALLENGES.find(
        (c) => `demo-cyber-${c.challengeKey}` === challengeId || c.challengeKey === challengeId
      );
      return found
        ? {
            challengeConfig: found.config as unknown as Record<string, unknown>,
            solutionCheck: found.solutionCheck as unknown as Record<string, unknown>,
            maxScore: found.maxScore,
          }
        : null;
    },
  },
  "iot-se-m3": {
    buildClientChallenges: async (seed) => {
      const { buildIotSeDemoClientChallenges } = await import("@/modules/iot-se-m3/demo-data");
      return buildIotSeDemoClientChallenges(seed);
    },
    findGradeTarget: async (challengeId) => {
      const { IOT_SE_DEMO_CHALLENGES } = await import("@/modules/iot-se-m3/demo-data");
      const found = IOT_SE_DEMO_CHALLENGES.find(
        (c) => `demo-iot-${c.challengeKey}` === challengeId || c.challengeKey === challengeId
      );
      return found
        ? {
            challengeConfig: found.config as unknown as Record<string, unknown>,
            solutionCheck: found.solutionCheck as unknown as Record<string, unknown>,
            maxScore: found.maxScore,
          }
        : null;
    },
  },
  "microbit-m1": {
    buildClientChallenges: async (seed) => {
      const { buildMicrobitDemoClientChallenges } = await import(
        "@/modules/microbit-m1/demo-data"
      );
      return buildMicrobitDemoClientChallenges(seed);
    },
    findGradeTarget: async (challengeId) => {
      const { MICROBIT_M1_DEMO_CHALLENGES } = await import("@/modules/microbit-m1/demo-data");
      const found = MICROBIT_M1_DEMO_CHALLENGES.find(
        (c) => `demo-mbit-${c.challengeKey}` === challengeId || c.challengeKey === challengeId
      );
      return found
        ? {
            challengeConfig: found.config as unknown as Record<string, unknown>,
            solutionCheck: found.solutionCheck as unknown as Record<string, unknown>,
            maxScore: found.maxScore,
          }
        : null;
    },
  },
};

export async function loadDemoClientChallenges(
  moduleKey: string,
  seed = 2569
): Promise<ChallengeClientView[] | null> {
  const entry = DEMO_MODULES[moduleKey];
  return entry ? entry.buildClientChallenges(seed) : null;
}

export async function findDemoChallengeGradeTarget(
  moduleKey: string,
  challengeId: string
): Promise<DemoChallengeGradeTarget | null> {
  const entry = DEMO_MODULES[moduleKey];
  return entry ? entry.findGradeTarget(challengeId) : null;
}
