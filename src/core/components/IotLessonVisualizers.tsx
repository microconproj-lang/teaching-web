"use client";

import { useState } from "react";
import { Radio, Layers, Cpu, ShieldAlert, CheckCircle2, AlertTriangle, Zap } from "lucide-react";

/**
 * จำลอง MQTT Broker พร้อม wildcard matching (+ และ #) สำหรับบทเรียน ว23202
 */
export function MqttPubSubVisualizer() {
  const [topic, setTopic] = useState("room/lab1/temp");
  const [payload, setPayload] = useState('{"temp": 31.5, "unit": "C"}');
  const [subs, setSubs] = useState<Record<string, string>>({
    app: "room/+/temp",
    fan: "room/lab1/#",
    alarm: "alert/#",
  });
  const [logs, setLogs] = useState<Array<{ topic: string; payload: string; matched: string[] }>>([
    {
      topic: "room/lab1/temp",
      payload: '{"temp": 31.5, "unit": "C"}',
      matched: ["Mobile App", "Smart Fan (Pico W)"],
    },
  ]);

  const matchMqtt = (pattern: string, target: string): boolean => {
    const pParts = pattern.split("/");
    const tParts = target.split("/");
    for (let i = 0; i < pParts.length; i++) {
      const p = pParts[i];
      if (p === "#") return true;
      if (i >= tParts.length) return false;
      if (p !== "+" && p !== tParts[i]) return false;
    }
    return pParts.length === tParts.length;
  };

  const subscribers = [
    { key: "app", label: "Mobile App", defaultSub: "room/+/temp" },
    { key: "fan", label: "Smart Fan (Pico W)", defaultSub: "room/lab1/#" },
    { key: "alarm", label: "Emergency Siren", defaultSub: "alert/#" },
  ];

  const handlePublish = () => {
    const matched = subscribers
      .filter((s) => matchMqtt(subs[s.key] ?? "", topic.trim()))
      .map((s) => s.label);
    setLogs((prev) => [{ topic: topic.trim(), payload, matched }, ...prev].slice(0, 4));
  };

  return (
    <div className="space-y-4 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#092551]">
          <Radio className="h-4 w-4 text-[#F0742E]" />
          <span>MQTT Publish / Subscribe Broker Simulator</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["room/lab1/temp", "room/lab1/humid", "alert/smoke"].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setTopic(preset)}
              className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-semibold transition ${
                topic === preset
                  ? "bg-[#092551] text-white"
                  : "border border-[#D4E2FA] bg-white text-[#3F557E] hover:border-[#1364E7]"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-12">
        {/* Publisher */}
        <div className="space-y-2.5 rounded-xl border border-[#D4E4FC] bg-white p-3.5 md:col-span-5">
          <div className="text-[11px] font-bold uppercase tracking-wide text-[#F0742E]">
            1. Publisher (Pico W Sensor)
          </div>
          <label className="block text-[11px] font-semibold text-[#5C7299]">
            Topic
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#D4E2FA] bg-[#F8FAFF] px-2.5 py-1.5 font-mono text-xs text-[#092551]"
            />
          </label>
          <label className="block text-[11px] font-semibold text-[#5C7299]">
            JSON Payload
            <input
              type="text"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#D4E2FA] bg-[#F8FAFF] px-2.5 py-1.5 font-mono text-xs text-[#092551]"
            />
          </label>
          <button
            type="button"
            onClick={handlePublish}
            className="w-full rounded-xl bg-[#F0742E] px-3 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#D9611E]"
          >
            Publish ผ่าน Broker →
          </button>
        </div>

        {/* Subscribers */}
        <div className="space-y-2 rounded-xl border border-[#D4E4FC] bg-white p-3.5 md:col-span-7">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-[#1364E7]">
            <span>2. Subscribers (Wildcards: + และ #)</span>
            <span className="font-mono text-[10px] text-[#5C7299]">+ = 1 ชั้น · # = หลายชั้น</span>
          </div>
          {subscribers.map((s) => {
            const pattern = subs[s.key] ?? "";
            const hit = matchMqtt(pattern, topic.trim());
            return (
              <div
                key={s.key}
                className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2 transition ${
                  hit ? "border-emerald-300 bg-emerald-50/70" : "border-[#E1EAFB] bg-[#F8FAFF]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      hit ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                  <span className="text-xs font-bold text-[#092551]">{s.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setSubs((p) => ({ ...p, [s.key]: e.target.value }))}
                    aria-label={`Subscription topic for ${s.label}`}
                    className="w-36 rounded-lg border border-[#D4E2FA] bg-white px-2 py-1 font-mono text-[11px] text-[#092551]"
                  />
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      hit ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {hit ? "ได้รับข้อมูล" : "ไม่ตรงเงื่อนไข"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Broker Log */}
      <div className="rounded-xl bg-[#081A37] p-3.5 font-mono text-xs text-white">
        <div className="mb-1 text-[11px] text-[#8BA9DA]">Broker Delivery Log (ล่าสุด):</div>
        {logs.map((entry, idx) => (
          <div key={idx} className="truncate py-0.5 text-[11px]">
            <span className="text-[#F0742E]">[{entry.topic}]</span>{" "}
            <span className="text-slate-300">{entry.payload}</span>{" "}
            <span className="text-[#64DCA2]">
              → {entry.matched.length > 0 ? entry.matched.join(", ") : "ไม่มีผู้รับที่ Subscribe ไว้"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

type MoscowTier = "M" | "S" | "C" | "W";

/**
 * จำลองการจัดลำดับ Product Backlog ด้วยเทคนิค MoSCoW และ Story Points
 */
export function MoscowBacklogVisualizer() {
  const items = [
    { id: "wifi", title: "Pico W ส่งค่า Temp ผ่าน Wi-Fi + MQTT", pts: 5, recommended: "M" as MoscowTier },
    { id: "relay", title: "ปุ่มเปิด-ปิดพัดลมฉุกเฉินจากแอป", pts: 3, recommended: "M" as MoscowTier },
    { id: "chart", title: "กราฟสถิติย้อนหลัง 7 วัน", pts: 5, recommended: "S" as MoscowTier },
    { id: "theme", title: "เปลี่ยนสีธีมแอป Dark / Light Mode", pts: 2, recommended: "C" as MoscowTier },
    { id: "voice", title: "สั่งงานด้วยเสียง AI ภาษาไทย", pts: 8, recommended: "W" as MoscowTier },
  ];

  const [tiers, setTiers] = useState<Record<string, MoscowTier>>({
    wifi: "M",
    relay: "M",
    chart: "S",
    theme: "C",
    voice: "W",
  });
  const [capacity, setCapacity] = useState(10);

  const cycleTier = (id: string) => {
    const order: MoscowTier[] = ["M", "S", "C", "W"];
    setTiers((prev) => {
      const idx = order.indexOf(prev[id] ?? "M");
      return { ...prev, [id]: order[(idx + 1) % order.length] };
    });
  };

  const tierMeta: Record<MoscowTier, { label: string; cls: string }> = {
    M: { label: "Must Have", cls: "bg-rose-100 text-rose-800 border-rose-200" },
    S: { label: "Should Have", cls: "bg-amber-100 text-amber-800 border-amber-200" },
    C: { label: "Could Have", cls: "bg-sky-100 text-sky-800 border-sky-200" },
    W: { label: "Won't Have (รอบนี้)", cls: "bg-slate-100 text-slate-600 border-slate-200" },
  };

  const mustPts = items.filter((i) => tiers[i.id] === "M").reduce((acc, i) => acc + i.pts, 0);
  const committedPts = items
    .filter((i) => tiers[i.id] === "M" || tiers[i.id] === "S")
    .reduce((acc, i) => acc + i.pts, 0);
  const overloaded = mustPts > capacity;

  return (
    <div className="space-y-4 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#092551]">
          <Layers className="h-4 w-4 text-[#1364E7]" />
          <span>MoSCoW Backlog & Sprint Capacity Simulator (คลิกป้ายเพื่อย้ายกลุ่ม)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#5C7299]">ความจุ Sprint (Velocity):</span>
          {[8, 10, 15].map((cap) => (
            <button
              key={cap}
              type="button"
              onClick={() => setCapacity(cap)}
              className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold ${
                capacity === cap
                  ? "bg-[#092551] text-white"
                  : "border border-[#D4E2FA] bg-white text-[#3F557E]"
              }`}
            >
              {cap} pts
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const t = tiers[item.id] ?? "M";
          return (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#DCE7FA] bg-white px-3.5 py-2.5"
            >
              <div>
                <div className="text-xs font-bold text-[#092551]">{item.title}</div>
                <div className="text-[11px] text-[#5C7299]">Effort: {item.pts} Story Points</div>
              </div>
              <button
                type="button"
                onClick={() => cycleTier(item.id)}
                className={`rounded-full border px-3 py-1 text-xs font-bold transition hover:scale-[1.02] ${tierMeta[t].cls}`}
              >
                {t} · {tierMeta[t].label}
              </button>
            </div>
          );
        })}
      </div>

      <div
        className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3.5 text-xs ${
          overloaded
            ? "border-rose-200 bg-rose-50 text-rose-800"
            : "border-emerald-200 bg-emerald-50 text-emerald-900"
        }`}
      >
        <div className="flex items-center gap-2 font-bold">
          {overloaded ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          <span>
            Must Have = {mustPts} pts · Must+Should = {committedPts} pts (ขีดจำกัดทีม {capacity} pts)
          </span>
        </div>
        <span className="font-medium">
          {overloaded
            ? "งานสำคัญเกินความจุ Sprint! ควรลดขอบเขตบางฟีเจอร์ไป Should/Won't"
            : "ขอบเขต MVP สมดุล ทีมส่งมอบงานหลักได้ทันกำหนด"}
        </span>
      </div>
    </div>
  );
}

/**
 * จำลองการต่อขา GPIO Raspberry Pi Pico W + PWM Fan + MicroPython Code
 */
export function PicoGpioVisualizer() {
  const [temp, setTemp] = useState(30);
  const [threshold, setThreshold] = useState(28);
  const [manualOverride, setManualOverride] = useState(false);

  const fanOn = manualOverride || temp >= threshold;
  const dutyPct = manualOverride ? 100 : temp < threshold ? 0 : Math.min(100, (temp - threshold) * 15 + 40);
  const dutyU16 = Math.round((dutyPct / 100) * 65535);

  const pins = [
    { pin: "GP15", role: "PWM Fan / LED", active: fanOn, detail: `${dutyPct}% PWM (${dutyU16})` },
    { pin: "GP16", role: "Status Buzzer", active: temp >= 36, detail: temp >= 36 ? "HIGH (Alert)" : "LOW" },
    { pin: "GP26", role: "ADC0 Temp Sensor", active: true, detail: `${temp}°C Input` },
    { pin: "GND", role: "Common Ground (0V)", active: true, detail: "Connected" },
  ];

  return (
    <div className="space-y-4 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#092551]">
          <Cpu className="h-4 w-4 text-[#F0742E]" />
          <span>Raspberry Pi Pico W · GPIO & PWM Lab Simulator</span>
        </div>
        <button
          type="button"
          onClick={() => setManualOverride((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${
            manualOverride ? "bg-[#F0742E] text-white" : "border border-[#D4E2FA] bg-white text-[#092551]"
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          {manualOverride ? "Emergency Override: ON" : "โหมดอัตโนมัติ (Sensor)"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-[#DCE7FA] bg-white p-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#092551]">
              <span>ค่าอุณหภูมิจาก Sensor (GP26 ADC)</span>
              <span className="font-mono text-[#1364E7]">{temp}°C</span>
            </div>
            <input
              type="range"
              min={20}
              max={42}
              value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
              className="mt-2 w-full accent-[#1364E7]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[#092551]">
              <span>เกณฑ์เปิดพัดลม (Threshold)</span>
              <span className="font-mono text-[#F0742E]">{threshold}°C</span>
            </div>
            <input
              type="range"
              min={24}
              max={36}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="mt-2 w-full accent-[#F0742E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {pins.map((p) => (
              <div
                key={p.pin}
                className={`rounded-lg border px-2.5 py-2 text-[11px] ${
                  p.active ? "border-emerald-300 bg-emerald-50/70" : "border-[#E1EAFB] bg-[#F8FAFF]"
                }`}
              >
                <div className="font-mono font-bold text-[#092551]">{p.pin}</div>
                <div className="text-[10px] text-[#5C7299]">{p.role}</div>
                <div className="mt-0.5 font-mono text-[10px] font-bold text-[#1364E7]">{p.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-[#081A37] p-4 font-mono text-xs text-white">
          <div className="mb-2 flex items-center justify-between text-[11px] text-[#8BA9DA]">
            <span>main.py (MicroPython Logic)</span>
            <span className={fanOn ? "text-[#64DCA2]" : "text-slate-400"}>
              FAN: {fanOn ? `RUNNING ${dutyPct}%` : "IDLE 0%"}
            </span>
          </div>
          <pre className="overflow-x-auto leading-relaxed text-[#D8E7FF]">{`from machine import Pin, PWM

pwm_fan = PWM(Pin(15))
pwm_fan.freq(1000)
temp = ${temp}
threshold = ${threshold}

if ${manualOverride ? "True  # Manual Override" : `temp >= threshold`}:
    pwm_fan.duty_u16(${dutyU16})  # ${dutyPct}%
else:
    pwm_fan.duty_u16(0)`}</pre>
        </div>
      </div>
    </div>
  );
}

/**
 * จำลองการคัดแยกบั๊กด้วย Severity vs Priority และเช็ก QA Readiness
 */
export function TestingTriageVisualizer() {
  const bugs = [
    {
      id: "b1",
      title: "กดปุ่มเปิดรีเลย์บนแอปแล้ว Pico W ไม่ตอบสนองเลย",
      sev: "High (ระบบหลักพัง)",
      pri: "P0 (แก้ทันที)",
      correct: "Critical Blocker",
      advice: "ห้าม Release! ทั้ง Severity สูง (ระบบควบคุมไม่ทำงาน) และ Priority ด่วนสุด",
    },
    {
      id: "b2",
      title: "หน้า Dashboard พิมพ์คำว่า 'อุณหภูมิ' ตกสระบนมือถือจอเล็ก",
      sev: "Low (UI เล็กน้อย)",
      pri: "P1 (แก้ก่อนส่งมอบ)",
      correct: "Fix in Sprint",
      advice: "Severity ต่ำ (คำนวณยังถูก) แต่ Priority สูงเพราะลูกค้าเห็นชัดเจนบนหน้าแรก",
    },
    {
      id: "b3",
      title: "เมื่อ Wi-Fi หลุด ระบบไม่ลอง Reconnect อัตโนมัติ",
      sev: "High (IoT ขาดเสถียรภาพ)",
      pri: "P1 (ต้องแก้)",
      correct: "Reliability Risk",
      advice: "อุปกรณ์ IoT ภาคสนามต้องมี Reconnect Loop และ Watchdog ป้องกันค้าง",
    },
  ];
  const [selectedId, setSelectedId] = useState("b1");
  const [checks, setChecks] = useState<Record<string, boolean>>({
    unit: true,
    integration: true,
    uat: false,
  });

  const current = bugs.find((b) => b.id === selectedId) ?? bugs[0];
  const passedCount = Object.values(checks).filter(Boolean).length;

  return (
    <div className="space-y-4 rounded-2xl border border-[#D4E4FC] bg-[#F8FAFF] p-5">
      <div className="flex items-center gap-2 text-xs font-bold text-[#092551]">
        <ShieldAlert className="h-4 w-4 text-[#F0742E]" />
        <span>QA Bug Triage & Release Checklist</span>
      </div>

      <div className="grid gap-3 md:grid-cols-12">
        <div className="space-y-2 md:col-span-6">
          {bugs.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedId(b.id)}
              className={`w-full rounded-xl border p-3 text-left text-xs transition ${
                selectedId === b.id
                  ? "border-[#1364E7] bg-white shadow-xs ring-2 ring-[#1364E7]/15"
                  : "border-[#DCE7FA] bg-white/80 hover:border-[#9FC0F8]"
              }`}
            >
              <div className="font-bold text-[#092551]">{b.title}</div>
              <div className="mt-1 flex flex-wrap gap-1.5 text-[10px]">
                <span className="rounded bg-rose-50 px-2 py-0.5 font-semibold text-rose-700">{b.sev}</span>
                <span className="rounded bg-amber-50 px-2 py-0.5 font-semibold text-amber-800">{b.pri}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-3 rounded-xl border border-[#DCE7FA] bg-white p-4 md:col-span-6">
          <div className="inline-block rounded-full bg-[#092551] px-2.5 py-0.5 text-[10px] font-bold text-white">
            ผลการวิเคราะห์ Triage: {current.correct}
          </div>
          <p className="text-xs leading-relaxed text-[#3F557E]">{current.advice}</p>

          <div className="border-t border-[#EBF2FE] pt-3">
            <div className="mb-2 text-[11px] font-bold text-[#092551]">
              Test Pyramid Readiness ({passedCount}/3 ชั้นผ่านเกณฑ์):
            </div>
            {[
              { k: "unit", label: "Unit Test: ตรวจฟังก์ชันคำนวณ & Threshold" },
              { k: "integration", label: "Integration Test: App → Broker → Pico W" },
              { k: "uat", label: "UAT: ทดลองใช้จริงโดยผู้ใช้งานปลายทาง" },
            ].map((c) => (
              <label key={c.k} className="mt-1.5 flex cursor-pointer items-center gap-2 text-xs text-[#11264A]">
                <input
                  type="checkbox"
                  checked={Boolean(checks[c.k])}
                  onChange={(e) => setChecks((p) => ({ ...p, [c.k]: e.target.checked }))}
                  className="accent-[#1364E7]"
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>

          <div
            className={`rounded-lg px-3 py-2 text-xs font-bold ${
              passedCount === 3
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            สถานะ Release: {passedCount === 3 ? "GO — พร้อมส่งมอบโปรดักชัน!" : "HOLD — ต้องผ่าน Test ครบทั้ง 3 ระดับก่อน"}
          </div>
        </div>
      </div>
    </div>
  );
}
