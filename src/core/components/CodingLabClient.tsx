"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Code2,
  FileCode2,
  HelpCircle,
  Play,
  Plus,
  Save,
  Sparkles,
  Terminal,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { LAB_PROBLEMS, matchesCourseCode } from "@/core/config/curriculum";
import { EDITOR_THEMES, getEditorTheme } from "@/core/config/shop";
import {
  gradePythonChallenge,
  runPythonCode,
  type PythonGradeResult,
} from "@/core/python/runner";
import { usePlatformState } from "@/core/components/PlatformStateProvider";

export function CodingLabClient({
  initialGrade = 0,
  initialCourse = "",
}: {
  initialGrade?: number;
  initialCourse?: string;
}) {
  const { state, saveLabFile, deleteLabFile, recordLabSolve, equipItem } = usePlatformState();
  const [leftTab, setLeftTab] = useState<"problems" | "files">("problems");
  const [gradeFilter, setGradeFilter] = useState<number>(initialGrade);
  const [courseFilter, setCourseFilter] = useState<string>(initialCourse);

  const initialMatch =
    (initialCourse
      ? LAB_PROBLEMS.find((p) => matchesCourseCode(p.courseCode ?? "", initialCourse))
      : initialGrade > 0
        ? LAB_PROBLEMS.find((p) => p.gradeLevel === initialGrade)
        : undefined) ?? LAB_PROBLEMS[0];

  const [selectedProblemKey, setSelectedProblemKey] = useState<string>(initialMatch.key);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const [filename, setFilename] = useState<string>(initialMatch.filename);
  const [code, setCode] = useState<string>(initialMatch.starterCode);
  const [stdinText, setStdinText] = useState<string>(
    (initialMatch.testCases[0]?.stdin ?? []).join("\n")
  );
  const [fontSize, setFontSize] = useState<number>(14);
  const [showHint, setShowHint] = useState(false);

  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [consoleError, setConsoleError] = useState<string | null>(null);
  const [gradeResult, setGradeResult] = useState<PythonGradeResult | null>(null);

  const activeProblem =
    leftTab === "problems"
      ? LAB_PROBLEMS.find((p) => p.key === selectedProblemKey) ?? LAB_PROBLEMS[0]
      : null;

  const theme = getEditorTheme(state.equippedThemeKey);
  const ownedThemes = EDITOR_THEMES.filter(
    (t) => t.price === 0 || state.inventory.some((i) => i.itemKey === t.key)
  );

  const filteredProblems = LAB_PROBLEMS.filter((p) => {
    if (courseFilter) return matchesCourseCode(p.courseCode ?? "", courseFilter);
    return gradeFilter === 0 ? true : p.gradeLevel === gradeFilter;
  });

  const selectProblem = (key: string) => {
    const p = LAB_PROBLEMS.find((x) => x.key === key);
    if (!p) return;
    setLeftTab("problems");
    setSelectedProblemKey(p.key);
    setSelectedFileId(null);
    setFilename(p.filename);
    setCode(p.starterCode);
    setStdinText((p.testCases[0]?.stdin ?? []).join("\n"));
    setShowHint(false);
    setConsoleLines([]);
    setConsoleError(null);
    setGradeResult(null);
  };

  const selectPersonalFile = (fileId: string) => {
    const f = state.labFiles.find((x) => x.id === fileId);
    if (!f) return;
    setLeftTab("files");
    setSelectedFileId(f.id);
    setFilename(f.title);
    setCode(f.code);
    setStdinText("");
    setConsoleLines([]);
    setConsoleError(null);
    setGradeResult(null);
  };

  const createNewFile = () => {
    setLeftTab("files");
    setSelectedFileId(null);
    setFilename(`practice_${state.labFiles.length + 1}.py`);
    setCode(`# เขียนโค้ด Python ที่นี่\nprint("Hello PCCPL Coding Lab!")\n`);
    setConsoleLines([]);
    setConsoleError(null);
    setGradeResult(null);
  };

  const handleRun = useCallback(() => {
    const inputs = stdinText ? stdinText.split("\n") : [];
    const res = runPythonCode(code, inputs);
    setConsoleLines(res.stdout);
    setConsoleError(res.error);
    setGradeResult(null);
  }, [code, stdinText]);

  const handleSave = useCallback(async () => {
    await saveLabFile(filename || "untitled.py", code, selectedFileId ?? undefined);
  }, [code, filename, saveLabFile, selectedFileId]);

  const handleSubmitTests = async () => {
    if (!activeProblem) return;
    const res = gradePythonChallenge(code, activeProblem.testCases);
    setGradeResult(res);
    setConsoleLines(res.results.map((r) => `${r.passed ? "✓" : "✗"} ${r.label}: ${r.actual}`));
    setConsoleError(res.results.find((r) => r.error)?.error ?? null);

    if (res.passed) {
      if (state.authenticated && state.dbConnected) {
        await fetch("/api/lab/files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "submit_problem",
            problemKey: activeProblem.key,
            code,
          }),
        });
      }
      await recordLabSolve(activeProblem.key, activeProblem.coinReward, activeProblem.title);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void handleSave();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleRun, handleSave]);

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#D4E4FC] bg-white px-5 py-4 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="squircle-amber flex h-11 w-11 items-center justify-center text-[#092551] shadow-xs">
            <Code2 className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-xl font-semibold text-[#092551] sm:text-2xl">
              Coding Lab · ฝึกเขียนและรันโค้ด Python
            </h1>
            <p className="text-xs text-[#5C7299]">
              เขียนและทดสอบโค้ดได้ทันที (ทางลัด: Ctrl+Enter รันโค้ด · Ctrl+S บันทึกไฟล์)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs font-medium text-[#5C7299]">
            <span>ธีม IDE:</span>
            <select
              value={state.equippedThemeKey}
              onChange={(e) => equipItem("theme", e.target.value)}
              className="rounded-xl border border-[#D4E2FA] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#092551]"
            >
              {ownedThemes.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* Split Pane Workspace */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left Pane: Problems & My Files */}
        <aside className="ed-card flex flex-col justify-between overflow-hidden lg:col-span-5">
          <div>
            <div className="flex border-b border-[#E1EAFB] bg-[#F8FAFF] p-2">
              <button
                type="button"
                onClick={() => setLeftTab("problems")}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold transition ${leftTab === "problems"
                  ? "bg-white text-[#1364E7] shadow-xs"
                  : "text-[#5C7299] hover:text-[#092551]"
                  }`}
              >
                โจทย์ฝึกปฏิบัติ ({LAB_PROBLEMS.length})
              </button>
              <button
                type="button"
                onClick={() => setLeftTab("files")}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold transition ${leftTab === "files"
                  ? "bg-white text-[#1364E7] shadow-xs"
                  : "text-[#5C7299] hover:text-[#092551]"
                  }`}
              >
                ไฟล์ของฉัน ({state.labFiles.length})
              </button>
            </div>

            {leftTab === "problems" ? (
              <div className="space-y-4 p-4">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: "g0", label: "ทั้งหมด", active: gradeFilter === 0 && !courseFilter, onClick: () => { setGradeFilter(0); setCourseFilter(""); } },
                    { key: "v21103", label: "ม.1 (ว21103)", active: matchesCourseCode("ว21103", courseFilter) || (gradeFilter === 1 && !courseFilter), onClick: () => { setCourseFilter("ว21103"); setGradeFilter(1); } },
                    { key: "v21202", label: "ว21202 micro:bit", active: matchesCourseCode("ว21202", courseFilter), onClick: () => { setCourseFilter("ว21202"); setGradeFilter(1); } },
                    { key: "g2", label: "ม.2", active: gradeFilter === 2 && !courseFilter, onClick: () => { setGradeFilter(2); setCourseFilter(""); } },
                    { key: "v23103", label: "ม.3 (ว23103)", active: matchesCourseCode("ว23103", courseFilter) || (gradeFilter === 3 && !courseFilter), onClick: () => { setCourseFilter("ว23103"); setGradeFilter(3); } },
                    { key: "v23202", label: "ว23202 IoT", active: matchesCourseCode("ว23202", courseFilter), onClick: () => { setCourseFilter("ว23202"); setGradeFilter(3); } },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={tab.onClick}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${tab.active
                        ? tab.key === "v23202"
                          ? "bg-[#092551] text-[#F0742E]"
                          : tab.key === "v21202"
                            ? "bg-[#065F46] text-emerald-200"
                            : "bg-[#1364E7] text-white"
                        : "bg-[#F4F7FD] text-[#5C7299] hover:bg-[#E1EAFB]"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {filteredProblems.map((p) => {
                    const solved = state.solvedLabKeys.includes(p.key);
                    const active = p.key === selectedProblemKey;
                    return (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => selectProblem(p.key)}
                        className={`flex w-full items-center justify-between gap-2 rounded-xl border p-3 text-left transition ${active
                          ? "border-[#1364E7] bg-[#EFF6FF] shadow-xs"
                          : "border-[#E1EAFB] bg-white hover:bg-[#F8FAFF]"
                          }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${matchesCourseCode(p.courseCode ?? "", "ว23202")
                                ? "bg-[#092551] text-[#F0742E]"
                                : matchesCourseCode(p.courseCode ?? "", "ว21202")
                                  ? "bg-[#065F46] text-emerald-200"
                                  : "bg-[#E1EAFB] text-[#092551]"
                                }`}
                            >
                              {p.courseCode ?? `ม.${p.gradeLevel}`}
                            </span>
                            <span className="truncate text-xs font-semibold text-[#092551]">
                              {p.title}
                            </span>
                          </div>
                          <div className="mt-0.5 text-[11px] text-[#5C7299]">
                            {p.topic} · {p.difficulty} · +{p.coinReward} Coins
                          </div>
                        </div>
                        {solved && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                {activeProblem && (
                  <div className="rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-4 text-xs leading-relaxed text-[#11264A]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-sm font-semibold text-[#092551]">
                        รายละเอียดโจทย์
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowHint((h) => !h)}
                        className="inline-flex items-center gap-1 font-semibold text-amber-700 hover:underline"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span>{showHint ? "ซ่อนคำใบ้" : "ดูคำใบ้"}</span>
                      </button>
                    </div>
                    <p className="mt-2">{activeProblem.description}</p>
                    {showHint && (
                      <div className="mt-2.5 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-amber-900">
                        💡 {activeProblem.hint}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#092551]">ไฟล์โค้ดส่วนตัว</span>
                  <button
                    type="button"
                    onClick={createNewFile}
                    className="ed-btn-primary !min-h-8 !px-3 !text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>สร้างไฟล์ใหม่</span>
                  </button>
                </div>

                {!state.authenticated && (
                  <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-[11px] text-sky-900">
                    กำลังทำงานในโหมด Guest: ไฟล์จะบันทึกไว้ในเบราว์เซอร์เครื่องนี้ (เข้าสู่ระบบ{" "}
                    @pccpl.ac.th เพื่อซิงก์ขึ้นคลาวด์โรงเรียน)
                  </div>
                )}

                <div className="space-y-2">
                  {state.labFiles.map((f) => (
                    <div
                      key={f.id}
                      className={`flex items-center justify-between gap-2 rounded-xl border p-2.5 ${selectedFileId === f.id
                        ? "border-[#1364E7] bg-[#EFF6FF]"
                        : "border-[#E1EAFB] bg-white"
                        }`}
                    >
                      <button
                        type="button"
                        onClick={() => selectPersonalFile(f.id)}
                        className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      >
                        <FileCode2 className="h-4 w-4 shrink-0 text-[#1364E7]" />
                        <span className="truncate font-mono text-xs font-semibold text-[#092551]">
                          {f.title}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteLabFile(f.id)}
                        className="rounded-lg p-1.5 text-[#7485A4] hover:bg-rose-50 hover:text-rose-600"
                        title="ลบไฟล์"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Pane: Themed Python IDE + Input + Console */}
        <section className="space-y-4 lg:col-span-7">
          <div className={`overflow-hidden rounded-2xl border ${theme.borderClass} ${theme.bgClass} shadow-xl`}>
            {/* IDE Toolbar */}
            <div className={`flex flex-wrap items-center justify-between gap-2 px-4 py-3 ${theme.barClass}`}>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className={`ml-2 w-40 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-xs font-semibold ${theme.textClass}`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setFontSize((s) => Math.max(12, s - 1))}
                  className="rounded-lg bg-white/10 p-1.5 text-[#C2D2EE] hover:bg-white/20"
                  title="ย่อตัวอักษร"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className={`px-1 font-mono text-[11px] ${theme.textClass}`}>{fontSize}px</span>
                <button
                  type="button"
                  onClick={() => setFontSize((s) => Math.min(20, s + 1))}
                  className="rounded-lg bg-white/10 p-1.5 text-[#C2D2EE] hover:bg-white/20"
                  title="ขยายตัวอักษร"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/25"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>บันทึกไฟล์</span>
                </button>

                <button
                  type="button"
                  onClick={handleRun}
                  className="inline-flex items-center gap-1 rounded-xl bg-[#1364E7] px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Run</span>
                </button>

                {activeProblem && (
                  <button
                    type="button"
                    onClick={handleSubmitTests}
                    className="inline-flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-400"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>ส่งตรวจ Test</span>
                  </button>
                )}
              </div>
            </div>

            {/* Code Editor */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              rows={12}
              style={{ fontSize: `${fontSize}px` }}
              className={`w-full resize-y bg-transparent p-4 font-mono leading-relaxed focus:outline-none ${theme.textClass}`}
            />

            {/* Stdin Input Box */}
            <div className="border-t border-white/10 bg-black/20 px-4 py-3">
              <label className="block font-mono text-[11px] text-[#8BA9DA]">
                Input ทดสอบสำหรับคำสั่ง input() (1 บรรทัดต่อ 1 ค่า):
              </label>
              <textarea
                value={stdinText}
                onChange={(e) => setStdinText(e.target.value)}
                rows={2}
                placeholder="เช่น Alice"
                className={`mt-1 w-full rounded-lg border border-white/10 bg-black/25 px-3 py-1.5 font-mono text-xs focus:outline-none ${theme.textClass}`}
              />
            </div>

            {/* Console Output */}
            <div className="border-t border-white/10 bg-black/40 p-4 font-mono text-xs">
              <div className="mb-1.5 flex items-center gap-1.5 text-emerald-400">
                <Terminal className="h-3.5 w-3.5" />
                <span>Console Output</span>
              </div>
              {consoleError ? (
                <pre className="whitespace-pre-wrap text-rose-300">{consoleError}</pre>
              ) : (
                <pre className="min-h-[54px] whitespace-pre-wrap text-[#E4EDFF]">
                  {consoleLines.length > 0 ? consoleLines.join("\n") : "กดปุ่ม Run (หรือ Ctrl+Enter) เพื่อดูผลลัพธ์"}
                </pre>
              )}
            </div>
          </div>

          {gradeResult && (
            <div
              className={`ed-card border p-4 text-xs ${gradeResult.passed
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-rose-200 bg-rose-50 text-rose-900"
                }`}
            >
              <div className="font-display text-sm font-semibold">
                {gradeResult.passed
                  ? `🎉 ผ่านครบ ${gradeResult.passedCount}/${gradeResult.totalCount} Test Cases!`
                  : `ผลการตรวจ: ผ่าน ${gradeResult.passedCount}/${gradeResult.totalCount} Test Cases`}
              </div>
              <div className="mt-2 space-y-1.5">
                {gradeResult.results.map((r, i) => (
                  <div key={i} className="rounded-lg bg-white/80 px-3 py-2 font-mono">
                    {r.passed ? "✅" : "❌"} {r.label} — คาดหวัง: &quot;{r.expected}&quot; · ได้:{" "}
                    &quot;{r.error || r.actual}&quot;
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

