"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, Download, ExternalLink, Eye, EyeOff, FolderKanban } from "lucide-react";

export interface TeacherAssignmentCardItem {
  id: string;
  title: string;
  roomName: string;
  dueAtIso: string | null;
  isPublished: boolean;
}

function inferGradeTab(roomName: string): "ม.1" | "ม.2" | "ม.3" | "อื่นๆ" {
  if (roomName.includes("ม.1") || roomName.includes("M.1") || roomName.includes("1/")) return "ม.1";
  if (roomName.includes("ม.2") || roomName.includes("M.2") || roomName.includes("2/")) return "ม.2";
  if (roomName.includes("ม.3") || roomName.includes("M.3") || roomName.includes("3/")) return "ม.3";
  return "อื่นๆ";
}

export function TeacherDashboardClient({
  assignments,
}: {
  assignments: TeacherAssignmentCardItem[];
}) {
  const [gradeFilter, setGradeFilter] = useState<"all" | "ม.1" | "ม.2" | "ม.3">("all");

  const filtered = useMemo(() => {
    if (gradeFilter === "all") return assignments;
    return assignments.filter((a) => inferGradeTab(a.roomName) === gradeFilter);
  }, [assignments, gradeFilter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "ม.1", "ม.2", "ม.3"] as const).map((tab) => {
            const count =
              tab === "all"
                ? assignments.length
                : assignments.filter((a) => inferGradeTab(a.roomName) === tab).length;
            const active = gradeFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setGradeFilter(tab)}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
                  active
                    ? "bg-[#1364E7] text-white shadow-sm"
                    : "border border-[#D4E2FA] bg-white text-[#5C7299] hover:border-[#9FC0F8] hover:text-[#092551]"
                }`}
              >
                <span>{tab === "all" ? "ทุกระดับชั้น" : `ชั้น ${tab}`}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    active ? "bg-white/20 text-white" : "bg-[#EFF6FF] text-[#1364E7]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <Link href="/admin" className="ed-btn-secondary text-sm">
          <FolderKanban className="h-4 w-4 text-[#1364E7]" />
          <span>มอบหมายงาน / จัดการห้อง</span>
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className="ed-card p-8 text-center">
          <p className="text-base font-semibold text-[#092551]">
            ยังไม่มีงานที่มอบหมาย{gradeFilter !== "all" ? `ในระดับชั้น ${gradeFilter}` : "ในภาคเรียนนี้"}
          </p>
          <p className="mt-1 text-sm text-[#5C7299]">
            ไปที่หน้าจัดการระบบแอดมินเพื่อมอบหมายชุดภารกิจให้นักเรียนแต่ละห้อง
          </p>
          <div className="mt-4">
            <Link href="/admin" className="ed-btn-primary text-sm">
              เปิดหน้าจัดการห้องเรียนและงาน
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((a) => (
            <article key={a.id} className="ed-card ed-card-hover p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-[#EFF6FF] px-2.5 py-1 text-xs font-bold text-[#1364E7]">
                    {a.roomName}
                  </span>
                  <span className="rounded-lg bg-[#F4F7FD] px-2 py-1 text-xs font-semibold text-[#5C7299]">
                    {inferGradeTab(a.roomName)}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    a.isPublished
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {a.isPublished ? (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      เปิดให้นักเรียนทำอยู่
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      ซ่อนไว้ (ร่าง)
                    </>
                  )}
                </span>
              </div>

              <h3 className="mt-3 font-display text-lg font-bold text-[#092551]">{a.title}</h3>
              {a.dueAtIso && (
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[#5C7299]">
                  <Calendar className="h-4 w-4" />
                  กำหนดส่ง {new Date(a.dueAtIso).toLocaleDateString("th-TH")}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2.5 border-t border-[#EBF2FE] pt-4">
                <Link href={`/teacher/assignments/${a.id}`} className="ed-btn-primary text-sm">
                  <ExternalLink className="h-4 w-4" />
                  <span>เปิด Heatmap ห้องเรียน</span>
                </Link>
                <a
                  href={`/api/teacher/export?assignmentId=${a.id}`}
                  className="ed-btn-secondary text-sm"
                >
                  <Download className="h-4 w-4 text-[#1364E7]" />
                  <span>ส่งออกคะแนน CSV</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

