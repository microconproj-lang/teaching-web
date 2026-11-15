"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import type { ReviewFlag } from "@/core/db/schema";

interface Props {
  submissionId: string;
  initialFlag: ReviewFlag;
  initialNote: string;
}

export function SubmissionReviewForm({ submissionId, initialFlag, initialNote }: Props) {
  const router = useRouter();
  const [flag, setFlag] = useState<ReviewFlag>(initialFlag);
  const [note, setNote] = useState(initialNote);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleSave = async (nextFlag: ReviewFlag) => {
    setSaving(true);
    setSavedMsg(null);
    try {
      const res = await fetch(`/api/teacher/submissions/${submissionId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewFlag: nextFlag, teacherNote: note }),
      });
      if (res.ok) {
        setFlag(nextFlag);
        setSavedMsg("บันทึกความเห็นของครูแล้ว");
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 space-y-3 border-t border-[#EBF2FE] pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#092551]">ผลการตรวจสอบของครู:</span>

        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave("verified")}
          className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition disabled:opacity-60 ${
            flag === "verified"
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-[#D4E2FA] bg-white text-[#092551] hover:bg-emerald-50 hover:text-emerald-700"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>ถามปากเปล่าแล้ว เข้าใจจริง</span>
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave("flagged")}
          className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition disabled:opacity-60 ${
            flag === "flagged"
              ? "border-red-600 bg-red-600 text-white"
              : "border-[#D4E2FA] bg-white text-[#092551] hover:bg-red-50 hover:text-red-700"
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>ควรถามปากเปล่าเพิ่ม</span>
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave("none")}
          className="inline-flex min-h-9 cursor-pointer items-center gap-1 rounded-xl border border-dashed border-[#C8D9F6] bg-[#F8FAFF] px-3 text-xs font-semibold text-[#5C7299] hover:border-[#1364E7] hover:text-[#092551] disabled:opacity-60"
        >
          <RotateCcw className="h-3 w-3" />
          <span>ล้างสถานะ</span>
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <label
            htmlFor={`teacher-note-${submissionId}`}
            className="block text-xs font-semibold text-[#5C7299]"
          >
            บันทึกเพิ่มเติมสำหรับนักเรียนหรือเก็บไว้ดูย้อนหลัง
          </label>
          <input
            id={`teacher-note-${submissionId}`}
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="เช่น สอบถามปากเปล่าแล้วอธิบายลำดับได้ชัดเจน..."
            className="input-thread mt-1 text-sm"
          />
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave(flag)}
          className="ed-btn-primary min-h-10 px-4 text-sm"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>กำลังบันทึก...</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span>บันทึก</span>
            </>
          )}
        </button>
      </div>

      {savedMsg && (
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>{savedMsg}</span>
        </p>
      )}
    </div>
  );
}
