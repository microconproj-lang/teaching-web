"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Code2,
  Compass,
  Play,
  ShieldCheck,
  Sparkles,
  Swords,
  Terminal,
} from "lucide-react";
import { COURSES, INTERACTIVE_LESSONS, LAB_PROBLEMS, ADVENTURE_ISLANDS } from "@/core/config/curriculum";
import { ALLOWED_EMAIL_DOMAIN } from "@/core/config/brand";
import { runPythonCode } from "@/core/python/runner";
import { usePlatformState } from "@/core/components/PlatformStateProvider";

const HERO_TABS = [
  {
    filename: "main.py",
    label: "สวัสดี PCCPL",
    code: `school = "PCCPL"\nstudent = "นักสำรวจโค้ด"\nfor lvl in range(1, 4):\n    print(f"{school} ม.{lvl} · พร้อมลงมือทำ!")\nprint("สถานะ: พร้อมลุยทุกภารกิจ")`,
  },
  {
    filename: "slicing_m2.py",
    label: "String Slicing",
    code: `word = "COMPUTER"\nprint("ทั้งหมด:", word)\nprint("ตัด [0:4]:", word[0:4])\nprint("กลับหลัง [::-1]:", word[::-1])`,
  },
  {
    filename: "scores_m2.py",
    label: "List & Loop",
    code: `scores = [18, 20, 15, 19]\navg = sum(scores) / len(scores)\nprint("คะแนนสูงสุด:", max(scores))\nprint(f"ค่าเฉลี่ยห้อง: {avg:.2f}")`,
  },
  {
    filename: "cipher_m3.py",
    label: "Cyber Cipher",
    code: `secret = "URYYB"\nshift = 3\ndecoded = chr(ord("D") - shift)\nprint("รหัสที่ถอดได้:", decoded + "LGORITHM")`,
  },
] as const;

export function HomePortalClient({
  errorMessage,
  devAuthEnabled,
}: {
  errorMessage: string | null;
  devAuthEnabled: boolean;
}) {
  const { state } = usePlatformState();
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [editableCode, setEditableCode] = useState<string>(HERO_TABS[0].code);
  const [typedLen, setTypedLen] = useState(HERO_TABS[0].code.length);
  const [isAutoTyping, setIsAutoTyping] = useState(true);
  const [runPhase, setRunPhase] = useState<"typing" | "running" | "done">("done");
  const [customOutput, setCustomOutput] = useState<string[] | null>(null);
  const [gradeFilter, setGradeFilter] = useState<0 | 1 | 2 | 3>(0);

  const activeTab = HERO_TABS[activeTabIdx];

  // Auto-typing showcase animation across tabs (unless edited manually)
  useEffect(() => {
    if (!isAutoTyping) return;
    const full = HERO_TABS[activeTabIdx].code;
    setEditableCode(full);
    setTypedLen(0);
    setCustomOutput(null);
    setRunPhase("typing");

    let cur = 0;
    const interval = window.setInterval(() => {
      cur += 3;
      if (cur >= full.length) {
        setTypedLen(full.length);
        setRunPhase("running");
        window.clearInterval(interval);
        window.setTimeout(() => {
          setRunPhase("done");
        }, 320);
      } else {
        setTypedLen(cur);
      }
    }, 28);

    return () => window.clearInterval(interval);
  }, [activeTabIdx, isAutoTyping]);

  const liveResult = useMemo(() => {
    if (customOutput !== null) return { ok: true, stdout: customOutput, error: null };
    return runPythonCode(editableCode);
  }, [customOutput, editableCode]);

  const handleManualRun = () => {
    setIsAutoTyping(false);
    setRunPhase("running");
    const res = runPythonCode(editableCode);
    setCustomOutput(res.ok ? res.stdout : [res.error ?? "Error"]);
    window.setTimeout(() => setRunPhase("done"), 180);
  };

  const totalSlides = INTERACTIVE_LESSONS.reduce((acc, l) => acc + l.slides.length, 0);
  const totalStages = ADVENTURE_ISLANDS.reduce((acc, i) => acc + i.stages.length, 0);
  const visibleCourses = gradeFilter === 0 ? COURSES : COURSES.filter((c) => c.gradeLevel === gradeFilter);

  return (
    <div className="space-y-8">
      {errorMessage && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-900"
        >
          ⚠️ {errorMessage}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 1. HERO BANNER + LIVE FLOATING PYTHON IDE                             */}
      {/* ===================================================================== */}
      <section className="ed-hero relative overflow-hidden p-6 sm:p-8 lg:p-10">
        {/* Soft warm ambient glow like python.pcshstrg.ac.th */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 left-10 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl"
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-12">
          {/* Left Hero Copy + Shortcuts */}
          <div className="space-y-5 lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#BFE0FF] bg-white/85 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#0A5FE6] shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>PCCPL · COMPUTER SCIENCE (ม.1–ม.3)</span>
            </div>

            <h1 className="font-display text-3xl leading-[1.2] font-semibold text-[#092551] sm:text-5xl">
              เรียนรู้ <span className="ed-h1-gradient">ลงมือทำ</span>
              <br />
              ก้าวสู่<span className="ed-h1-gradient">อนาคต</span>
            </h1>

            <p className="max-w-[46ch] text-sm leading-relaxed text-[#35517D] sm:text-base">
              ศูนย์การเรียนรู้และประเมินผลรายวิชาคอมพิวเตอร์ สำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 1–3
              ฝึกคิดอัลกอริทึม เขียนโค้ด Python และพิชิตภารกิจความมั่นคงไซเบอร์ในที่เดียว
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={state.authenticated ? "/dashboard" : "/lessons"}
                className="ed-btn-primary"
              >
                <span>{state.authenticated ? "เข้าสู่ห้องเรียนของฉัน" : "เริ่มเรียนเลย"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              {!state.authenticated && (
                <Link href="/lessons?mode=guest" className="ed-btn-secondary">
                  <Play className="h-4 w-4 text-[#1364E7]" />
                  <span>ทดลองเรียนก่อน (ไม่ต้อง Login)</span>
                </Link>
              )}

              {!state.authenticated && (
                <Link
                  href="/api/auth/google"
                  className="text-xs font-semibold text-[#0A5FE6] underline-offset-4 hover:underline"
                >
                  เข้าสู่ระบบ {ALLOWED_EMAIL_DOMAIN}
                </Link>
              )}
            </div>

            {/* Dev quick role buttons in local development */}
            {!state.authenticated && devAuthEnabled && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#D4E4FC] bg-white/70 px-3 py-2 text-xs text-[#35517D]">
                <span className="font-semibold">โหมดพัฒนา:</span>
                {(["student", "teacher", "admin"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={async () => {
                      const res = await fetch("/api/auth/dev", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ role: r }),
                      });
                      if (res.ok) window.location.reload();
                    }}
                    className="rounded-lg border border-[#C6DAF9] bg-white px-2.5 py-1 font-semibold text-[#092551] hover:bg-[#EFF6FF]"
                  >
                    เข้าเป็น {r === "student" ? "นักเรียน" : r === "teacher" ? "ครู" : "แอดมิน"}
                  </button>
                ))}
              </div>
            )}

            {/* 4 Quick Feature Squircle Tiles */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 sm:grid-cols-4">
              <Link
                href="/lessons"
                className="group flex flex-col items-start gap-2 rounded-2xl border border-[#DCEAFB] bg-white/90 p-3 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="squircle-blue flex h-9 w-9 items-center justify-center text-white shadow-xs">
                  <BookOpen className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold text-[#092551]">บทเรียน Interactive</span>
              </Link>

              <Link
                href="/lab"
                className="group flex flex-col items-start gap-2 rounded-2xl border border-[#DCEAFB] bg-white/90 p-3 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="squircle-amber flex h-9 w-9 items-center justify-center text-[#092551] shadow-xs">
                  <Code2 className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold text-[#092551]">ฝึกเขียนโค้ด Python</span>
              </Link>

              <Link
                href="/progress"
                className="group flex flex-col items-start gap-2 rounded-2xl border border-[#DCEAFB] bg-white/90 p-3 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="squircle-purple flex h-9 w-9 items-center justify-center text-white shadow-xs">
                  <Award className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold text-[#092551]">ติดตามความก้าวหน้า</span>
              </Link>

              <Link
                href="/adventure"
                className="group flex flex-col items-start gap-2 rounded-2xl border border-[#DCEAFB] bg-white/90 p-3 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="squircle-emerald flex h-9 w-9 items-center justify-center text-white shadow-xs">
                  <Compass className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold text-[#092551]">แผนที่ล่าสมบัติ</span>
              </Link>
            </div>
          </div>

          {/* Right: Tilted Interactive Live Python IDE */}
          <div className="lg:col-span-6">
            <div className="ed-editor-card overflow-hidden transition-transform duration-300 lg:-rotate-2 lg:hover:rotate-0">
              {/* macOS Tab Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#0A1730] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <div className="ml-2 flex flex-wrap gap-1">
                    {HERO_TABS.map((t, idx) => (
                      <button
                        key={t.filename}
                        type="button"
                        onClick={() => {
                          setIsAutoTyping(true);
                          setActiveTabIdx(idx);
                        }}
                        className={`rounded-md px-2 py-1 font-mono text-[11px] transition ${
                          idx === activeTabIdx
                            ? "bg-[#1364E7] font-semibold text-white"
                            : "text-[#8BA9DA] hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {t.filename}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-medium ${
                      runPhase === "typing"
                        ? "text-amber-300"
                        : runPhase === "running"
                          ? "text-sky-300"
                          : "text-[#64DCA2]"
                    }`}
                  >
                    ● {runPhase === "typing" ? "กำลังพิมพ์" : runPhase === "running" ? "กำลังรัน" : "สำเร็จ"}
                  </span>
                  <button
                    type="button"
                    onClick={handleManualRun}
                    className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-2.5 py-1 text-xs font-semibold text-white shadow-xs hover:brightness-110"
                  >
                    <Play className="h-3 w-3" />
                    <span>Run</span>
                  </button>
                </div>
              </div>

              {/* Code Area (editable when clicked!) */}
              <div className="p-4">
                <div className="mb-1 flex items-center justify-between text-[11px] text-[#7896C8]">
                  <span>ตัวอย่าง: {activeTab.label} (คลิกแก้โค้ดแล้วกด Run ได้จริง)</span>
                  <span>Python 3</span>
                </div>
                <textarea
                  id="hero-python-editor"
                  name="hero-python-editor"
                  value={isAutoTyping ? editableCode.slice(0, typedLen) : editableCode}
                  onChange={(e) => {
                    setIsAutoTyping(false);
                    setEditableCode(e.target.value);
                  }}
                  spellCheck={false}
                  rows={5}
                  aria-label="พื้นที่ลองเขียนโค้ด Python หน้าแรก"
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#061229] p-3 font-mono text-[13px] leading-relaxed text-[#E4EDFF] focus:border-[#38BDF8] focus:outline-none"
                />

                {/* Output Console */}
                <div className="mt-3 rounded-xl border border-white/10 bg-[#050E20] p-3">
                  <div className="mb-1 flex items-center gap-1.5 font-mono text-[11px] text-[#64DCA2]">
                    <Terminal className="h-3.5 w-3.5" />
                    <span>Output Console</span>
                  </div>
                  <pre className="min-h-[44px] font-mono text-xs leading-relaxed whitespace-pre-wrap text-[#C9F7DF]">
                    {runPhase === "typing"
                      ? "... กำลังประมวลผลคำสั่ง ..."
                      : liveResult.stdout.length > 0
                        ? liveResult.stdout.join("\n")
                        : "(ไม่มีผลลัพธ์)"}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. KPI CONTENT STATS ROW (4 Crisp White Cards)                        */}
      {/* ===================================================================== */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="ed-card p-5">
          <div className="text-xs font-medium text-[#5C7299]">บทเรียน Interactive</div>
          <div className="font-display mt-1 text-3xl font-semibold text-[#092551]">
            {INTERACTIVE_LESSONS.length} <span className="text-base font-normal text-[#5C7299]">บทเรียนหลัก</span>
          </div>
          <div className="mt-1 text-xs text-[#0A5FE6]">ครอบคลุม ม.1, ม.2 และ ม.3</div>
        </div>

        <div className="ed-card p-5">
          <div className="text-xs font-medium text-[#5C7299]">คลังโจทย์ Coding Lab</div>
          <div className="font-display mt-1 text-3xl font-semibold text-[#092551]">
            {LAB_PROBLEMS.length} <span className="text-base font-normal text-[#5C7299]">ภารกิจโค้ด</span>
          </div>
          <div className="mt-1 text-xs text-emerald-600">ตรวจ Test Case ในเบราว์เซอร์ทันที</div>
        </div>

        <div className="ed-card p-5">
          <div className="text-xs font-medium text-[#5C7299]">แผนที่ล่าสมบัติ</div>
          <div className="font-display mt-1 text-3xl font-semibold text-[#092551]">
            {totalStages} <span className="text-base font-normal text-[#5C7299]">ด่านผจญภัย</span>
          </div>
          <div className="mt-1 text-xs text-purple-600">สะสม Coins แลกของตกแต่ง & สัตว์เลี้ยง</div>
        </div>

        <div className="ed-card p-5">
          <div className="text-xs font-medium text-[#5C7299]">สื่อและสไลด์ Visualizer</div>
          <div className="font-display mt-1 text-3xl font-semibold text-[#092551]">
            {totalSlides} <span className="text-base font-normal text-[#5C7299]">สไลด์โต้ตอบ</span>
          </div>
          <div className="mt-1 text-xs text-amber-600">String Slicing · Binary · Caesar Cipher</div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. SECTION: เลือกเริ่มต้นเรียนรู้                                      */}
      {/* ===================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-xl font-semibold text-[#092856] sm:text-2xl">
            ✦ เลือกเริ่มต้นเรียนรู้
          </h2>
          <Link href="/courses" className="text-sm font-semibold text-[#1364E7] hover:underline">
            ดูแผนผังบทเรียนทั้งหมด →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/lessons" className="ed-card ed-card-hover flex items-start gap-4 p-5">
            <span className="squircle-blue flex h-12 w-12 shrink-0 items-center justify-center text-white shadow-sm">
              <BookOpen className="h-6 w-6" />
            </span>
            <div className="space-y-1">
              <h3 className="font-display text-lg font-semibold text-[#092551]">
                บทเรียน Interactive
              </h3>
              <p className="text-xs leading-relaxed text-[#5C7299]">
                สไลด์ภาพจำลองการทำงานทีละขั้น (String Slicing, Binary, Loop) พร้อมแบบฝึกหัดในหน้าเดียว
              </p>
            </div>
          </Link>

          <Link href="/lab" className="ed-card ed-card-hover flex items-start gap-4 p-5">
            <span className="squircle-amber flex h-12 w-12 shrink-0 items-center justify-center text-[#092551] shadow-sm">
              <Code2 className="h-6 w-6" />
            </span>
            <div className="space-y-1">
              <h3 className="font-display text-lg font-semibold text-[#092551]">
                ฝึกเขียนโค้ด (Coding Lab)
              </h3>
              <p className="text-xs leading-relaxed text-[#5C7299]">
                พื้นที่เขียนและรัน Python แยกจอซ้าย-ขวา พร้อมโจทย์ฝึกมือและระบบบันทึกไฟล์ส่วนตัว
              </p>
            </div>
          </Link>

          <Link href="/arena" className="ed-card ed-card-hover flex items-start gap-4 p-5">
            <span className="squircle-purple flex h-12 w-12 shrink-0 items-center justify-center text-white shadow-sm">
              <Swords className="h-6 w-6" />
            </span>
            <div className="space-y-1">
              <h3 className="font-display text-lg font-semibold text-[#092551]">
                Code Arena & จัดอันดับ
              </h3>
              <p className="text-xs leading-relaxed text-[#5C7299]">
                ทดสอบฝีมือเก็บคะแนน AP ไต่อันดับ Bronze ถึง Diamond พร้อมท้าดวลประจำซีซัน
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. SECTION: เลือกรายวิชาตามระดับชั้น (ม.1 – ม.3)                      */}
      {/* ===================================================================== */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#092856] sm:text-2xl">
              ▣ เลือกรายวิชาตามระดับชั้น (ม.1 – ม.3)
            </h2>
            <p className="text-xs text-[#5C7299]">
              แยกระดับชั้นเรียน ม.1 อัลกอริทึม · ม.2 การเขียนโปรแกรม Python · ม.3 ไซเบอร์และโครงงาน
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 rounded-xl border border-[#E1EAFB] bg-white p-1">
            {[
              { grade: 0 as const, label: "ทั้งหมด" },
              { grade: 1 as const, label: "ม.1" },
              { grade: 2 as const, label: "ม.2" },
              { grade: 3 as const, label: "ม.3" },
            ].map((item) => (
              <button
                key={item.grade}
                type="button"
                onClick={() => setGradeFilter(item.grade)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  gradeFilter === item.grade
                    ? "bg-[#1364E7] text-white shadow-xs"
                    : "text-[#5C7299] hover:bg-[#F4F7FD] hover:text-[#092551]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCourses.map((course) => {
            const isBlueprint = course.theme === "blueprint-navy";
            const isMicrobit = course.theme === "microbit-emerald";
            const isDark = course.theme === "dark-navy" || isBlueprint || isMicrobit;
            const isTeal = course.theme === "teal-shield";
            return (
              <div
                key={course.code}
                className={`flex flex-col justify-between rounded-[20px] p-6 transition hover:-translate-y-0.5 ${
                  isBlueprint
                    ? "border border-[#F0742E]/40 bg-gradient-to-br from-[#071B3D] via-[#092551] to-[#123A78] text-white shadow-[0_14px_34px_rgba(7,27,59,0.22)]"
                    : isMicrobit
                      ? "border border-emerald-400/40 bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#047857] text-white shadow-[0_14px_34px_rgba(4,120,87,0.24)]"
                      : isDark
                        ? "border border-[#224E8C] bg-gradient-to-br from-[#071B3D] to-[#0B387C] text-white shadow-[0_14px_34px_rgba(7,27,59,0.22)]"
                        : isTeal
                          ? "border border-[#BAE6FD] bg-gradient-to-br from-[#FFFFFF] via-[#F0FDFA] to-[#E0F2FE] text-[#092551] shadow-[0_5px_16px_rgba(22,68,124,0.06)]"
                          : "border border-[#E1EAFB] bg-white text-[#092551] shadow-[0_5px_16px_rgba(22,68,124,0.06)]"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isBlueprint
                          ? "bg-[#F0742E] text-white"
                          : isMicrobit
                            ? "bg-emerald-300 text-[#052E16]"
                            : isDark
                              ? "bg-white/15 text-sky-200"
                              : isTeal
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {course.gradeLabel}
                    </span>
                    <span
                      className={`font-mono text-xs font-semibold ${
                        isBlueprint
                          ? "text-[#FDBA74]"
                          : isMicrobit
                            ? "text-emerald-200"
                            : isDark
                              ? "text-emerald-300"
                              : "text-[#0A5FE6]"
                      }`}
                    >
                      {course.code}
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`font-display text-xl font-semibold ${
                        isDark ? "text-white" : "text-[#092551]"
                      }`}
                    >
                      {course.title}
                    </h3>
                    <p
                      className={`mt-1.5 text-xs leading-relaxed ${
                        isDark ? "text-[#C2D2EE]" : "text-[#5C7299]"
                      }`}
                    >
                      {course.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-medium ${
                          isDark
                            ? "border border-white/15 bg-white/10 text-[#E4EDFF]"
                            : "border border-[#E1EAFB] bg-[#F4F7FD] text-[#35517D]"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-current/10 pt-4">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      isDark ? "text-sky-200" : "text-[#5C7299]"
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {course.stats.lessonsCount} บท · {course.stats.missionsCount} ภารกิจ
                  </span>
                  <Link
                    href={`/courses?course=${encodeURIComponent(course.slug ?? course.code)}`}
                    className={
                      isDark
                        ? "inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-[#092551] hover:bg-sky-50"
                        : "ed-btn-primary !min-h-9 !px-4 !text-xs"
                    }
                  >
                    <span>เข้าเรียนเลย</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

