import { gradeOrderClassifySubmission } from "@/core/grading/order-classify";
import type { GradeResult, SubmissionEvidence } from "@/core/modules/contract";

export function gradeIotSeSubmission(params: {
  challengeConfig: Record<string, unknown>;
  solutionCheck: Record<string, unknown>;
  evidence: SubmissionEvidence;
  maxScore: number;
}): GradeResult {
  return gradeOrderClassifySubmission({
    solutionCheck: params.solutionCheck,
    evidence: params.evidence,
    maxScore: params.maxScore,
    perfectFeedback: "ยอดเยี่ยม! ผ่านเกณฑ์วิศวกรรมซอฟต์แวร์ & IoT ครบถ้วนสมบูรณ์ (3 ดาว)",
  });
}
