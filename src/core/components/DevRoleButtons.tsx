"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PixelIcon } from "@/core/components/PixelSprite";

export function DevRoleButtons() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const loginAs = async (role: "student" | "teacher" | "admin") => {
    setLoadingRole(role);
    try {
      const res = await fetch("/api/auth/dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="notch border-2 border-dashed border-cloth/60 bg-cloth-deep p-3.5 text-cloth">
      <p className="text-xs font-semibold text-cloth/90">
        ทางลัดทดสอบระบบบนเครื่องพัฒนา (แยกสิทธิ์จำลอง)
      </p>
      <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => loginAs("student")}
          disabled={loadingRole !== null}
          className="notch inline-flex min-h-11 cursor-pointer items-center justify-center gap-1.5 border-2 border-paper bg-paper px-3 text-xs font-semibold text-cloth-deep hover:bg-cloth disabled:opacity-50"
        >
          <PixelIcon name="me" size={14} />
          <span>{loadingRole === "student" ? "กำลังเข้า" : "นักเรียน"}</span>
        </button>
        <button
          type="button"
          onClick={() => loginAs("teacher")}
          disabled={loadingRole !== null}
          className="notch inline-flex min-h-11 cursor-pointer items-center justify-center gap-1.5 border-2 border-paper bg-paper px-3 text-xs font-semibold text-cloth-deep hover:bg-cloth disabled:opacity-50"
        >
          <PixelIcon name="classroom" size={14} />
          <span>{loadingRole === "teacher" ? "กำลังเข้า" : "ครูผู้สอน"}</span>
        </button>
        <button
          type="button"
          onClick={() => loginAs("admin")}
          disabled={loadingRole !== null}
          className="notch inline-flex min-h-11 cursor-pointer items-center justify-center gap-1.5 border-2 border-paper bg-paper px-3 text-xs font-semibold text-cloth-deep hover:bg-cloth disabled:opacity-50"
        >
          <PixelIcon name="settings" size={14} />
          <span>{loadingRole === "admin" ? "กำลังเข้า" : "ผู้ดูแลระบบ"}</span>
        </button>
      </div>
    </div>
  );
}
