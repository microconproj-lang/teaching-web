"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Lightbulb,
  Moon,
  Sun,
  Wrench,
  Zap,
} from "lucide-react";

type ResistorOption = "0" | "220" | "10000";
type SimMode = "safety" | "autolight";

/**
 * จำลองการต่อวงจร Micro:bit + Breadboard + ตัวต้านทาน + หลอด LED บน Tinkercad
 * พร้อมโหมดใบงาน 5.1 ระบบเปิด-ปิดไฟ LED อัตโนมัติด้วยเซนเซอร์วัดแสง (ว21103 หน่วยที่ 5)
 */
export function TinkercadCircuitVisualizer() {
  const [simMode, setSimMode] = useState<SimMode>("safety");
  const [resistor, setResistor] = useState<ResistorOption>("220");
  const [polarityOk, setPolarityOk] = useState(true);
  const [gndConnected, setGndConnected] = useState(true);
  const [manualBlink, setManualBlink] = useState(true);
  const [blinkState, setBlinkState] = useState(true);
  const [lightLevel, setLightLevel] = useState(75);
  const [threshold, setThreshold] = useState(100);

  useEffect(() => {
    if (simMode !== "safety" || !manualBlink) return;
    const timer = window.setInterval(() => {
      setBlinkState((prev) => !prev);
    }, 700);
    return () => window.clearInterval(timer);
  }, [simMode, manualBlink]);

  const logicRequestsOn =
    simMode === "safety" ? (manualBlink ? blinkState : true) : lightLevel < threshold;

  const isOvercurrent = resistor === "0" && polarityOk && gndConnected && logicRequestsOn;
  const isCircuitHealthy = resistor !== "0" && polarityOk && gndConnected;
  const isLedLit = isCircuitHealthy && logicRequestsOn;
  const isDim = isLedLit && resistor === "10000";

  const currentMa = !gndConnected || !polarityOk || !logicRequestsOn
    ? "0.0"
    : resistor === "0"
      ? "> 80 (เกินพิกัด!)"
      : resistor === "220"
        ? "5.9"
        : "0.13";

  let statusKind: "danger" | "bug" | "ok" | "standby" = "ok";
  let statusTitle = "วงจรทำงานถูกต้องและปลอดภัย";
  let statusMessage =
    simMode === "autolight"
      ? `ค่าแสง ${lightLevel} < เกณฑ์ ${threshold} (มืด) → ขา P0 จ่ายสัญญาณ 1 (HIGH) หลอด LED ติดสว่างอัตโนมัติ`
      : resistor === "10000"
        ? "วงจรปลอดภัย แต่ตัวต้านทาน 10kΩ สูงเกินไป ทำให้กระแสเพียง 0.13 mA หลอด LED จึงติดริบหรี่มาก"
        : "กระแส ~5.9 mA ไหลผ่านตัวต้านทาน 220Ω → ขา Anode (+) → LED → ขา Cathode (-) → GND อย่างปลอดภัย";

  if (!gndConnected) {
    statusKind = "bug";
    statusTitle = "พบข้อบกพร่อง: วงจรเปิด (ไม่มีสาย GND)";
    statusMessage =
      "กระแสไฟฟ้าไม่สามารถไหลกลับครบวงจรได้ ต้องต่อสายไฟจากขาสั้นของ LED (Cathode -) กลับไปยังขา GND ของ Micro:bit";
  } else if (!polarityOk) {
    statusKind = "bug";
    statusTitle = "พบข้อบกพร่อง: ต่อหลอด LED กลับขั้ว";
    statusMessage =
      "LED เป็นอุปกรณ์มีขั้ว กระแสไหลทิศทางเดียว — ต้องต่อขายาว (Anode +) รับไฟจาก P0 ผ่านตัวต้านทาน และขาสั้น (Cathode -) ลง GND";
  } else if (resistor === "0") {
    statusKind = "danger";
    statusTitle = isOvercurrent
      ? "คำเตือนความปลอดภัย (ว 4.1 ม.1/5): หลอด LED เสียหาย!"
      : "คำเตือนความปลอดภัย (ว 4.1 ม.1/5): ยังไม่ได้ใส่ตัวต้านทาน (0Ω)!";
    statusMessage =
      "ไม่ได้ต่อตัวต้านทาน (0Ω) ทันทีที่ขา P0 จ่ายไฟ HIGH กระแสจะพุ่งเกินพิกัดของ LED และพอร์ต Micro:bit! ให้ใส่ตัวต้านทาน 220Ω ก่อนทดลองจริง";
  } else if (!logicRequestsOn) {
    statusKind = "standby";
    if (simMode === "autolight") {
      statusTitle = "โหมดประหยัดพลังงาน: หลอด LED ปิดอยู่";
      statusMessage = `ค่าแสง ${lightLevel} ≥ เกณฑ์ ${threshold} (สว่าง) → ขา P0 จ่ายสัญญาณ 0 (LOW) ปิดหลอด LED เพื่อประหยัดพลังงาน`;
    } else {
      statusTitle = "จังหวะ OFF (กระพริบ)";
      statusMessage = `จังหวะ LOW (0V): ขา P0 หยุดจ่ายไฟชั่วคราว (วงจรต่อตัวต้านทาน ${resistor === "220" ? "220Ω" : "10kΩ"} ถูกต้องและปลอดภัย)`;
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSimMode("safety")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${simMode === "safety"
                ? "bg-[#1364E7] text-white shadow-xs"
                : "border border-[#D4E4FC] bg-white text-[#35517D] hover:border-[#1364E7]"
              }`}
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>1. ทดลองต่อวงจร & ตัวต้านทาน (Tinkercad)</span>
          </button>
          <button
            type="button"
            onClick={() => setSimMode("autolight")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${simMode === "autolight"
                ? "bg-[#092551] text-amber-300 shadow-xs"
                : "border border-[#D4E4FC] bg-white text-[#35517D] hover:border-[#092551]"
              }`}
          >
            <Sun className="h-3.5 w-3.5" />
            <span>2. ใบงาน 5.1: ไฟ LED อัตโนมัติด้วยเซนเซอร์แสง</span>
          </button>
        </div>

        <a
          href="https://youtu.be/5SIhlWFAJWk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-800 hover:bg-sky-100"
        >
          <ExternalLink className="h-3 w-3" />
          <span>ดูคลิป Engage ระบบอัตโนมัติ</span>
        </a>
      </div>

      {/* Circuit Controls + Visual Breadboard */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Left: Controls */}
        <div className="space-y-3 rounded-2xl border border-[#DCE7FA] bg-white p-4 lg:col-span-5">
          <div className="text-xs font-bold text-[#092551]">ตั้งค่าการต่อวงจรบน Breadboard</div>

          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-[#5C7299]">ค่าตัวต้านทาน (Resistor):</div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { key: "0" as const, label: "ไม่ใส่ (0Ω)" },
                { key: "220" as const, label: "220Ω (พอดี)" },
                { key: "10000" as const, label: "10kΩ (สูง)" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setResistor(opt.key)}
                  className={`rounded-lg border px-2 py-1.5 text-[11px] font-bold transition ${resistor === opt.key
                      ? opt.key === "0"
                        ? "border-rose-500 bg-rose-50 text-rose-800"
                        : "border-[#1364E7] bg-[#EFF6FF] text-[#092551]"
                      : "border-[#E1EAFB] bg-[#FBFCFF] text-[#5C7299] hover:border-[#9FC0F8]"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPolarityOk((v) => !v)}
              className={`rounded-xl border px-3 py-2 text-left text-[11px] font-semibold transition ${polarityOk
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-amber-300 bg-amber-50 text-amber-900"
                }`}
            >
              <div>ขั้วหลอด LED:</div>
              <div className="mt-0.5 font-bold">{polarityOk ? "ถูกต้อง (+/-)" : "กลับขั้ว (-/+)"}</div>
            </button>

            <button
              type="button"
              onClick={() => setGndConnected((v) => !v)}
              className={`rounded-xl border px-3 py-2 text-left text-[11px] font-semibold transition ${gndConnected
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-amber-300 bg-amber-50 text-amber-900"
                }`}
            >
              <div>สายกราวด์ (GND):</div>
              <div className="mt-0.5 font-bold">{gndConnected ? "ต่อครบวงจร" : "ขาดการต่อ GND"}</div>
            </button>
          </div>

          {simMode === "safety" ? (
            <div className="rounded-xl border border-[#E1EAFB] bg-[#F8FAFF] p-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-[#092551]">บล็อกคำสั่งควบคุมขา P0:</span>
                <button
                  type="button"
                  onClick={() => setManualBlink((b) => !b)}
                  className="rounded-lg bg-[#092551] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#123A78]"
                >
                  {manualBlink ? "กระพริบ (700ms)" : "เปิดค้าง (HIGH)"}
                </button>
              </div>
              <div className="mt-2 rounded-lg bg-[#081A37] p-2.5 font-mono text-[11px] text-sky-200">
                <div>{manualBlink ? "forever:" : "on start:"}</div>
                <div className="pl-3 text-[#64DCA2]">
                  digital write pin P0 to {logicRequestsOn ? "1" : "0"}
                </div>
                {manualBlink && <div className="pl-3 text-amber-200">pause (ms) 700</div>}
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 rounded-xl border border-[#DCE7FA] bg-[#F4F7FD] p-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#092551]">
                <span className="inline-flex items-center gap-1">
                  {lightLevel < threshold ? (
                    <Moon className="h-3.5 w-3.5 text-indigo-600" />
                  ) : (
                    <Sun className="h-3.5 w-3.5 text-amber-500" />
                  )}
                  เซนเซอร์แสง Micro:bit: {lightLevel} / 255
                </span>
                <span className="font-mono text-[#1364E7]">เกณฑ์ &lt; {threshold}</span>
              </div>

              <input
                type="range"
                min={0}
                max={255}
                value={lightLevel}
                onChange={(e) => setLightLevel(Number(e.target.value))}
                aria-label="ระดับความสว่างเซนเซอร์วัดแสง Micro:bit"
                className="w-full accent-[#1364E7]"
              />

              <div className="flex flex-wrap gap-1">
                {[
                  { label: "กลางคืน (20)", v: 20 },
                  { label: "พลบค่ำ (85)", v: 85 },
                  { label: "ในห้อง (160)", v: 160 },
                  { label: "แดดจ้า (230)", v: 230 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setLightLevel(preset.v)}
                    className="rounded-lg border border-[#D4E2FA] bg-white px-2 py-0.5 text-[10px] font-bold text-[#35517D] hover:border-[#1364E7]"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <label className="block text-[11px] font-semibold text-[#5C7299]">
                ปรับเกณฑ์เปิดไฟอัตโนมัติ (Threshold): {threshold}
                <input
                  type="range"
                  min={50}
                  max={180}
                  step={10}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  aria-label="เกณฑ์เปิดไฟอัตโนมัติ"
                  className="mt-1 w-full accent-emerald-600"
                />
              </label>
            </div>
          )}
        </div>

        {/* Right: Visual SVG Circuit Board */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#1E3B6E] bg-[#081A37] p-4 text-white lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-200">
              <Cpu className="h-4 w-4 text-[#64DCA2]" />
              <span>จำลองวงจร Tinkercad: Micro:bit Breakout + Breadboard</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[11px] text-amber-200">
              <Zap className="h-3 w-3" />I ≈ {currentMa} mA
            </span>
          </div>

          <div className="my-3 flex items-center justify-center rounded-xl border border-white/10 bg-[#051024] p-3">
            <svg viewBox="0 0 520 180" className="h-44 w-full max-w-[520px]" role="img" aria-label="แผนภาพจำลองวงจร Micro:bit ตัวต้านทาน และหลอด LED">
              {/* Micro:bit Breakout Board */}
              <rect x="14" y="24" width="132" height="132" rx="12" fill="#0F2A56" stroke="#38BDF8" strokeWidth="2" />
              <text x="80" y="46" textAnchor="middle" fill="#E0F2FE" fontSize="11" fontWeight="bold">
                MICRO:BIT
              </text>
              <text x="80" y="61" textAnchor="middle" fill="#93C5FD" fontSize="9">
                Breakout Board
              </text>
              {/* 5x5 mini grid */}
              {[0, 1, 2, 3, 4].map((r) =>
                [0, 1, 2, 3, 4].map((c) => {
                  const litMini = simMode === "autolight" && c * 51 <= lightLevel;
                  return (
                    <rect
                      key={`${r}-${c}`}
                      x={52 + c * 12}
                      y={72 + r * 9}
                      width="7"
                      height="5"
                      rx="1"
                      fill={litMini ? "#FBBF24" : "#1E3A6D"}
                    />
                  );
                })
              )}
              {/* Pins */}
              <rect x="112" y="126" width="28" height="18" rx="4" fill={logicRequestsOn ? "#22C55E" : "#334155"} />
              <text x="126" y="139" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                P0
              </text>
              <rect x="18" y="126" width="34" height="18" rx="4" fill="#1E293B" stroke="#94A3B8" />
              <text x="35" y="139" textAnchor="middle" fill="#E2E8F0" fontSize="10" fontWeight="bold">
                GND
              </text>

              {/* Wire from P0 to Breadboard Resistor */}
              <path
                d="M 140 135 L 185 135 L 185 78 L 210 78"
                fill="none"
                stroke={logicRequestsOn ? "#34D399" : "#64748B"}
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Breadboard Outline */}
              <rect x="200" y="34" width="295" height="112" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
              <text x="348" y="51" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold">
                BREADBOARD
              </text>

              {/* Resistor or Direct Wire */}
              {resistor === "0" ? (
                <g>
                  <line x1="210" y1="78" x2="315" y2="78" stroke="#EF4444" strokeWidth="4" strokeDasharray="5 3" />
                  <text x="262" y="69" textAnchor="middle" fill="#DC2626" fontSize="9" fontWeight="bold">
                    ไม่มี Resistor (0Ω!)
                  </text>
                </g>
              ) : (
                <g>
                  <line x1="210" y1="78" x2="236" y2="78" stroke="#64748B" strokeWidth="3" />
                  <rect x="236" y="68" width="54" height="20" rx="5" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
                  <rect x="246" y="68" width="5" height="20" fill={resistor === "220" ? "#DC2626" : "#92400E"} />
                  <rect x="256" y="68" width="5" height="20" fill={resistor === "220" ? "#DC2626" : "#111827"} />
                  <rect x="266" y="68" width="5" height="20" fill={resistor === "220" ? "#92400E" : "#EA580C"} />
                  <line x1="290" y1="78" x2="315" y2="78" stroke="#64748B" strokeWidth="3" />
                  <text x="263" y="102" textAnchor="middle" fill="#334155" fontSize="9" fontWeight="bold">
                    Resistor {resistor === "220" ? "220Ω" : "10kΩ"}
                  </text>
                </g>
              )}

              {/* LED Component */}
              <g transform="translate(350, 78)">
                {isLedLit && (
                  <circle
                    cx="0"
                    cy="-4"
                    r={isDim ? 20 : 28}
                    fill={isDim ? "rgba(250, 204, 21, 0.2)" : "rgba(250, 204, 21, 0.45)"}
                  />
                )}
                {isOvercurrent && (
                  <circle cx="0" cy="-4" r="28" fill="rgba(239, 68, 68, 0.45)" />
                )}
                <path
                  d="M -14 10 L -14 -6 A 14 14 0 0 1 14 -6 L 14 10 Z"
                  fill={isOvercurrent ? "#EF4444" : isLedLit ? (isDim ? "#FDE047" : "#FACC15") : "#CBD5E1"}
                  stroke={isOvercurrent ? "#991B1B" : "#475569"}
                  strokeWidth="2"
                />
                <text x="-28" y="5" fill="#0F172A" fontSize="9" fontWeight="bold">
                  {polarityOk ? "(+)A" : "(-)K"}
                </text>
                <text x="18" y="5" fill="#0F172A" fontSize="9" fontWeight="bold">
                  {polarityOk ? "K(-)" : "A(+)"}
                </text>
                <line x1="-35" y1="0" x2="-14" y2="0" stroke="#64748B" strokeWidth="3" />
                <line x1="14" y1="0" x2="36" y2="0" stroke="#64748B" strokeWidth="3" />
                <text x="0" y="25" textAnchor="middle" fill="#0F172A" fontSize="9" fontWeight="bold">
                  {isOvercurrent ? "LED ไหม้!" : isLedLit ? "LED ON" : "LED OFF"}
                </text>
              </g>

              {/* Return Wire to GND */}
              {gndConnected ? (
                <path
                  d="M 386 78 L 430 78 L 430 162 L 35 162 L 35 144"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ) : (
                <g>
                  <line x1="386" y1="78" x2="430" y2="78" stroke="#F59E0B" strokeWidth="3" strokeDasharray="4 4" />
                  <text x="455" y="82" textAnchor="middle" fill="#D97706" fontSize="9" fontWeight="bold">
                    สายขาด!
                  </text>
                </g>
              )}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#BFD4F5]">
            <span>
              สัญญาณขา P0: <strong className="font-mono text-white">{logicRequestsOn ? "HIGH (3.3V)" : "LOW (0V)"}</strong>
            </span>
            <span>
              สถานะหลอด LED:{" "}
              <strong
                className={
                  isOvercurrent
                    ? "text-rose-300"
                    : isLedLit
                      ? "text-amber-300"
                      : "text-slate-300"
                }
              >
                {isOvercurrent ? "กระแสเกิน/เสียหาย" : isLedLit ? (isDim ? "สว่างน้อยมาก" : "ติดสว่าง") : "ดับ"}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Diagnostic Alert Bar */}
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 text-xs ${statusKind === "danger"
            ? "border-rose-300 bg-rose-50 text-rose-900"
            : statusKind === "bug"
              ? "border-amber-300 bg-amber-50 text-amber-900"
              : statusKind === "standby"
                ? "border-slate-200 bg-white text-slate-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-900"
          }`}
      >
        {statusKind === "danger" || statusKind === "bug" ? (
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        ) : statusKind === "ok" ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        ) : (
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
        )}
        <div>
          <div className="font-bold">{statusTitle}</div>
          <p className="mt-0.5 leading-relaxed">{statusMessage}</p>
        </div>
      </div>
    </div>
  );
}
