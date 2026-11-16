"use client";

import { useState } from "react";
import { Play, RotateCcw, ShieldAlert, ShieldCheck, StepForward } from "lucide-react";
import type { VisualizerType } from "@/core/config/curriculum";
import {
  MqttPubSubVisualizer,
  MoscowBacklogVisualizer,
  PicoGpioVisualizer,
  TestingTriageVisualizer,
} from "./IotLessonVisualizers";
import {
  AccelGestureVisualizer,
  ArraySortVisualizer,
  MicrobitCoordsVisualizer,
  RadioChannelVisualizer,
} from "./MicrobitLessonVisualizers";
import { TinkercadCircuitVisualizer } from "./V21103Visualizers";

function StringSlicingVisualizer() {
  const [text, setText] = useState("COMPUTER");
  const [start, setStart] = useState<number>(1);
  const [stop, setStop] = useState<number>(5);
  const [step, setStep] = useState<number>(1);

  const chars = Array.from(text || "CODE");
  const n = chars.length;

  const selectedIndices: number[] = [];
  if (step > 0) {
    const s = start < 0 ? Math.max(0, n + start) : Math.min(n, start);
    const e = stop < 0 ? Math.max(0, n + stop) : Math.min(n, stop);
    for (let i = s; i < e; i += step) selectedIndices.push(i);
  } else if (step < 0) {
    const s = start < 0 ? Math.max(-1, n + start) : Math.min(n - 1, start);
    const e = stop < 0 ? Math.max(-1, n + stop) : Math.min(n - 1, stop);
    for (let i = s; i > e; i += step) selectedIndices.push(i);
  }

  const slicedOutput = selectedIndices.map((idx) => chars[idx]).join("");

  return (
    <div className="space-y-5 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="rounded-full bg-[#1364E7]/10 px-3 py-1 text-xs font-semibold text-[#1364E7]">
            Interactive String Slicing Visualizer
          </span>
          <div className="mt-2 font-mono text-lg font-semibold text-[#092551]">
            text[<span className="text-[#0A5FE6]">{start}</span> :{" "}
            <span className="text-purple-600">{stop}</span> :{" "}
            <span className="text-emerald-600">{step}</span>] ==={" "}
            <span className="rounded-lg bg-[#081A37] px-2.5 py-0.5 text-[#64DCA2]">
              &quot;{slicedOutput}&quot;
            </span>
          </div>
        </div>

        <label className="text-xs font-medium text-[#5C7299]">
          เปลี่ยนคำทดสอบ:
          <input
            type="text"
            maxLength={12}
            value={text}
            onChange={(e) => {
              const v = e.target.value.toUpperCase() || "A";
              setText(v);
              setStop(v.length);
              setStart(0);
            }}
            className="input-thread mt-1 !min-h-9 !w-36 font-mono text-sm uppercase"
          />
        </label>
      </div>

      {/* Character Boxes with Positive & Negative Index */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-2">
          {chars.map((ch, idx) => {
            const pickOrder = selectedIndices.indexOf(idx);
            const isSelected = pickOrder !== -1;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="font-mono text-[11px] font-semibold text-[#0A5FE6]">{idx}</span>
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-xl border-2 font-mono text-lg font-bold transition-all ${
                    isSelected
                      ? "scale-105 border-[#1364E7] bg-gradient-to-br from-[#147AFF] to-[#075ADF] text-white shadow-md"
                      : "border-[#D4E4FC] bg-white text-[#11264A]"
                  }`}
                >
                  {ch}
                  {isSelected && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow">
                      {pickOrder + 1}
                    </span>
                  )}
                </div>
                <span className="font-mono text-[11px] text-[#7485A4]">{idx - n}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#E1EAFB] bg-white p-3">
          <div className="flex justify-between text-xs font-semibold text-[#0A5FE6]">
            <span>start (เริ่มต้น)</span>
            <span className="font-mono">{start}</span>
          </div>
          <input
            type="range"
            min={-n}
            max={n}
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
            className="mt-2 w-full accent-[#1364E7]"
          />
        </div>

        <div className="rounded-xl border border-[#E1EAFB] bg-white p-3">
          <div className="flex justify-between text-xs font-semibold text-purple-600">
            <span>stop (ก่อนตำแหน่งนี้)</span>
            <span className="font-mono">{stop}</span>
          </div>
          <input
            type="range"
            min={-n}
            max={n}
            value={stop}
            onChange={(e) => setStop(Number(e.target.value))}
            className="mt-2 w-full accent-purple-600"
          />
        </div>

        <div className="rounded-xl border border-[#E1EAFB] bg-white p-3">
          <div className="flex justify-between text-xs font-semibold text-emerald-700">
            <span>step (ก้าวกระโดด)</span>
            <span className="font-mono">{step}</span>
          </div>
          <div className="mt-2 flex gap-1.5">
            {[-2, -1, 1, 2].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStep(st);
                  if (st < 0) {
                    setStart(n - 1);
                    setStop(-n - 1);
                  } else {
                    setStart(0);
                    setStop(n);
                  }
                }}
                className={`flex-1 rounded-lg py-1 font-mono text-xs font-semibold ${
                  step === st
                    ? "bg-emerald-600 text-white"
                    : "bg-[#F4F7FD] text-[#11264A] hover:bg-emerald-50"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BinaryBitsVisualizer() {
  const [bits, setBits] = useState<number[]>([0, 0, 0, 0, 1, 0, 1, 0]);
  const weights = [128, 64, 32, 16, 8, 4, 2, 1];
  const decimal = bits.reduce((sum, b, i) => sum + b * weights[i], 0);
  const charPreview = decimal >= 32 && decimal <= 126 ? String.fromCharCode(decimal) : "—";

  return (
    <div className="space-y-4 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold text-[#092551]">
          คลิกสวิตช์บิตเพื่อดูการคำนวณเลขฐานสอง (8-Bit)
        </div>
        <div className="rounded-xl bg-[#081A37] px-4 py-2 font-mono text-sm text-white">
          ฐานสิบ: <span className="font-bold text-[#64DCA2]">{decimal}</span> · ASCII:{" "}
          <span className="font-bold text-amber-300">{charPreview}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {bits.map((bit, i) => (
          <button
            key={weights[i]}
            type="button"
            onClick={() => setBits((prev) => prev.map((b, idx) => (idx === i ? (b === 1 ? 0 : 1) : b)))}
            className={`flex flex-col items-center rounded-xl border-2 p-3 transition ${
              bit === 1
                ? "border-[#1364E7] bg-[#1364E7] text-white shadow-md"
                : "border-[#D4E4FC] bg-white text-[#5C7299] hover:border-[#1364E7]/50"
            }`}
          >
            <span className="text-[10px] font-medium opacity-80">{weights[i]}</span>
            <span className="font-mono mt-1 text-2xl font-bold">{bit}</span>
          </button>
        ))}
      </div>

      <div className="text-center font-mono text-xs text-[#5C7299]">
        ผลรวม:{" "}
        {bits
          .map((b, i) => (b === 1 ? weights[i] : null))
          .filter(Boolean)
          .join(" + ") || "0"}{" "}
        = <strong className="text-[#092551]">{decimal}</strong>
      </div>
    </div>
  );
}

function QueueStepperVisualizer() {
  const steps = [
    { line: "1. วางแก้วเปล่าบนถาด", state: "แก้วเปล่า", ok: true },
    { line: "2. ตักผงโกโก้ 2 ช้อน", state: "แก้ว + ผงโกโก้", ok: true },
    { line: "3. เติมน้ำร้อน 150 มล.", state: "น้ำร้อน + ผงโกโก้", ok: true },
    { line: "4. คนให้ละลายเข้ากัน", state: "โกโก้พร้อมเสิร์ฟ ☕", ok: true },
  ];
  const [stepIdx, setStepIdx] = useState(0);

  return (
    <div className="space-y-4 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-[#092551]">
          จำลองการทำงานทีละคำสั่ง (Step-by-Step)
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStepIdx(0)}
            className="ed-btn-secondary !min-h-8 !px-3 !text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>เริ่มใหม่</span>
          </button>
          <button
            type="button"
            onClick={() => setStepIdx((s) => (s + 1) % steps.length)}
            className="ed-btn-primary !min-h-8 !px-3 !text-xs"
          >
            <StepForward className="h-3.5 w-3.5" />
            <span>ก้าวถัดไป</span>
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          {steps.map((s, idx) => (
            <div
              key={s.line}
              className={`rounded-xl border px-3.5 py-2.5 font-mono text-xs transition ${
                idx === stepIdx
                  ? "border-[#1364E7] bg-[#1364E7] font-semibold text-white shadow-sm"
                  : idx < stepIdx
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-[#E1EAFB] bg-white text-[#5C7299]"
              }`}
            >
              {s.line}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E1EAFB] bg-white p-5 text-center">
          <div className="text-xs font-medium text-[#5C7299]">สถานะปัจจุบัน (ขั้นตอนที่ {stepIdx + 1})</div>
          <div className="font-display mt-2 text-xl font-semibold text-[#092551]">
            {steps[stepIdx].state}
          </div>
          <div className="mt-2 h-2 w-40 overflow-hidden rounded-full bg-[#E8F0FD]">
            <div
              className="h-full bg-[#1364E7] transition-all"
              style={{ width: `${((stepIdx + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoopListVisualizer() {
  const scores = [12, 8, 15, 5, 20];
  const [cursor, setCursor] = useState(0);

  let runningTotal = 0;
  for (let i = 0; i <= cursor; i++) {
    if (scores[i] >= 10) runningTotal += scores[i];
  }
  const activeVal = scores[cursor];
  const passedCond = activeVal >= 10;

  return (
    <div className="space-y-4 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs font-semibold text-[#092551]">
          scores = [12, 8, 15, 5, 20] · เงื่อนไข: s &gt;= 10
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCursor(0)}
            className="ed-btn-secondary !min-h-8 !px-3 !text-xs"
          >
            รีเซ็ต
          </button>
          <button
            type="button"
            onClick={() => setCursor((c) => (c + 1) % scores.length)}
            className="ed-btn-primary !min-h-8 !px-3 !text-xs"
          >
            <Play className="h-3.5 w-3.5" />
            <span>วนรอบถัดไป</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {scores.map((val, idx) => (
          <div
            key={idx}
            className={`flex w-16 flex-col items-center rounded-xl border-2 p-2.5 font-mono transition ${
              idx === cursor
                ? "scale-105 border-[#1364E7] bg-[#1364E7] text-white shadow-md"
                : idx < cursor
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-[#E1EAFB] bg-white text-[#5C7299]"
            }`}
          >
            <span className="text-[10px] opacity-80">[{idx}]</span>
            <span className="text-lg font-bold">{val}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#E1EAFB] bg-white p-3 text-xs">
          <div className="text-[#5C7299]">ค่า s รอบปัจจุบัน</div>
          <div className="font-mono mt-1 text-lg font-bold text-[#092551]">{activeVal}</div>
        </div>
        <div className="rounded-xl border border-[#E1EAFB] bg-white p-3 text-xs">
          <div className="text-[#5C7299]">เงื่อนไข s &gt;= 10</div>
          <div
            className={`mt-1 text-sm font-bold ${
              passedCond ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {passedCond ? "True → บวกเข้า total" : "False → ข้าม"}
          </div>
        </div>
        <div className="rounded-xl border border-[#E1EAFB] bg-[#081A37] p-3 text-xs text-white">
          <div className="text-sky-200">ค่าตัวแปร total ล่าสุด</div>
          <div className="font-mono mt-1 text-xl font-bold text-[#64DCA2]">{runningTotal}</div>
        </div>
      </div>
    </div>
  );
}

function CaesarCipherVisualizer() {
  const [plain, setPlain] = useState("PCCPL");
  const [shift, setShift] = useState(3);

  const cipher = Array.from(plain.toUpperCase())
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      }
      return ch;
    })
    .join("");

  return (
    <div className="space-y-4 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-[#092551]">
          ข้อความต้นฉบับ (Plaintext)
          <input
            type="text"
            maxLength={14}
            value={plain}
            onChange={(e) => setPlain(e.target.value)}
            className="input-thread mt-1 font-mono uppercase"
          />
        </label>

        <div>
          <div className="flex justify-between text-xs font-semibold text-[#092551]">
            <span>ระยะเลื่อน (Shift Key)</span>
            <span className="font-mono text-[#1364E7]">+{shift}</span>
          </div>
          <input
            type="range"
            min={1}
            max={25}
            value={shift}
            onChange={(e) => setShift(Number(e.target.value))}
            className="mt-3 w-full accent-[#1364E7]"
          />
        </div>
      </div>

      <div className="rounded-xl bg-[#081A37] p-4 font-mono text-sm text-white">
        <div className="text-xs text-[#8BA9DA]">Ciphertext หลังเข้ารหัส:</div>
        <div className="mt-1 text-2xl font-bold tracking-widest text-[#64DCA2]">{cipher || "—"}</div>
      </div>
    </div>
  );
}

function PhishingInspectorVisualizer() {
  const samples = [
    {
      url: "https://classroom.pccpl.ac.th/login",
      safe: true,
      note: "ปลอดภัย: โดเมนหลักลงท้ายด้วย pccpl.ac.th ตรงตามมาตรฐานโรงเรียนและใช้ HTTPS",
    },
    {
      url: "http://pccpl-ac-th.free-reward-login.com/verify",
      safe: false,
      note: "อันตราย (Phishing): โดเมนจริงอยู่ท้ายสุดคือ free-reward-login.com และใช้ HTTP ไม่เข้ารหัส",
    },
    {
      url: "https://pccpl.ac.th.gift-bonus.net/claim",
      safe: false,
      note: "อันตราย (Subdomain หลอก): นำ pccpl.ac.th มาใส่เป็น Subdomain นำหน้า gift-bonus.net",
    },
  ];
  const [idx, setIdx] = useState(0);
  const current = samples[idx];

  return (
    <div className="space-y-4 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
      <div className="text-xs font-semibold text-[#092551]">เลือกลิงก์เพื่อตรวจสอบโครงสร้าง Domain:</div>
      <div className="space-y-2">
        {samples.map((s, i) => (
          <button
            key={s.url}
            type="button"
            onClick={() => setIdx(i)}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-left font-mono text-xs transition ${
              i === idx
                ? "border-[#1364E7] bg-white font-semibold text-[#092551] shadow-sm"
                : "border-[#E1EAFB] bg-white/70 text-[#5C7299] hover:bg-white"
            }`}
          >
            {s.url}
          </button>
        ))}
      </div>

      <div
        className={`flex items-start gap-3 rounded-xl border p-4 text-xs font-medium ${
          current.safe
            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
            : "border-rose-200 bg-rose-50 text-rose-900"
        }`}
      >
        {current.safe ? (
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        ) : (
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
        )}
        <span>{current.note}</span>
      </div>
    </div>
  );
}

export function LessonVisualizer({ type }: { type: VisualizerType }) {
  switch (type) {
    case "string-slicing":
      return <StringSlicingVisualizer />;
    case "binary-bits":
      return <BinaryBitsVisualizer />;
    case "queue-stepper":
      return <QueueStepperVisualizer />;
    case "loop-list":
      return <LoopListVisualizer />;
    case "caesar-cipher":
      return <CaesarCipherVisualizer />;
    case "phishing-inspector":
      return <PhishingInspectorVisualizer />;
    case "mqtt-pubsub":
      return <MqttPubSubVisualizer />;
    case "moscow-backlog":
      return <MoscowBacklogVisualizer />;
    case "pico-gpio":
      return <PicoGpioVisualizer />;
    case "testing-triage":
      return <TestingTriageVisualizer />;
    case "microbit-coords":
      return <MicrobitCoordsVisualizer />;
    case "radio-channel":
      return <RadioChannelVisualizer />;
    case "array-sort":
      return <ArraySortVisualizer />;
    case "accel-gesture":
      return <AccelGestureVisualizer />;
    case "tinkercad-circuit":
      return <TinkercadCircuitVisualizer />;
  }
}

