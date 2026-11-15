"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReviewFlag } from "@/core/db/schema";
import { SubmissionReviewForm } from "@/core/components/SubmissionReviewForm";
import { PixelIcon } from "@/core/components/PixelSprite";

export interface HeatmapRosterRow {
  studentId: string;
  studentNumber: number;
  fullName: string;
  email: string;
}

export interface HeatmapChallengeCol {
  id: string;
  title: string;
  orderIndex: number;
  worldShortCode: string;
}

export interface HeatmapCellProgress {
  bestScore: number;
  bestStars: number;
  passed: boolean;
  attemptsCount: number;
  hasReviewFlag: boolean;
}

export interface HeatmapAttemptDetail {
  id: string;
  attemptNo: number;
  score: number;
  maxScore: number;
  stars: number;
  passed: boolean;
  submittedAtIso: string;
  reviewFlag: ReviewFlag;
  teacherNote: string | null;
  codeOrAnswer: unknown;
  durationSec: number;
  keystrokes: number;
  pasteChars: number;
  pasteEvents: number;
  tabSwitches: number;
  reviewReasons: string[];
}

type CellStatus = "mastered" | "passed" | "stuck" | "none";

function getCellStatus(prog: HeatmapCellProgress | undefined): CellStatus {
  if (!prog) return "none";
  if (prog.bestStars === 3) return "mastered";
  if (prog.passed) return "passed";
  return "stuck";
}

/**
 * ช่องตะเข็บ Heatmap แยกสถานะได้แม้ปิดสี (ลายข้าวหลามตัด / กากบาท / ฟันปลา / เส้นยืนประ) + ปมมุมช่อง
 */
export function StitchCellGlyph({
  status,
  hasKnot,
}: {
  status: CellStatus;
  hasKnot: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={36}
      height={36}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {status === "mastered" && (
        <>
          <rect x="0" y="0" width="24" height="24" fill="#2E9E5B" />
          {/* ลายข้าวหลามตัดเต็มช่อง */}
          <path
            d="M12 3 L21 12 L12 21 L3 12 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          <rect x="10" y="10" width="4" height="4" fill="#FFFFFF" />
        </>
      )}

      {status === "passed" && (
        <>
          <rect x="0" y="0" width="24" height="24" fill="#F2B432" />
          {/* กากบาท cross-stitch */}
          <path
            d="M5 5 L19 19 M19 5 L5 19"
            stroke="#1B2760"
            strokeWidth="3"
          />
        </>
      )}

      {status === "stuck" && (
        <>
          <rect x="0" y="0" width="24" height="24" fill="#D6334C" />
          {/* ฟันปลา ซิกแซ็ก */}
          <polyline
            points="3,16 7,8 12,16 17,8 21,16"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
        </>
      )}

      {status === "none" && (
        <>
          <rect x="0" y="0" width="24" height="24" fill="#C5CCE0" />
          {/* เส้นยืนเปล่า (เส้นตั้งประ) */}
          <line x1="8" y1="3" x2="8" y2="21" stroke="#1B2760" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="16" y1="3" x2="16" y2="21" stroke="#1B2760" strokeWidth="2" strokeDasharray="3 3" />
        </>
      )}

      {/* ปมจุดเล็กที่มุมช่อง (สัญญาณให้ครูสังเกต ไม่ใช่ธงแดง) */}
      {hasKnot && (
        <>
          <rect x="17" y="1" width="6" height="6" fill="#FFFFFF" stroke="#1B2760" strokeWidth="1.5" />
          <rect x="19" y="3" width="2" height="2" fill="#1B2760" />
        </>
      )}
    </svg>
  );
}

export function TeacherHeatmapClient({
  assignmentId,
  roster,
  challenges,
  progressByKey,
  attemptsByKey,
}: {
  assignmentId: string;
  roster: HeatmapRosterRow[];
  challenges: HeatmapChallengeCol[];
  progressByKey: Record<string, HeatmapCellProgress>;
  attemptsByKey: Record<string, HeatmapAttemptDetail[]>;
}) {
  const [onlyFlagged, setOnlyFlagged] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    studentId: string;
    challengeId: string;
  } | null>(null);
  const [selectedAttemptIdx, setSelectedAttemptIdx] = useState(0);

  const visibleRoster = roster.filter((st) => {
    if (!onlyFlagged) return true;
    return challenges.some((ch) => {
      const p = progressByKey[`${st.studentId}:${ch.id}`];
      const status = getCellStatus(p);
      return Boolean(p?.hasReviewFlag) || status === "stuck";
    });
  });

  const activeStudent = selectedCell
    ? roster.find((r) => r.studentId === selectedCell.studentId) ?? null
    : null;
  const activeChallenge = selectedCell
    ? challenges.find((c) => c.id === selectedCell.challengeId) ?? null
    : null;
  const activeAttempts = selectedCell
    ? attemptsByKey[`${selectedCell.studentId}:${selectedCell.challengeId}`] ?? []
    : [];
  const inspectedAttempt = activeAttempts[selectedAttemptIdx] ?? activeAttempts[0] ?? null;

  return (
    <div className="space-y-4">
      {/* ตัวกรองและคำอธิบายลายปัก (แยกได้แม้ปิดสี) */}
      <div className="ed-card flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#092551]">
          <span className="inline-flex items-center gap-1.5">
            <StitchCellGlyph status="mastered" hasKnot={false} />
            <span>3 ดาว (ลายข้าวหลามตัด)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <StitchCellGlyph status="passed" hasKnot={false} />
            <span>ผ่าน (กากบาท)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <StitchCellGlyph status="stuck" hasKnot={false} />
            <span>ติดขัดหลายครั้ง (ฟันปลา)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <StitchCellGlyph status="none" hasKnot={false} />
            <span>ยังไม่ทำ (เส้นประ)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-xs border-2 border-[#092551] bg-white" />
            <span>จุดมุมช่อง = ควรถามปากเปล่า</span>
          </span>
        </div>

        <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#D4E2FA] bg-[#F8FAFF] px-3.5 text-sm font-semibold text-[#092551] hover:border-[#9FC0F8]">
          <input
            type="checkbox"
            checked={onlyFlagged}
            onChange={(e) => setOnlyFlagged(e.target.checked)}
            className="h-4 w-4 accent-[#1364E7]"
          />
          <span>ดูเฉพาะคนที่ควรสังเกต</span>
        </label>
      </div>

      {/* ตาราง Heatmap ของห้อง + แผงตรวจรายช่องทางขวา */}
      <div className="grid items-start gap-6 lg:grid-cols-12">
        <div
          className={`ed-card overflow-hidden ${
            selectedCell ? "lg:col-span-7" : "lg:col-span-12"
          }`}
        >
          <div className="max-h-[65vh] overflow-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#DCE7FA] bg-[#F8FAFF] text-xs font-bold text-[#092551]">
                  <th className="sticky left-0 top-0 z-30 border-b border-r border-[#DCE7FA] bg-[#F8FAFF] px-3 py-3 text-center">
                    เลขที่
                  </th>
                  <th className="sticky left-14 top-0 z-30 min-w-44 border-b border-r border-[#DCE7FA] bg-[#F8FAFF] px-3 py-3">
                    ชื่อ-สกุล
                  </th>
                  {challenges.map((ch, idx) => (
                    <th
                      key={ch.id}
                      className="sticky top-0 z-20 border-b border-r border-[#EBF2FE] bg-[#F8FAFF] px-2.5 py-3 text-center"
                      title={ch.title}
                    >
                      {ch.worldShortCode} · {idx + 1}
                    </th>
                  ))}
                  <th className="sticky top-0 z-20 border-b border-[#DCE7FA] bg-[#F8FAFF] px-3 py-3 text-right">
                    รวม
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EBF2FE]">
                {visibleRoster.length === 0 ? (
                  <tr>
                    <td
                      colSpan={challenges.length + 3}
                      className="px-4 py-8 text-center text-sm text-[#5C7299]"
                    >
                      {onlyFlagged
                        ? "ไม่มีนักเรียนที่เข้าข่ายควรสังเกตในตอนนี้"
                        : "ยังไม่มีรายชื่อนักเรียนในห้องนี้"}
                    </td>
                  </tr>
                ) : (
                  visibleRoster.map((student) => {
                    let totalScore = 0;
                    let anyFlag = false;

                    for (const ch of challenges) {
                      const p = progressByKey[`${student.studentId}:${ch.id}`];
                      if (p) {
                        totalScore += p.bestScore;
                        if (p.hasReviewFlag) anyFlag = true;
                      }
                    }

                    return (
                      <tr key={student.studentId} className="hover:bg-[#F8FAFF]">
                        <td className="sticky left-0 z-10 w-14 border-r border-[#EBF2FE] bg-white px-3 py-2 text-center font-semibold text-[#092551]">
                          {student.studentNumber}
                        </td>
                        <td className="sticky left-14 z-10 border-r border-[#EBF2FE] bg-white px-3 py-2">
                          <Link
                            href={`/teacher/assignments/${assignmentId}/students/${student.studentId}`}
                            className="font-semibold text-[#1364E7] underline-offset-2 hover:underline"
                          >
                            {student.fullName}
                          </Link>
                          {anyFlag && (
                            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                              ควรถามปากเปล่า
                            </span>
                          )}
                        </td>

                        {challenges.map((ch, idx) => {
                          const key = `${student.studentId}:${ch.id}`;
                          const p = progressByKey[key];
                          const status = getCellStatus(p);
                          const isSelected =
                            selectedCell?.studentId === student.studentId &&
                            selectedCell?.challengeId === ch.id;

                          return (
                            <td key={ch.id} className="border-r border-[#EBF2FE] px-2 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCell({ studentId: student.studentId, challengeId: ch.id });
                                  setSelectedAttemptIdx(0);
                                }}
                                aria-label={`เลขที่ ${student.studentNumber} ${student.fullName} ด่าน ${
                                  idx + 1
                                } ${
                                  status === "mastered"
                                    ? "3 ดาว"
                                    : status === "passed"
                                      ? "ผ่าน"
                                      : status === "stuck"
                                        ? "ติดขัดหลายครั้ง"
                                        : "ยังไม่ทำ"
                                }${p?.hasReviewFlag ? " ควรถามปากเปล่า" : ""}`}
                                className={`inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg p-1 transition ${
                                  isSelected ? "ring-2 ring-[#1364E7] bg-[#EFF6FF]" : "hover:bg-[#F4F7FD]"
                                }`}
                              >
                                <StitchCellGlyph
                                  status={status}
                                  hasKnot={Boolean(p?.hasReviewFlag)}
                                />
                              </button>
                            </td>
                          );
                        })}

                        <td className="px-3 py-2 text-right font-bold text-[#092551]">
                          {totalScore.toFixed(0)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* แผงด้านขวา: โค้ดล่าสุด, Playback ลำดับการแก้, จำนวนครั้ง, เวลาที่ใช้ */}
        {selectedCell && activeStudent && activeChallenge && (
          <aside className="ed-card p-5 lg:col-span-5">
            <div className="flex items-start justify-between gap-2 border-b border-[#EBF2FE] pb-3">
              <div>
                <div className="text-xs font-semibold text-[#5C7299]">
                  เลขที่ {activeStudent.studentNumber} · ด่านที่ {activeChallenge.orderIndex}
                </div>
                <h2 className="font-display text-lg font-bold text-[#092551]">{activeStudent.fullName}</h2>
                <p className="text-sm text-[#5C7299]">{activeChallenge.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCell(null)}
                aria-label="ปิดแผงตรวจ"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#DCE7FA] bg-[#F8FAFF] text-[#092551] hover:bg-[#EFF6FF]"
              >
                <PixelIcon name="close" size={16} />
              </button>
            </div>

            {activeAttempts.length === 0 ? (
              <p className="mt-4 text-sm text-[#5C7299]">
                นักเรียนคนนี้ยังไม่ได้ส่งคำตอบในด่านนี้
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {/* เลือก Playback ลำดับการส่งแต่ละครั้ง */}
                <div>
                  <div className="text-xs font-semibold text-[#5C7299]">
                    ลำดับการส่งงาน ({activeAttempts.length} ครั้ง)
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activeAttempts.map((att, idx) => (
                      <button
                        key={att.id}
                        type="button"
                        onClick={() => setSelectedAttemptIdx(idx)}
                        className={`min-h-9 cursor-pointer rounded-xl border px-3 text-xs font-semibold transition ${
                          idx === selectedAttemptIdx
                            ? "border-[#1364E7] bg-[#1364E7] text-white"
                            : "border-[#D4E2FA] bg-white text-[#092551] hover:bg-[#F8FAFF]"
                        }`}
                      >
                        ครั้งที่ {att.attemptNo} ({att.passed ? `${att.stars} ดาว` : "ยังไม่ผ่าน"})
                      </button>
                    ))}
                  </div>
                </div>

                {inspectedAttempt && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#E1EAFB] bg-[#F8FAFF] p-3 text-xs text-[#092551]">
                      <div>
                        เวลาที่ใช้: <strong>{inspectedAttempt.durationSec} วินาที</strong>
                      </div>
                      <div>
                        การจัดเรียง/พิมพ์: <strong>{inspectedAttempt.keystrokes} ครั้ง</strong>
                      </div>
                      <div>
                        Paste: <strong>{inspectedAttempt.pasteChars} ตัว</strong> ({inspectedAttempt.pasteEvents} ครั้ง)
                      </div>
                      <div>
                        สลับแท็บ: <strong>{inspectedAttempt.tabSwitches} ครั้ง</strong>
                      </div>
                    </div>

                    {inspectedAttempt.reviewReasons.length > 0 && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900">
                        <PixelIcon name="knot" size={14} className="mr-1.5" />
                        <span>
                          ควรถามปากเปล่า ({inspectedAttempt.reviewReasons.join(" · ")})
                        </span>
                      </div>
                    )}

                    <div>
                      <div className="mb-1 text-xs font-semibold text-[#5C7299]">
                        คำตอบ/โค้ดในครั้งที่ {inspectedAttempt.attemptNo}
                      </div>
                      <pre className="max-h-52 overflow-auto rounded-2xl bg-[#081A37] p-3 font-code text-xs text-[#E4EDFF]">
                        {JSON.stringify(inspectedAttempt.codeOrAnswer, null, 2)}
                      </pre>
                    </div>

                    <SubmissionReviewForm
                      submissionId={inspectedAttempt.id}
                      initialFlag={inspectedAttempt.reviewFlag}
                      initialNote={inspectedAttempt.teacherNote ?? ""}
                    />
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    href={`/teacher/assignments/${assignmentId}/students/${activeStudent.studentId}`}
                    className="ed-btn-secondary w-full text-sm"
                  >
                    ดูประวัติทุกด่านของ {activeStudent.fullName}
                  </Link>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

