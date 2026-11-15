"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Focus, ShieldAlert } from "lucide-react";

interface Props {
  assignmentId: string;
  initialPublished: boolean;
  initialFocusMode: boolean;
  initialDisablePaste: boolean;
}

export function AssignmentSettingsControls({
  assignmentId,
  initialPublished,
  initialFocusMode,
  initialDisablePaste,
}: Props) {
  const router = useRouter();
  const [isPublished, setIsPublished] = useState(initialPublished);
  const [focusMode, setFocusMode] = useState(initialFocusMode);
  const [disablePaste, setDisablePaste] = useState(initialDisablePaste);
  const [saving, setSaving] = useState(false);

  const toggleSetting = async (
    key: "isPublished" | "focusMode" | "disablePaste",
    nextVal: boolean
  ) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/teacher/assignments/${assignmentId}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: nextVal }),
      });
      if (res.ok) {
        if (key === "isPublished") setIsPublished(nextVal);
        if (key === "focusMode") setFocusMode(nextVal);
        if (key === "disablePaste") setDisablePaste(nextVal);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        disabled={saving}
        onClick={() => toggleSetting("isPublished", !isPublished)}
        className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition disabled:opacity-60 ${
          isPublished
            ? "border-[#1364E7] bg-[#1364E7] text-white shadow-xs"
            : "border-[#D4E2FA] bg-white text-[#5C7299] hover:border-[#9FC0F8] hover:text-[#092551]"
        }`}
      >
        {isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        <span>{isPublished ? "เปิดให้นักเรียนทำอยู่" : "ซ่อนงานไว้ (ร่าง)"}</span>
      </button>

      <button
        type="button"
        disabled={saving}
        onClick={() => toggleSetting("focusMode", !focusMode)}
        className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition disabled:opacity-60 ${
          focusMode
            ? "border-[#1364E7]/40 bg-[#EFF6FF] text-[#1364E7]"
            : "border-[#D4E2FA] bg-white text-[#5C7299] hover:border-[#9FC0F8]"
        }`}
      >
        <Focus className="h-4 w-4" />
        <span>โหมดตั้งสมาธิ: {focusMode ? "เปิด" : "ปิด"}</span>
      </button>

      <button
        type="button"
        disabled={saving}
        onClick={() => toggleSetting("disablePaste", !disablePaste)}
        className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition disabled:opacity-60 ${
          disablePaste
            ? "border-amber-300 bg-amber-50 text-amber-800"
            : "border-[#D4E2FA] bg-white text-[#5C7299] hover:border-[#9FC0F8]"
        }`}
      >
        <ShieldAlert className="h-4 w-4" />
        <span>ห้ามวางข้อความ (Paste): {disablePaste ? "เปิด" : "ปิด"}</span>
      </button>
    </div>
  );
}
