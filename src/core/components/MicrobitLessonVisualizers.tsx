"use client";

import { useState } from "react";
import { Activity, ArrowLeftRight, Cpu, Grid3X3, Radio, RotateCcw, Sparkles, StepForward } from "lucide-react";

const HEART_COORDS = new Set(["1,0", "3,0", "0,1", "1,1", "2,1", "3,1", "4,1", "0,2", "1,2", "2,2", "3,2", "4,2", "1,3", "2,3", "3,3", "2,4"]);
const SMILE_COORDS = new Set(["1,1", "3,1", "0,3", "4,3", "1,4", "2,4", "3,4"]);
const DIAG_COORDS = new Set(["0,0", "1,1", "2,2", "3,3", "4,4"]);

/**
 * จำลองหน้าจอ LED 5x5 ของ micro:bit พร้อมระบบพิกัด (X, Y) และ Brightness 0-255
 */
export function MicrobitCoordsVisualizer() {
  const [lit, setLit] = useState<Set<string>>(() => new Set(HEART_COORDS));
  const [lastCoord, setLastCoord] = useState<[number, number]>([2, 2]);
  const [brightness, setBrightness] = useState<number>(255);

  const toggleLed = (x: number, y: number) => {
    const k = `${x},${y}`;
    setLastCoord([x, y]);
    setLit((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const applyPreset = (coords: Set<string>) => {
    setLit(new Set(coords));
  };

  const isLastOn = lit.has(`${lastCoord[0]},${lastCoord[1]}`);
  const opacity = Math.max(0.18, brightness / 255);

  return (
    <div className="space-y-4 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#092551]">
          <Grid3X3 className="h-4 w-4 text-emerald-600" />
          <span>micro:bit 5×5 LED Coordinate Plotter</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "หัวใจ", coords: HEART_COORDS },
            { label: "หน้ายิ้ม", coords: SMILE_COORDS },
            { label: "เส้นทแยง", coords: DIAG_COORDS },
            { label: "ล้างจอ", coords: new Set<string>() },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset.coords)}
              className="rounded-lg border border-[#D4E2FA] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#35517D] hover:border-emerald-500 hover:text-emerald-700"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-12">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-[#081A37] p-4 md:col-span-6">
          <div className="mb-2 flex items-center gap-4 text-[10px] font-mono text-sky-300">
            <span>X (0 → 4)</span>
            <span>·</span>
            <span>Y (0 ↓ 4)</span>
          </div>
          <div className="rounded-2xl border-2 border-slate-700 bg-[#0D2144] p-3">
            <div className="mb-1.5 grid grid-cols-6 gap-1.5 text-center font-mono text-[10px] text-slate-400">
              <span />
              {[0, 1, 2, 3, 4].map((x) => (
                <span key={x}>x={x}</span>
              ))}
            </div>
            {[0, 1, 2, 3, 4].map((y) => (
              <div key={y} className="mb-1.5 grid grid-cols-6 items-center gap-1.5 last:mb-0">
                <span className="font-mono text-[10px] text-slate-400">y={y}</span>
                {[0, 1, 2, 3, 4].map((x) => {
                  const active = lit.has(`${x},${y}`);
                  const focused = lastCoord[0] === x && lastCoord[1] === y;
                  return (
                    <button
                      key={`${x},${y}`}
                      type="button"
                      onClick={() => toggleLed(x, y)}
                      aria-label={`LED coordinate ${x},${y}`}
                      className={`h-8 w-8 rounded-md border transition ${
                        focused ? "ring-2 ring-amber-400" : ""
                      } ${active ? "border-emerald-300 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" : "border-slate-700 bg-slate-800/80 hover:border-slate-500"}`}
                      style={active ? { opacity } : undefined}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-[#D4E4FC] bg-white p-4 md:col-span-6">
          <div>
            <div className="text-[11px] font-bold uppercase text-emerald-700">
              พิกัดที่เลือกล่าสุด & Brightness
            </div>
            <div className="mt-1 font-mono text-base font-bold text-[#092551]">
              (x={lastCoord[0]}, y={lastCoord[1]}) ·{" "}
              <span className={isLastOn ? "text-emerald-600" : "text-slate-500"}>
                {isLastOn ? "ON (True)" : "OFF (False)"}
              </span>
            </div>
          </div>

          <label className="block space-y-1 text-xs font-semibold text-[#35517D]">
            <span>ความสว่าง LED Brightness: {brightness} / 255</span>
            <input
              type="range"
              min={25}
              max={255}
              step={25}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </label>

          <div className="rounded-xl bg-[#081A37] p-3 font-mono text-[11px] text-[#64DCA2]">
            <div>{`// MakeCode JavaScript / Blocks`}</div>
            <div>{isLastOn ? `led.plot(${lastCoord[0]}, ${lastCoord[1]})` : `led.unplot(${lastCoord[0]}, ${lastCoord[1]})`}</div>
            <div>{`led.setBrightness(${brightness})`}</div>
            <div className="mt-1 text-sky-300">{`# MicroPython`}</div>
            <div className="text-sky-200">{`display.set_pixel(${lastCoord[0]}, ${lastCoord[1]}, ${isLastOn ? Math.max(1, Math.round((brightness / 255) * 9)) : 0})`}</div>
          </div>

          <div className="text-xs text-[#5C7299]">
            เปิดไฟอยู่ <span className="font-bold text-[#092551]">{lit.size}</span> จาก 25 ดวง · จำไว้ว่ามุมซ้ายบนสุดคือ (0, 0) และขวาล่างสุดคือ (4, 4)
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * จำลองการรับส่งข้อความไร้สายด้วยคลื่นวิทยุของ micro:bit ตาม Radio Group ID (0-255)
 */
export function RadioChannelVisualizer() {
  const [senderGroup, setSenderGroup] = useState(7);
  const [rxOneGroup, setRxOneGroup] = useState(7);
  const [rxTwoGroup, setRxTwoGroup] = useState(12);
  const [message, setMessage] = useState("HOT");
  const [logs, setLogs] = useState<Array<{ group: number; msg: string; receivedBy: string[] }>>([
    { group: 7, msg: "HOT", receivedBy: ["เครื่องเพื่อน 1 (Group 7)"] },
  ]);

  const sendPacket = () => {
    const receivedBy: string[] = [];
    if (rxOneGroup === senderGroup) receivedBy.push(`เครื่องเพื่อน 1 (Group ${rxOneGroup})`);
    if (rxTwoGroup === senderGroup) receivedBy.push(`เครื่องเพื่อน 2 (Group ${rxTwoGroup})`);
    setLogs((prev) => [{ group: senderGroup, msg: message, receivedBy }, ...prev].slice(0, 4));
  };

  return (
    <div className="space-y-4 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#092551]">
          <Radio className="h-4 w-4 text-emerald-600" />
          <span>micro:bit Radio Group & Boolean Matching</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["HOT", "COLD", "... --- ...", "STOP THIEF!"].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setMessage(preset)}
              className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-semibold ${
                message === preset
                  ? "bg-[#092551] text-white"
                  : "border border-[#D4E2FA] bg-white text-[#35517D]"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-12">
        <div className="space-y-3 rounded-xl border border-[#D4E4FC] bg-white p-4 md:col-span-5">
          <div className="text-[11px] font-bold uppercase text-emerald-700">1. เครื่องส่ง (Sender)</div>
          <label className="block text-xs font-semibold text-[#35517D]">
            Radio Group ID (0–255):
            <input
              type="number"
              min={0}
              max={255}
              value={senderGroup}
              onChange={(e) => setSenderGroup(Math.max(0, Math.min(255, Number(e.target.value) || 0)))}
              className="mt-1 w-full rounded-lg border border-[#D4E4FC] px-3 py-1.5 font-mono text-xs text-[#092551]"
            />
          </label>
          <label className="block text-xs font-semibold text-[#35517D]">
            radio.sendString(...):
            <input
              type="text"
              maxLength={19}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#D4E4FC] px-3 py-1.5 font-mono text-xs text-[#092551]"
            />
          </label>
          <button type="button" onClick={sendPacket} className="ed-btn-primary !min-h-9 w-full !text-xs">
            ส่งคลื่นวิทยุ (Broadcast)
          </button>
        </div>

        <div className="space-y-2.5 rounded-xl border border-[#D4E4FC] bg-white p-4 md:col-span-7">
          <div className="text-[11px] font-bold uppercase text-[#092551]">2. เครื่องรับ (Receivers Boolean Check)</div>
          {[
            { label: "เครื่องเพื่อน 1", group: rxOneGroup, setGroup: setRxOneGroup },
            { label: "เครื่องเพื่อน 2", group: rxTwoGroup, setGroup: setRxTwoGroup },
          ].map((rx) => {
            const matched = rx.group === senderGroup;
            return (
              <div key={rx.label} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E1EAFB] bg-[#F8FAFF] px-3 py-2">
                <div>
                  <div className="text-xs font-bold text-[#092551]">{rx.label}</div>
                  <div className="font-mono text-[11px] text-[#5C7299]">
                    {senderGroup} == {rx.group} →{" "}
                    <span className={matched ? "font-bold text-emerald-600" : "font-bold text-rose-600"}>
                      {matched ? "True (รับข้อความได้)" : "False (คนละคลื่น)"}
                    </span>
                  </div>
                </div>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rx.group}
                  onChange={(e) => rx.setGroup(Math.max(0, Math.min(255, Number(e.target.value) || 0)))}
                  aria-label={`${rx.label} Group ID`}
                  className="w-20 rounded-lg border border-[#D4E4FC] bg-white px-2.5 py-1 font-mono text-xs text-[#092551]"
                />
              </div>
            );
          })}

          <div className="rounded-xl bg-[#081A37] p-3 font-mono text-[11px] text-sky-200">
            {logs.map((l, i) => (
              <div key={i} className="border-b border-white/10 py-1 last:border-none">
                <span className="text-emerald-300">TX[G={l.group}] &quot;{l.msg}&quot;</span> →{" "}
                {l.receivedBy.length > 0 ? l.receivedBy.join(", ") : "ไม่มีเครื่องใดรับได้ (คนละ Group)"}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * จำลอง Index อาเรย์เริ่มที่ 0 และขั้นตอน Selection Sort / Bubble Sort (Unit 11)
 */
export function ArraySortVisualizer() {
  const initialArr = [64, 22, 85, 12, 48];
  const [arr, setArr] = useState<number[]>(initialArr);
  const [idx, setIdx] = useState(0);
  const [pass, setPass] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [statusNote, setStatusNote] = useState("กดปุ่ม 'รันขั้นถัดไป' เพื่อดูอัลกอริทึม Selection Sort สลับค่าน้อยสุด");

  const reset = () => {
    setArr(initialArr);
    setIdx(0);
    setPass(0);
    setStatusNote("รีเซ็ตอาเรย์เริ่มต้น [64, 22, 85, 12, 48] แล้ว");
  };

  const stepSort = () => {
    if (pass >= arr.length - 1) {
      setStatusNote("เรียงลำดับครบทุกตำแหน่งแล้ว!");
      return;
    }
    const next = [...arr];
    let minIdx = pass;
    for (let j = pass + 1; j < next.length; j++) {
      if (next[j] < next[minIdx]) minIdx = j;
    }
    const picked = next[minIdx];
    [next[pass], next[minIdx]] = [next[minIdx], next[pass]];
    setArr(next);
    setIdx(pass);
    setSelectedIndex(pass);
    setStatusNote(
      `รอบที่ ${pass + 1}: พบค่าน้อยที่สุดคือ ${picked} (index ${minIdx}) นำมาสลับไว้ที่ index ${pass}`
    );
    setPass((p) => p + 1);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#092551]">
          <ArrowLeftRight className="h-4 w-4 text-emerald-600" />
          <span>Arrays: Zero-Based Indexing & Selection Sort</span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={stepSort} className="ed-btn-primary !min-h-8 !px-3 !text-xs">
            <StepForward className="h-3.5 w-3.5" />
            <span>รันขั้นถัดไป</span>
          </button>
          <button type="button" onClick={reset} className="ed-btn-secondary !min-h-8 !px-3 !text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>รีเซ็ต</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {arr.map((val, i) => {
          const sorted = i < pass;
          const active = i === selectedIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`rounded-xl border p-3 text-center transition ${
                sorted
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                  : active
                    ? "border-[#1364E7] bg-white ring-2 ring-[#1364E7]/20"
                    : "border-[#D4E4FC] bg-white"
              }`}
            >
              <div className="font-mono text-[10px] text-[#5C7299]">index [{i}]</div>
              <div className="mt-1 font-mono text-lg font-bold text-[#092551]">{val}</div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#081A37] px-4 py-3 font-mono text-xs text-[#64DCA2]">
        <span>notes[{selectedIndex}] === {arr[selectedIndex]}</span>
        <span className="text-sky-200">{statusNote} (pass={pass}, cur={idx})</span>
      </div>
    </div>
  );
}

/**
 * จำลองเซนเซอร์วัดความเร่ง 3 แกน (X, Y, Z) และเหตุการณ์ Gesture บน micro:bit
 */
export function AccelGestureVisualizer() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(-1024);

  const presets = [
    { label: "วางราบ (Face Up)", x: 0, y: 0, z: -1024 },
    { label: "เอียงซ้าย (Tilt Left)", x: -750, y: 0, z: -650 },
    { label: "เอียงขวา (Tilt Right)", x: 750, y: 0, z: -650 },
    { label: "เขย่าแรง (Shake!)", x: 1400, y: -1100, z: 950 },
    { label: "ตกอิสระ (Free Fall)", x: 20, y: -15, z: 10 },
  ];

  const mag = Math.round(Math.sqrt(x * x + y * y + z * z));
  let gesture = "ScreenUp (วางปกติ)";
  if (mag > 1600) gesture = "Shake (ตรวจพบการเขย่าแรง)";
  else if (mag < 250) gesture = "FreeFall (ความเร่งรวมใกล้ 0 mg)";
  else if (x < -450) gesture = "TiltLeft (เอียงซ้าย x < -450)";
  else if (x > 450) gesture = "TiltRight (เอียงขวา x > +450)";

  return (
    <div className="space-y-4 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#092551]">
          <Activity className="h-4 w-4 text-emerald-600" />
          <span>3-Axis Accelerometer Simulator (mg)</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setX(p.x);
                setY(p.y);
                setZ(p.z);
              }}
              className="rounded-lg border border-[#D4E2FA] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#35517D] hover:border-emerald-500"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          { axis: "X (ซ้าย ↔ ขวา)", val: x, set: setX },
          { axis: "Y (หน้า ↔ หลัง)", val: y, set: setY },
          { axis: "Z (ขึ้น ↔ ลง)", val: z, set: setZ },
        ].map((item) => (
          <label key={item.axis} className="rounded-xl border border-[#D4E4FC] bg-white p-3 text-xs font-semibold text-[#092551]">
            <div className="flex items-center justify-between">
              <span>{item.axis}</span>
              <span className="font-mono text-emerald-700">{item.val} mg</span>
            </div>
            <input
              type="range"
              min={-1500}
              max={1500}
              step={50}
              value={item.val}
              onChange={(e) => item.set(Number(e.target.value))}
              className="mt-2 w-full accent-emerald-600"
            />
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#081A37] p-4 font-mono text-xs text-white">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-emerald-400" />
          <span>ความเร่งสุทธิ (Strength): <strong className="text-emerald-300">{mag} mg</strong></span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1 text-emerald-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Gesture: {gesture}</span>
        </div>
      </div>
    </div>
  );
}
