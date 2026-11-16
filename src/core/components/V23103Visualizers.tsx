"use client";

import { useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Database,
  Filter,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface SensorSurveyRow {
  id: string;
  zone: string;
  source: "ปฐมภูมิ (IoT Sensor)" | "ทุติยภูมิ (รายงาน)";
  tempC: number | null;
  moisture: number;
  note: "ok" | "dup" | "missing" | "outlier" | "format";
}

const RAW_DATASET: SensorSurveyRow[] = [
  { id: "R01", zone: "North Zone", source: "ปฐมภูมิ (IoT Sensor)", tempC: 29, moisture: 62, note: "ok" },
  { id: "R02", zone: "  south zone ", source: "ปฐมภูมิ (IoT Sensor)", tempC: 31, moisture: 45, note: "format" },
  { id: "R03", zone: "Greenhouse A", source: "ปฐมภูมิ (IoT Sensor)", tempC: 27, moisture: 74, note: "ok" },
  { id: "R04", zone: "Greenhouse A", source: "ปฐมภูมิ (IoT Sensor)", tempC: 27, moisture: 74, note: "dup" },
  { id: "R05", zone: "South Zone", source: "ทุติยภูมิ (รายงาน)", tempC: null, moisture: 48, note: "missing" },
  { id: "R06", zone: "EAST ZONE", source: "ปฐมภูมิ (IoT Sensor)", tempC: 999, moisture: 35, note: "outlier" },
];

const LITERACY_CASES = [
  {
    title: "กรณีที่ 1: ค่าเซนเซอร์วัดตรงจากแปลงผักโรงเรียน vs บทความไม่ระบุผู้เขียน",
    kind: "Primary vs Secondary",
    reliable: true,
    detail:
      "ข้อมูลจากเซนเซอร์ IoT ที่บันทึกวันเวลา-สถานที่จริงคือข้อมูลปฐมภูมิ (Primary) มีความน่าเชื่อถือสูงกว่าบทความที่ไม่มีแหล่งอ้างอิงต้นตอ",
  },
  {
    title: "กรณีที่ 2: 'ทุกวันที่ฝนตกถนนเปียก ดังนั้นถ้าถนนเปียกแปลว่าฝนตกแน่นอน'",
    kind: "เหตุผลวิบัติ (Logical Fallacy)",
    reliable: false,
    detail:
      "เป็นเหตุผลวิบัติ (Affirming the Consequent) เพราะถนนเปียกอาจเกิดจากการรดน้ำต้นไม้หรือล้างถนนก็ได้ ต้องตรวจสอบหลักฐานเพิ่มเติม",
  },
  {
    title: "กรณีที่ 3: นำกราฟสภาพอากาศจากกรมอุตุฯ มาใช้วิเคราะห์โครงงานโดยระบุแหล่งที่มา",
    kind: "Fair Use (ลิขสิทธิ์โดยชอบธรรม)",
    reliable: true,
    detail:
      "เข้าข่ายการใช้งานโดยชอบธรรม (Fair Use) เพื่อการศึกษาและไม่แสวงหากำไร โดยมีเงื่อนไขสำคัญคือต้องอ้างอิงเจ้าของผลงานและแหล่งที่มาให้ครบถ้วน",
  },
  {
    title: "กรณีที่ 4: ข้อความแชร์ต่อ 'กดลิงก์ด่วนเพื่อรับเครื่องวัดอุณหภูมิฟรี ภายใน 5 นาที'",
    kind: "ข่าวปลอม / ความปลอดภัย (ว 4.2 ม.3/3)",
    reliable: false,
    detail:
      "มักเป็นเทคนิคเร่งรีบให้หลงเชื่อ (Phishing/Hoax) ควรตรวจสอบแหล่งต้นตอ หน่วยงานทางการ และหลีกเลี่ยงการกรอกข้อมูลส่วนบุคคล",
  },
];

/**
 * Interactive Visualizer สำหรับ ว23103 หน่วยที่ 3 (Data Cleansing, Dashboard และความน่าเชื่อถือข้อมูล)
 */
export function DataCleansingVisualizer() {
  const [tab, setTab] = useState<"cleansing" | "literacy">("cleansing");
  const [removeDup, setRemoveDup] = useState(false);
  const [dropMissing, setDropMissing] = useState(false);
  const [dropOutlier, setDropOutlier] = useState(false);
  const [normalizeText, setNormalizeText] = useState(false);
  const [selectedCase, setSelectedCase] = useState(0);

  const cleanedRows = RAW_DATASET.filter((row) => {
    if (removeDup && row.note === "dup") return false;
    if (dropMissing && row.tempC === null) return false;
    if (dropOutlier && row.tempC !== null && (row.tempC < 0 || row.tempC > 60)) return false;
    return true;
  }).map((row) => ({
    ...row,
    displayZone: normalizeText
      ? row.zone
          .trim()
          .toLowerCase()
          .replace(/\b\w/g, (ch) => ch.toUpperCase())
      : row.zone,
  }));

  const validTemps = cleanedRows
    .map((r) => r.tempC)
    .filter((v): v is number => typeof v === "number" && v >= 0 && v <= 60);
  const avgTemp =
    validTemps.length > 0
      ? (validTemps.reduce((a, b) => a + b, 0) / validTemps.length).toFixed(1)
      : "N/A";
  const avgMoisture =
    cleanedRows.length > 0
      ? Math.round(cleanedRows.reduce((a, r) => a + r.moisture, 0) / cleanedRows.length)
      : 0;

  const appliedSteps = [removeDup, dropMissing, dropOutlier, normalizeText].filter(Boolean).length;
  const qualityPct = Math.round((appliedSteps / 4) * 100);

  const resetAll = () => {
    setRemoveDup(false);
    setDropMissing(false);
    setDropOutlier(false);
    setNormalizeText(false);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab("cleansing")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              tab === "cleansing"
                ? "bg-[#1364E7] text-white shadow-xs"
                : "border border-[#D4E4FC] bg-white text-[#35517D] hover:border-[#1364E7]"
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>1. Data Cleansing & Mini Dashboard</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("literacy")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              tab === "literacy"
                ? "bg-[#092551] text-emerald-300 shadow-xs"
                : "border border-[#D4E4FC] bg-white text-[#35517D] hover:border-[#092551]"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>2. ความน่าเชื่อถือข้อมูล, เหตุผลวิบัติ & Fair Use</span>
          </button>
        </div>

        {tab === "cleansing" && (
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1 rounded-lg border border-[#D4E2FA] bg-white px-2.5 py-1 text-xs font-semibold text-[#5C7299] hover:text-[#092551]"
          >
            <RotateCcw className="h-3 w-3" />
            <span>รีเซ็ตชุดข้อมูล</span>
          </button>
        )}
      </div>

      {tab === "cleansing" ? (
        <div className="space-y-4">
          {/* Cleansing Toggles */}
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "1. ตัดแถวซ้ำ (Deduplicate)", active: removeDup, toggle: () => setRemoveDup((v) => !v) },
              { label: "2. ลบค่าว่าง (Null)", active: dropMissing, toggle: () => setDropMissing((v) => !v) },
              { label: "3. กรอง Outlier (>60°C)", active: dropOutlier, toggle: () => setDropOutlier((v) => !v) },
              { label: "4. จัด Format (.strip.title)", active: normalizeText, toggle: () => setNormalizeText((v) => !v) },
            ].map((btn) => (
              <button
                key={btn.label}
                type="button"
                onClick={btn.toggle}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                  btn.active
                    ? "border-emerald-400 bg-emerald-50 text-emerald-900 shadow-xs"
                    : "border-[#D4E4FC] bg-white text-[#35517D] hover:border-[#1364E7]"
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                <span>{btn.label}</span>
              </button>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#DCE7FA] bg-white p-3 lg:col-span-7">
              <div className="mb-2 flex items-center justify-between text-xs font-bold text-[#092551]">
                <span>ตารางข้อมูลแปลงเกษตรอัจฉริยะ ({cleanedRows.length} แถว)</span>
                <span className="rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-[11px] text-[#1364E7]">
                  คุณภาพข้อมูล {qualityPct}%
                </span>
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E1EAFB] text-[11px] text-[#5C7299]">
                    <th className="py-1.5 pr-2">ID</th>
                    <th className="py-1.5 pr-2">พื้นที่ (Zone)</th>
                    <th className="py-1.5 pr-2">อุณหภูมิ (°C)</th>
                    <th className="py-1.5">ความชื้น (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {cleanedRows.map((r) => {
                    const hasIssue =
                      (r.note === "dup" && !removeDup) ||
                      (r.note === "missing" && !dropMissing) ||
                      (r.note === "outlier" && !dropOutlier) ||
                      (r.note === "format" && !normalizeText);
                    return (
                      <tr key={r.id} className="border-b border-[#F1F5FE] last:border-0">
                        <td className="py-1.5 pr-2 font-mono font-bold text-[#092551]">{r.id}</td>
                        <td className="py-1.5 pr-2 font-mono text-[11px]">
                          {`"${r.displayZone}"`}
                          {hasIssue && r.note === "format" && (
                            <span className="ml-1 rounded bg-amber-100 px-1 text-[10px] text-amber-800">
                              format
                            </span>
                          )}
                          {hasIssue && r.note === "dup" && (
                            <span className="ml-1 rounded bg-rose-100 px-1 text-[10px] text-rose-800">
                              ซ้ำ
                            </span>
                          )}
                        </td>
                        <td className="py-1.5 pr-2 font-mono">
                          {r.tempC === null ? (
                            <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">
                              NULL
                            </span>
                          ) : r.tempC > 60 ? (
                            <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">
                              {r.tempC} (Outlier!)
                            </span>
                          ) : (
                            r.tempC
                          )}
                        </td>
                        <td className="py-1.5 font-mono">{r.moisture}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Live Dashboard Preview */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#1E3B6E] bg-[#081A37] p-4 text-white lg:col-span-5">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-200">
                <BarChart3 className="h-4 w-4 text-[#64DCA2]" />
                <span>Dashboard Preview (Looker Studio / ThingsBoard)</span>
              </div>

              <div className="my-3 grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-[11px] text-sky-200">อุณหภูมิเฉลี่ย</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-[#64DCA2]">
                    {appliedSteps === 4 ? `${avgTemp}°C` : dropOutlier ? `${avgTemp}°C` : "เพี้ยน!"}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-[11px] text-sky-200">ความชื้นเฉลี่ย</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-amber-300">{avgMoisture}%</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] text-[#8BA9DA]">กราฟความชื้นรายแถวหลังคัดกรอง:</div>
                {cleanedRows.map((r) => (
                  <div key={r.id} className="flex items-center gap-2 text-[10px]">
                    <span className="w-7 font-mono text-sky-200">{r.id}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all"
                        style={{ width: `${Math.min(100, r.moisture)}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-white">{r.moisture}%</span>
                  </div>
                ))}
              </div>

              {qualityPct === 100 && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-2.5 py-1.5 text-[11px] font-bold text-emerald-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>ข้อมูลสะอาด 100% พร้อมนำไปสร้าง Dashboard จริงแล้ว!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-2 md:grid-cols-2">
            {LITERACY_CASES.map((item, idx) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setSelectedCase(idx)}
                className={`rounded-xl border p-3 text-left text-xs transition ${
                  idx === selectedCase
                    ? "border-[#1364E7] bg-white font-semibold text-[#092551] shadow-xs"
                    : "border-[#E1EAFB] bg-white/75 text-[#5C7299] hover:bg-white"
                }`}
              >
                <div className="text-[10px] font-bold uppercase text-[#1364E7]">{item.kind}</div>
                <div className="mt-0.5 text-[#092551]">{item.title}</div>
              </button>
            ))}
          </div>

          {(() => {
            const current = LITERACY_CASES[selectedCase];
            return (
              <div
                className={`flex items-start gap-3 rounded-xl border p-4 text-xs font-medium ${
                  current.reliable
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-rose-200 bg-rose-50 text-rose-900"
                }`}
              >
                {current.reliable ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                )}
                <div>
                  <div className="font-bold">{current.kind}</div>
                  <p className="mt-0.5 leading-relaxed">{current.detail}</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
