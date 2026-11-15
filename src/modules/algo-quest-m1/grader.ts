import { createSeededRng, evaluateTelemetryRisk } from "@/core/grading/anti-cheat";
import type { GradeResult, SubmissionEvidence } from "@/core/modules/contract";

interface AlgoQuestConfig {
  mode?: "parsons";
  blocks?: { id: string; text: string }[];
  microQuestion?: {
    prompt: string;
    options: string[];
  };
}

interface AlgoQuestSolution {
  correctOrder?: string[];
  microCorrectOption?: string;
}

/**
 * สุ่มลำดับบล็อกเริ่มต้นให้แต่ละคนไม่เหมือนกันตาม studentSeed
 */
export function getShuffledBlocks(
  blocks: { id: string; text: string }[],
  studentSeed: number
): { id: string; text: string }[] {
  const rng = createSeededRng(studentSeed);
  const copy = [...blocks];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function gradeAlgoQuestSubmission(params: {
  challengeConfig: Record<string, unknown>;
  solutionCheck: Record<string, unknown>;
  evidence: SubmissionEvidence;
  maxScore: number;
  studentSeed: number;
}): GradeResult {
  const config = params.challengeConfig as AlgoQuestConfig;
  const solution = params.solutionCheck as AlgoQuestSolution;
  const submittedOrder = Array.isArray(params.evidence.answer)
    ? params.evidence.answer.map(String)
    : [];
  const correctOrder = solution.correctOrder ?? [];

  let matchedCount = 0;
  for (let i = 0; i < correctOrder.length; i++) {
    if (submittedOrder[i] === correctOrder[i]) {
      matchedCount++;
    }
  }

  const allCorrect =
    correctOrder.length > 0 &&
    submittedOrder.length === correctOrder.length &&
    matchedCount === correctOrder.length;

  const accuracyRatio = correctOrder.length > 0 ? matchedCount / correctOrder.length : 0;
  let score = Math.round(accuracyRatio * params.maxScore);
  let stars: 0 | 1 | 2 | 3 = 0;

  if (allCorrect) {
    stars = 2;
    const requiresMicroCheck = Boolean(config.microQuestion && solution.microCorrectOption);
    const microPassed =
      !requiresMicroCheck ||
      params.evidence.microCheck?.selectedOption === solution.microCorrectOption;

    // ปลดล็อกดาวที่ 3 เมื่อตอบคำถามยืนยันความเข้าใจถูก และใช้ hint น้อยกว่า 2 ครั้ง
    if (microPassed && params.evidence.telemetry.hintsUsed <= 1) {
      stars = 3;
    } else if (!microPassed) {
      score = Math.round(params.maxScore * 0.85);
    }
  } else if (accuracyRatio >= 0.6) {
    stars = 1;
  }

  const telemetryRisk = evaluateTelemetryRisk(
    params.evidence.telemetry,
    submittedOrder.join(" ").length
  );

  const feedback = allCorrect
    ? stars === 3
      ? "ยอดเยี่ยม! เรียงลำดับขั้นตอนถูกต้องสมบูรณ์และเข้าใจเหตุผลครบถ้วน (3 ดาว)"
      : "ผ่านด่าน! ลองตอบคำถามทบทวนความเข้าใจและลดการใช้คำใบ้เพื่อรับ 3 ดาว"
    : `เรียงตำแหน่งถูกต้อง ${matchedCount} จาก ${correctOrder.length} ขั้นตอน ลองตรวจสอบลำดับเงื่อนไขอีกครั้ง`;

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
