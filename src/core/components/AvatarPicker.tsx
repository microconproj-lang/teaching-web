"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { AVATAR_OPTIONS, DEFAULT_AVATAR_KEY, getAvatar } from "@/core/avatars";
import { AvatarEmblem } from "@/core/components/AvatarEmblem";

interface AvatarPickerProps {
  currentKey: string | null | undefined;
  currentDisplayName: string;
  frameKey?: string | null;
  readOnlyGuest?: boolean;
}

export function AvatarPicker({
  currentKey,
  currentDisplayName,
  frameKey = "none",
  readOnlyGuest = false,
}: AvatarPickerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(currentKey ?? DEFAULT_AVATAR_KEY);
  const [displayName, setDisplayName] = useState(currentDisplayName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    const trimmed = displayName.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      setError("กรุณาตั้งชื่อโปรไฟล์ระหว่าง 2–20 ตัวอักษร");
      return;
    }
    if (readOnlyGuest) {
      setOpen(false);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/me/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarKey: selected, displayName: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "บันทึกข้อมูลไม่สำเร็จ");
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ในขณะนี้");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-[#DCE7FA] bg-[#F8FAFF] p-1.5 transition hover:border-[#227FF5] hover:bg-white"
        aria-label="แก้ไขรูปโปรไฟล์และชื่อ"
        title="คลิกเพื่อเปลี่ยนอวตาร"
      >
        <AvatarEmblem avatarKey={selected} frameKey={frameKey} size={56} />
        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-[#5C7299] shadow-xs group-hover:text-[#1364E7]">
          <Pencil className="h-3.5 w-3.5" />
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#06152E]/65 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="avatar-modal-title"
        >
          <div className="w-full max-w-lg rounded-3xl border border-[#DCE7FA] bg-white p-6 text-[#092551] shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-[#EBF2FE] pb-4">
              <div>
                <h2 id="avatar-modal-title" className="font-display text-xl font-bold">
                  เลือกอวตารและชื่อโปรไฟล์
                </h2>
                <p className="mt-0.5 text-sm text-[#5C7299]">
                  แสดงบนโปรไฟล์ กระดานคะแนนห้องเรียน และ Coding Arena
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="ปิดหน้าต่าง"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#E1EAFB] bg-[#F8FAFF] text-[#092551] hover:bg-[#EFF6FF]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {AVATAR_OPTIONS.map((a) => {
                const isSel = a.key === selected;
                return (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => setSelected(a.key)}
                    className={`flex min-h-20 cursor-pointer flex-col items-center justify-center rounded-2xl border p-2.5 transition ${
                      isSel
                        ? "border-[#1364E7] bg-[#EFF6FF] ring-2 ring-[#1364E7]/20"
                        : "border-[#E1EAFB] bg-[#F8FAFF] hover:border-[#9FC0F8] hover:bg-white"
                    }`}
                  >
                    <AvatarEmblem avatarKey={a.key} frameKey={isSel ? frameKey : "none"} size={40} />
                    <span className="mt-1.5 text-center text-[11px] font-semibold text-[#092551]">
                      {a.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5">
              <label htmlFor="display-name-input" className="block text-sm font-semibold text-[#092551]">
                ชื่อโปรไฟล์ ({getAvatar(selected).label})
              </label>
              <input
                id="display-name-input"
                type="text"
                maxLength={20}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="ตั้งชื่อเรียก 2–20 ตัวอักษร"
                className="input-thread mt-1.5"
              />
              {readOnlyGuest && (
                <p className="mt-1.5 text-xs text-[#5C7299]">
                  * เข้าสู่ระบบด้วย @pccpl.ac.th เพื่อบันทึกชื่อและอวตารลงบัญชีโรงเรียน
                </p>
              )}
            </div>

            {error && (
              <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2.5">
              <button type="button" onClick={() => setOpen(false)} className="ed-btn-secondary">
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={save}
                className="ed-btn-primary"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>กำลังบันทึก...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>{readOnlyGuest ? "ตกลง" : "บันทึกโปรไฟล์"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
