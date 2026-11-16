import { gradeOrderClassifySubmission } from "@/core/grading/order-classify";
import type { GradeResult, SubmissionEvidence } from "@/core/modules/contract";

export function gradeCyberDefenseM3Submission(params: {
  challengeConfig: Record<string, unknown>;
  solutionCheck: Record<string, unknown>;
  evidence: SubmissionEvidence;
  maxScore: number;
}): GradeResult {
  return gradeOrderClassifySubmission({
    solutionCheck: params.solutionCheck,
    evidence: params.evidence,
    maxScore: params.maxScore,
    perfectFeedback: "ยอดเยี่ยม! ผ่านภารกิจเทคโนโลยีดิจิทัลและนวัตกรรม ว23103 ครบสมบูรณ์ (3 ดาว)",
  });
}
