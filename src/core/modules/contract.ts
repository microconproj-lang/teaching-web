import type { ComponentType } from "react";
import type { ChallengeDifficulty, ModuleRuntimeType, ReviewFlag } from "@/core/db/schema";

export interface CodeSnapshot {
  /** เวลาที่ผ่านไปนับจากเริ่มทำด่าน (วินาที) */
  t: number;
  code: string;
}

export interface ProcessTelemetry {
  keystrokes: number;
  pasteChars: number;
  pasteEvents: number;
  tabSwitches: number;
  durationSec: number;
  hintsUsed: number;
  runCount: number;
  snapshots?: CodeSnapshot[];
}

export interface MicroCheckResult {
  question: string;
  selectedOption: string;
  answeredCorrect: boolean;
}

export interface SubmissionEvidence {
  answer?: unknown;
  code?: string;
  telemetry: ProcessTelemetry;
  microCheck?: MicroCheckResult;
  [key: string]: unknown;
}

export interface ChallengeClientView {
  id: string;
  challengeKey: string;
  title: string;
  orderIndex: number;
  difficulty: ChallengeDifficulty;
  maxScore: number;
  xpReward: number;
  /** เฉพาะ config ที่ปลอดภัย (ไม่ส่ง solutionCheck ให้ Client) */
  config: Record<string, unknown>;
  /** Seed ประจำตัวนักเรียนสำหรับสุ่มโจทย์เฉพาะคน */
  studentSeed: number;
}

export interface ChallengeProgressView {
  passed: boolean;
  bestStars: number;
}

export interface ModulePlayerProps {
  assignmentId: string;
  moduleKey: string;
  challenges: ChallengeClientView[];
  disablePaste: boolean;
  focusMode: boolean;
  initialState?: Record<string, unknown>;
  /** ความคืบหน้าเดิมรายด่าน (key = challengeId) ใช้วาดแผนที่ผ้าและปลดล็อกด่าน */
  progress?: Record<string, ChallengeProgressView>;
  /** เปิดตรงไปยังด่านที่ระบุจากแผนที่ */
  initialChallengeId?: string;
  /** เส้นทางปุ่มออกกลับหน้าหลัก */
  backHref?: string;
  /** ครู/แอดมินเปิดดูได้ทุกด่านโดยไม่ต้องปลดล็อก */
  unlockAll?: boolean;
}

export interface GradeResult {
  score: number;
  maxScore: number;
  stars: 0 | 1 | 2 | 3;
  passed: boolean;
  feedback: string;
  reviewFlag: ReviewFlag;
  reviewReasons: string[];
}

export interface ModuleBadgeManifest {
  key: string;
  title: string;
  description: string;
  /** ลาย pixel art 12×12 (12 แถว แถวละ 12 ตัว: '.'=ว่าง, '+'=ครามเข้ม, '#'=ชมพูฝาง) */
  pixelGrid: string[];
}

export interface ModuleManifest {
  moduleKey: string;
  version: string;
  title: string;
  description: string;
  runtimeType: ModuleRuntimeType;
  targetGrades: (1 | 2 | 3)[];
  competencyTags: string[];
  worldKey?: "world-1" | "world-2" | "world-3" | "world-4" | "world-5";
  badges?: ModuleBadgeManifest[];
}

export interface ModuleDefinition {
  manifest: ModuleManifest;
  /** โหลด Component เฉพาะตอนเปิดใช้งาน Module นี้ (Lazy Load) */
  loadPlayer: () => Promise<{ default: ComponentType<ModulePlayerProps> }>;
  /** ฟังก์ชันตรวจคำตอบฝั่ง Server */
  gradeSubmission: (params: {
    challengeConfig: Record<string, unknown>;
    solutionCheck: Record<string, unknown>;
    evidence: SubmissionEvidence;
    maxScore: number;
    studentSeed: number;
  }) => Promise<GradeResult> | GradeResult;
}
