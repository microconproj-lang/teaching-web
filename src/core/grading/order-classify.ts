import { evaluateTelemetryRisk } from "@/core/grading/anti-cheat";
import type { ChallengeClientView, GradeResult, SubmissionEvidence } from "@/core/modules/contract";

type ChallengeDifficulty = ChallengeClientView["difficulty"];

export interface OrderChallengeConfig {
  mode: "order";
  unitCode: string;
  story: string;
  blocks: Array<{ id: string; text: string }>;
  hints: string[];
  microQuestion?: {
    prompt: string;
    options: string[];
  };
}

export interface ClassifyChallengeConfig {
  mode: "classify";
  unitCode: string;
  story: string;
  categories: Array<{ id: string; label: string; badgeCls: string }>;
  items: Array<{ id: string; text: string }>;
  hints: string[];
  microQuestion?: {
    prompt: string;
    options: string[];
  };
}

export type OrderClassifyChallengeConfig = OrderChallengeConfig | ClassifyChallengeConfig;

export interface OrderClassifySolutionCheck {
  mode?: "order" | "classify";
  correctOrder?: string[];
  correctMap?: Record<string, string>;
  microCorrectOption?: string;
}

export interface OrderClassifySeedItem {
  challengeKey: string;
  title: string;
  orderIndex: number;
  difficulty: ChallengeDifficulty;
  maxScore: number;
  xpReward: number;
  config: OrderClassifyChallengeConfig;
  solutionCheck: {
    mode: "order" | "classify";
    correctOrder?: string[];
    correctMap?: Record<string, string>;
    microCorrectOption?: string;
  };
}

/**
 * Deterministic Fisher-Yates shuffle seeded per student/challenge for order mode.
 */
export function seededShuffle<T>(items: T[], seedInput: string): T[] {
  let hash = 2166136261;
  for (let i = 0; i < seedInput.length; i++) {
    hash ^= seedInput.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    hash = Math.imul(hash ^ 0x9e3779b9, 1664525) + 1013904223;
    const j = Math.abs(hash) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Builds demo ChallengeClientView items with deterministic shuffle on order challenges.
 */
export function buildOrderClassifyDemoChallenges(
  items: OrderClassifySeedItem[],
  idPrefix: string,
  seed = 2569
): ChallengeClientView[] {
  return items.map((c, idx) => {
    const chSeed = seed + idx;
    const config =
      c.config.mode === "order"
        ? {
            ...c.config,
            blocks: seededShuffle(c.config.blocks, `${chSeed}:${c.challengeKey}`),
          }
        : c.config;

    return {
      id: `${idPrefix}${c.challengeKey}`,
      challengeKey: c.challengeKey,
      title: c.title,
      orderIndex: c.orderIndex,
      difficulty: c.difficulty,
      maxScore: c.maxScore,
      xpReward: c.xpReward,
      config: config as unknown as Record<string, unknown>,
      studentSeed: chSeed,
    };
  });
}

/**
 * Shared server-side grader for modules combining block ordering and category classification.
 */
export function gradeOrderClassifySubmission(params: {
  solutionCheck: Record<string, unknown>;
  evidence: SubmissionEvidence;
  maxScore: number;
  perfectFeedback: string;
}): GradeResult {
  const sol = params.solutionCheck as OrderClassifySolutionCheck;
  const mode = sol.mode ?? (Array.isArray(sol.correctOrder) ? "order" : "classify");

  let matchedCount = 0;
  let totalCount = 1;
  let allCorrect = false;
  let answerCharLen = 0;

  if (mode === "order") {
    const correctOrder = Array.isArray(sol.correctOrder) ? sol.correctOrder : [];
    const submittedOrder = Array.isArray(params.evidence.answer)
      ? params.evidence.answer.map(String)
      : [];
    totalCount = Math.max(1, correctOrder.length);
    for (let i = 0; i < correctOrder.length; i++) {
      if (submittedOrder[i] === correctOrder[i]) {
        matchedCount += 1;
      }
    }
    allCorrect =
      correctOrder.length > 0 &&
      submittedOrder.length === correctOrder.length &&
      matchedCount === correctOrder.length;
    answerCharLen = submittedOrder.join(" ").length;
  } else {
    const correctMap = sol.correctMap ?? {};
    const keys = Object.keys(correctMap);
    const submittedMap =
      params.evidence.answer &&
      typeof params.evidence.answer === "object" &&
      !Array.isArray(params.evidence.answer)
        ? (params.evidence.answer as Record<string, string>)
        : {};
    totalCount = Math.max(1, keys.length);
    for (const k of keys) {
      if (String(submittedMap[k] ?? "") === String(correctMap[k])) {
        matchedCount += 1;
      }
    }
    allCorrect = keys.length > 0 && matchedCount === keys.length;
    answerCharLen = JSON.stringify(submittedMap).length;
  }

  const basePoints = Math.max(1, params.maxScore - 2);
  let score = Math.round((matchedCount / totalCount) * basePoints);

  const expectedMicro = sol.microCorrectOption;
  const chosenMicro = params.evidence.microCheck?.selectedOption;
  const microPassed = !expectedMicro || (Boolean(chosenMicro) && chosenMicro === expectedMicro);
  const hintsUsed = Math.max(0, Number(params.evidence.telemetry.hintsUsed ?? 0));

  let stars: 0 | 1 | 2 | 3 = 0;
  if (allCorrect) {
    if (microPassed && hintsUsed <= 1) {
      stars = 3;
      score = params.maxScore;
    } else if (microPassed || hintsUsed <= 2) {
      stars = 2;
      score = Math.max(score, params.maxScore - 1);
    } else {
      stars = 1;
      score = Math.max(score, params.maxScore - 2);
    }
  }

  const telemetryRisk = evaluateTelemetryRisk(params.evidence.telemetry, answerCharLen);

  const feedback = allCorrect
    ? stars === 3
      ? params.perfectFeedback
      : "ผ่านด่าน! ลองตอบคำถามทบทวนความเข้าใจด้านล่างและใช้คำใบ้ไม่เกิน 1 ครั้งเพื่อรับ 3 ดาว"
    : mode === "order"
      ? `จัดลำดับถูกต้อง ${matchedCount} จาก ${totalCount} ขั้นตอน ลองทบทวนลำดับการทำงานอีกครั้ง`
      : `จำแนกประเภทถูกต้อง ${matchedCount} จาก ${totalCount} รายการ ลองตรวจดูหลักเกณฑ์อีกครั้ง`;

  return {
    score,
    maxScore: params.maxScore,
    stars,
    passed: allCorrect,
    feedback,
    reviewFlag: telemetryRisk.reviewFlag,
    reviewReasons: telemetryRisk.reasons,
  };
}
