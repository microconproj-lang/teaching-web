import { createHash } from "node:crypto";
import type { ReviewFlag } from "@/core/db/schema";
import type { ProcessTelemetry } from "@/core/modules/contract";

/**
 * สร้าง Seed ประจำตัวนักเรียนแบบคงที่ต่อ (studentId + challengeId + semesterId)
 * ใช้สุ่มตัวเลขโจทย์/ลำดับตัวเลือก เพื่อไม่ให้นักเรียน Copy คำตอบจากเพื่อนตรงๆ
 */
export function generateStudentSeed(
  studentId: string,
  challengeId: string,
  semesterId: string
): number {
  const digest = createHash("sha256")
    .update(`${studentId}:${challengeId}:${semesterId}`)
    .digest();
  return digest.readUInt32BE(0);
}

/**
 * ตัวสุ่มตัวเลขแบบกำหนด Seed ได้ (Mulberry32)
 */
export function createSeededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface TelemetryRiskReport {
  reviewFlag: ReviewFlag;
  reasons: string[];
}

/**
 * ประเมินความเสี่ยงจากการ Copy หรือใช้ AI ทำแทนโดยดูจาก "กระบวนการลงมือทำ"
 * หมายเหตุ: ใช้เป็น Flag เพื่อช่วยครูสังเกตและเดินตรวจในห้อง ไม่ใช้ตัดสินตกอัตโนมัติ
 */
export function evaluateTelemetryRisk(
  telemetry: ProcessTelemetry,
  codeLength = 0
): TelemetryRiskReport {
  const reasons: string[] = [];

  if (telemetry.pasteChars >= 60 && telemetry.keystrokes < 25) {
    reasons.push(`วางข้อความ ${telemetry.pasteChars} ตัวอักษร แต่พิมพ์เอง ${telemetry.keystrokes} ครั้ง`);
  } else if (telemetry.pasteEvents >= 2 && telemetry.pasteChars >= 120) {
    reasons.push(`มีเหตุการณ์ Paste ${telemetry.pasteEvents} ครั้ง (${telemetry.pasteChars} ตัวอักษร)`);
  }

  if (codeLength >= 80 && telemetry.durationSec > 0 && telemetry.durationSec < 10 && telemetry.keystrokes < 20) {
    reasons.push(`ส่งคำตอบยาวใน ${telemetry.durationSec} วินาทีโดยแทบไม่มีการพิมพ์`);
  }

  if (telemetry.tabSwitches >= 4) {
    reasons.push(`สลับออกจากหน้าต่างข้อสอบ ${telemetry.tabSwitches} ครั้ง`);
  }

  if (reasons.length >= 2) {
    return { reviewFlag: "flagged", reasons };
  }
  if (reasons.length === 1) {
    return { reviewFlag: "needs_review", reasons };
  }
  return { reviewFlag: "none", reasons: [] };
}

