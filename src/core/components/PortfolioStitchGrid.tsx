"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Lock, Play, Star } from "lucide-react";
import { findWorldForModule } from "@/core/config/worlds";

export interface PortfolioTileItem {
  challengeId: string;
  challengeTitle: string;
  moduleKey: string;
  moduleTitle: string;
  assignmentId: string;
  orderIndex: number;
  bestScore: number;
  bestStars: 0 | 1 | 2 | 3;
  attemptsCount: number;
  passed: boolean;
}

export interface PortfolioAttemptItem {
  id: string;
  challengeId: string;
  challengeTitle: string;
  attemptNo: number;
  score: number;
  stars: number;
  passed: boolean;
  submittedAtIso: string;
  durationSec: number;
  teacherNote: string | null;
}

export function PortfolioStitchGrid({
  tiles,
  attempts,
  isLockedSemester,
}: {
  tiles: PortfolioTileItem[];
  attempts: PortfolioAttemptItem[];
  isLockedSemester: boolean;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(tiles[0]?.challengeId ?? null);
  const selectedTile = tiles.find((t) => t.challengeId === selectedId) ?? null;
  const selectedAttempts = attempts.filter((a) => a.challengeId === selectedId);

  if (tiles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#C8D9F6] bg-[#F8FAFF] p-8 text-center text-sm text-[#5C7299]">
        ยังไม่มีประวัติการส่งงานในภาคเรียนนี้ เริ่มทำภารกิจแรกเพื่อบันทึกคะแนนและคำแนะนำจากครูผู้สอน
      </div>
    );
  }

  return (
    <div className="ed-card space-y-5 p-5 sm:p-6">
      {isLockedSemester && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-900">
            <Lock className="h-4 w-4" />
            ภาคเรียนนี้ปิดรับงานแล้ว
          </span>
          <span className="text-xs font-semibold text-amber-800">
            สามารถดูผลงานและคะแนนย้อนหลังได้ แต่ไม่สามารถส่งแก้คะแนนเพิ่มได้
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {tiles.map((tile) => {
          const world = findWorldForModule(tile.moduleKey);
          const isSelected = tile.challengeId === selectedId;
          const stageCode = `${world.order}-${tile.orderIndex}`;

          return (
            <button
              key={`${tile.assignmentId}-${tile.challengeId}`}
              type="button"
              onClick={() => setSelectedId(tile.challengeId)}
              className={`flex min-h-24 cursor-pointer flex-col items-start justify-between rounded-2xl border p-3.5 text-left transition ${
                isSelected
                  ? "border-[#1364E7] bg-[#EFF6FF] ring-2 ring-[#1364E7]/20"
                  : tile.passed
                    ? "border-emerald-200 bg-emerald-50/40 hover:border-emerald-300"
                    : "border-[#E1EAFB] bg-[#F8FAFF] hover:border-[#9FC0F8] hover:bg-white"
              }`}
            >
              <div className="flex w-full items-center justify-between gap-1">
                <span className="rounded-lg bg-white px-2 py-0.5 text-[11px] font-bold text-[#1364E7] ring-1 ring-[#D4E2FA]">
                  {stageCode}
                </span>
                {tile.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Clock className="h-4 w-4 text-[#7485A4]" />
                )}
              </div>

              <div className="mt-2 line-clamp-1 text-xs font-bold text-[#092551]">
                {tile.challengeTitle}
              </div>

              <div className="mt-1 flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`h-3.5 w-3.5 ${
                      s <= tile.bestStars ? "fill-amber-400 text-amber-400" : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {selectedTile && (
        <div className="space-y-4 rounded-2xl border border-[#DCE7FA] bg-[#F8FAFF] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-[#5C7299]">{selectedTile.moduleTitle}</div>
              <h3 className="font-display text-lg font-bold text-[#092551]">
                {selectedTile.challengeTitle}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#092551] ring-1 ring-[#DCE7FA]">
                คะแนนสูงสุด {selectedTile.bestScore.toFixed(0)} · ส่งแล้ว {selectedTile.attemptsCount} ครั้ง
              </span>
              {!isLockedSemester && (
                <Link
                  href={`/learn/${selectedTile.assignmentId}?stage=${encodeURIComponent(
                    selectedTile.challengeId
                  )}`}
                  className="ed-btn-primary text-sm"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>ไปที่ด่านนี้</span>
                </Link>
              )}
            </div>
          </div>

          {selectedAttempts.length === 0 ? (
            <p className="text-sm text-[#5C7299]">ยังไม่มีรายการส่งงานในด่านนี้</p>
          ) : (
            <div className="space-y-2.5">
              {selectedAttempts.map((att) => (
                <div
                  key={att.id}
                  className="rounded-2xl border border-[#E1EAFB] bg-white p-4 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-[#092551]">ครั้งที่ {att.attemptNo}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          att.passed
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {att.passed ? `ผ่านแล้ว ${att.stars} ดาว` : "ยังไม่ผ่าน"}
                      </span>
                    </div>
                    <span className="text-xs text-[#5C7299]">
                      {new Date(att.submittedAtIso).toLocaleString("th-TH")} · ใช้เวลา{" "}
                      {att.durationSec} วินาที
                    </span>
                  </div>

                  {att.teacherNote && (
                    <div className="mt-2.5 rounded-xl bg-[#EFF6FF] px-3 py-2 text-xs font-medium text-[#092551]">
                      ความเห็นครูผู้สอน: {att.teacherNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
