"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PixelIcon } from "@/core/components/PixelSprite";

interface SemesterRow {
  id: string;
  academicYearId: string;
  yearBe: number;
  label: string;
  startsOn: string;
  endsOn: string;
  isCurrent: boolean;
  isLocked: boolean;
}

interface YearRow {
  id: string;
  yearBe: number;
  label: string;
  isCurrent: boolean;
}

interface ClassroomRow {
  id: string;
  academicYearId: string;
  name: string;
  gradeLevel: number;
  roomNo: number;
}

interface StaffRow {
  email: string;
  assignedRole: "teacher" | "admin";
  note: string | null;
}

interface ModuleRow {
  moduleKey: string;
  title: string;
}

interface Props {
  years: YearRow[];
  semesters: SemesterRow[];
  classrooms: ClassroomRow[];
  staffList: StaffRow[];
  modules: ModuleRow[];
}

export function AdminConsoleClient({
  years,
  semesters,
  classrooms,
  staffList,
  modules,
}: Props) {
  const router = useRouter();
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [yearBe, setYearBe] = useState(2569);
  const [termNo, setTermNo] = useState<1 | 2 | 3>(2);
  const [startsOn, setStartsOn] = useState("2026-11-01");
  const [endsOn, setEndsOn] = useState("2027-03-31");
  const [setAsCurrent, setSetAsCurrent] = useState(false);

  const activeYearId = years.find((y) => y.isCurrent)?.id ?? years[0]?.id ?? "";
  const [roomYearId, setRoomYearId] = useState(activeYearId);
  const [gradeLevel, setGradeLevel] = useState(1);
  const [roomNo, setRoomNo] = useState(2);

  const [importRoomId, setImportRoomId] = useState(classrooms[0]?.id ?? "");
  const [csvText, setCsvText] = useState(
    "เลขที่,ชื่อ-สกุล,อีเมล\n2,สมชาย ใจดี,somchai.j@pccpl.ac.th\n3,สมหญิง รักเรียน,somying.r@pccpl.ac.th"
  );

  const activeSemesterId = semesters.find((s) => s.isCurrent)?.id ?? semesters[0]?.id ?? "";
  const [assignSemId, setAssignSemId] = useState(activeSemesterId);
  const [assignRoomId, setAssignRoomId] = useState(classrooms[0]?.id ?? "");
  const [assignModuleKey, setAssignModuleKey] = useState(modules[0]?.moduleKey ?? "");
  const [weightPercent, setWeightPercent] = useState(20);

  const [staffEmail, setStaffEmail] = useState("");
  const [staffRole, setStaffRole] = useState<"teacher" | "admin">("teacher");
  const [staffNote, setStaffNote] = useState("");

  const callApi = async (
    url: string,
    method: string,
    body?: unknown,
    successText = "บันทึกเรียบร้อย"
  ) => {
    setStatusMsg(null);
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatusMsg({ ok: false, text: data.error ?? "บันทึกข้อมูลไม่สำเร็จ กรุณาตรวจสอบอีกครั้ง" });
      return false;
    }
    setStatusMsg({ ok: true, text: successText });
    router.refresh();
    return true;
  };

  return (
    <div className="space-y-6">
      {statusMsg && (
        <div
          role="status"
          className={`notch flex items-center gap-2 border-2 p-4 text-sm font-semibold ${
            statusMsg.ok
              ? "border-cloth-deep bg-s-mastered text-paper"
              : "border-cloth-deep bg-s-stuck text-paper"
          }`}
        >
          <PixelIcon name={statusMsg.ok ? "check" : "warn"} size={16} />
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* 1. ปีการศึกษาและภาคเรียน */}
      <section className="ed-card space-y-4 p-6">
        <h2 className="font-display text-xl font-bold text-[#092551]">ปีการศึกษาและภาคเรียน</h2>

        <div className="overflow-x-auto rounded-2xl border border-[#DCE7FA]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#DCE7FA] bg-[#F8FAFF] text-[#092551]">
                <th className="px-4 py-3 font-bold">ภาคเรียน</th>
                <th className="px-4 py-3 font-bold">ช่วงวันที่</th>
                <th className="px-4 py-3 font-bold">สถานะใช้งาน</th>
                <th className="px-4 py-3 font-bold">การล็อกคะแนน</th>
                <th className="px-4 py-3 text-right font-bold">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBF2FE]">
              {semesters.map((s) => (
                <tr key={s.id} className="hover:bg-[#F8FAFF]/60">
                  <td className="px-4 py-3 font-semibold text-[#092551]">{s.label}</td>
                  <td className="px-4 py-3 text-[#5C7299]">
                    {s.startsOn} ถึง {s.endsOn}
                  </td>
                  <td className="px-4 py-3">
                    {s.isCurrent ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                        ภาคเรียนปัจจุบัน
                      </span>
                    ) : (
                      <span className="text-xs text-[#5C7299]">ภาคเรียนอื่น</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {s.isLocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                        <PixelIcon name="lock" size={12} /> ล็อกคะแนนแล้ว (ดูได้เท่านั้น)
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-[#5C7299]">เปิดรับงาน</span>
                    )}
                  </td>
                  <td className="space-x-2 px-4 py-3 text-right">
                    {!s.isCurrent && (
                      <button
                        type="button"
                        onClick={() =>
                          callApi(
                            "/api/admin/semesters",
                            "PATCH",
                            { semesterId: s.id, setCurrent: true },
                            `เปลี่ยนภาคเรียนปัจจุบันเป็น ${s.label} แล้ว`
                          )
                        }
                        className="inline-flex min-h-9 cursor-pointer items-center rounded-xl border border-[#DCE7FA] bg-[#EFF6FF] px-3 text-xs font-semibold text-[#1364E7] hover:bg-[#1364E7] hover:text-white"
                      >
                        ตั้งเป็นปัจจุบัน
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        callApi(
                          "/api/admin/semesters",
                          "PATCH",
                          { semesterId: s.id, isLocked: !s.isLocked },
                          s.isLocked ? `ปลดล็อก ${s.label} แล้ว` : `ล็อกคะแนน ${s.label} แล้ว`
                        )
                      }
                      className="inline-flex min-h-9 cursor-pointer items-center rounded-xl border border-[#D4E2FA] bg-white px-3 text-xs font-semibold text-[#092551] hover:bg-[#F8FAFF]"
                    >
                      {s.isLocked ? "ปลดล็อก" : "ล็อกภาคเรียน"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4 rounded-2xl border border-[#E1EAFB] bg-[#F8FAFF] p-4 sm:grid-cols-5">
          <div>
            <label htmlFor="admin-year-be" className="text-xs font-semibold text-[#092551]">
              ปี พ.ศ.
            </label>
            <input
              id="admin-year-be"
              type="number"
              value={yearBe}
              onChange={(e) => setYearBe(Number(e.target.value))}
              className="input-thread mt-1 px-2"
            />
          </div>
          <div>
            <label htmlFor="admin-term-no" className="text-xs font-semibold text-[#092551]">
              ภาคเรียน
            </label>
            <select
              id="admin-term-no"
              value={termNo}
              onChange={(e) => setTermNo(Number(e.target.value) as 1 | 2 | 3)}
              className="input-thread mt-1 px-2"
            >
              <option value={1}>เทอม 1</option>
              <option value={2}>เทอม 2</option>
              <option value={3}>ฤดูร้อน</option>
            </select>
          </div>
          <div>
            <label htmlFor="admin-starts" className="text-xs font-semibold text-[#092551]">
              วันเริ่ม
            </label>
            <input
              id="admin-starts"
              type="date"
              value={startsOn}
              onChange={(e) => setStartsOn(e.target.value)}
              className="input-thread mt-1 px-2"
            />
          </div>
          <div>
            <label htmlFor="admin-ends" className="text-xs font-semibold text-[#092551]">
              วันสิ้นสุด
            </label>
            <input
              id="admin-ends"
              type="date"
              value={endsOn}
              onChange={(e) => setEndsOn(e.target.value)}
              className="input-thread mt-1 px-2"
            />
          </div>
          <div className="flex flex-col justify-end gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#092551]">
              <input
                type="checkbox"
                checked={setAsCurrent}
                onChange={(e) => setSetAsCurrent(e.target.checked)}
                className="h-4 w-4 accent-[#1364E7]"
              />
              ตั้งเป็นเทอมปัจจุบัน
            </label>
            <button
              type="button"
              onClick={() =>
                callApi(
                  "/api/admin/semesters",
                  "POST",
                  { yearBe, termNo, startsOn, endsOn, setAsCurrent },
                  "สร้างปีการศึกษาและภาคเรียนใหม่แล้ว"
                )
              }
              className="ed-btn-primary min-h-10 text-xs"
            >
              เพิ่มภาคเรียน
            </button>
          </div>
        </div>
      </section>

      {/* 2. ห้องเรียน และ มอบหมายชุดภารกิจ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="ed-card space-y-4 p-6">
          <h2 className="font-display text-xl font-bold text-[#092551]">สร้างห้องเรียน</h2>

          <div className="flex flex-wrap gap-2">
            {classrooms.map((c) => (
              <span
                key={c.id}
                className="rounded-xl border border-[#DCE7FA] bg-[#F8FAFF] px-3 py-1 text-xs font-semibold text-[#092551]"
              >
                {c.name}
              </span>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="room-year" className="text-xs font-semibold text-[#092551]">
                ปีการศึกษา
              </label>
              <select
                id="room-year"
                value={roomYearId}
                onChange={(e) => setRoomYearId(e.target.value)}
                className="input-thread mt-1"
              >
                {years.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="room-grade" className="text-xs font-semibold text-[#092551]">
                ระดับชั้น
              </label>
              <select
                id="room-grade"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(Number(e.target.value))}
                className="input-thread mt-1"
              >
                <option value={1}>ม.1</option>
                <option value={2}>ม.2</option>
                <option value={3}>ม.3</option>
              </select>
            </div>
            <div>
              <label htmlFor="room-no" className="text-xs font-semibold text-[#092551]">
                ห้องที่
              </label>
              <input
                id="room-no"
                type="number"
                min={1}
                value={roomNo}
                onChange={(e) => setRoomNo(Number(e.target.value))}
                className="input-thread mt-1"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              callApi(
                "/api/admin/classrooms",
                "POST",
                { academicYearId: roomYearId, gradeLevel, roomNo },
                `สร้างห้อง ม.${gradeLevel}/${roomNo} แล้ว`
              )
            }
            className="ed-btn-primary text-sm"
          >
            เพิ่มห้องเรียน
          </button>
        </section>

        <section className="ed-card space-y-4 p-6">
          <h2 className="font-display text-xl font-bold text-[#092551]">มอบหมายชุดภารกิจให้ห้องเรียน</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="assign-sem" className="text-xs font-semibold text-[#092551]">
                ภาคเรียน
              </label>
              <select
                id="assign-sem"
                value={assignSemId}
                onChange={(e) => setAssignSemId(e.target.value)}
                className="input-thread mt-1"
              >
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="assign-room" className="text-xs font-semibold text-[#092551]">
                ห้องเรียน
              </label>
              <select
                id="assign-room"
                value={assignRoomId}
                onChange={(e) => setAssignRoomId(e.target.value)}
                className="input-thread mt-1"
              >
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="assign-mod" className="text-xs font-semibold text-[#092551]">
                ชุดภารกิจ
              </label>
              <select
                id="assign-mod"
                value={assignModuleKey}
                onChange={(e) => setAssignModuleKey(e.target.value)}
                className="input-thread mt-1"
              >
                {modules.map((m) => (
                  <option key={m.moduleKey} value={m.moduleKey}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="assign-weight" className="text-xs font-semibold text-[#092551]">
                น้ำหนักคะแนน (%)
              </label>
              <input
                id="assign-weight"
                type="number"
                min={0}
                max={100}
                value={weightPercent}
                onChange={(e) => setWeightPercent(Number(e.target.value))}
                className="input-thread mt-1"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              callApi(
                "/api/admin/assignments",
                "POST",
                {
                  semesterId: assignSemId,
                  classroomId: assignRoomId,
                  moduleKey: assignModuleKey,
                  weightPercent,
                },
                "มอบหมายชุดภารกิจให้ห้องเรียนแล้ว"
              )
            }
            className="ed-btn-primary text-sm"
          >
            มอบหมายงาน
          </button>
        </section>
      </div>

      {/* 3. นำเข้ารายชื่อนักเรียน CSV */}
      <section className="ed-card space-y-4 p-6">
        <h2 className="font-display text-xl font-bold text-[#092551]">นำเข้ารายชื่อนักเรียน (CSV)</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="import-room" className="text-xs font-semibold text-[#092551]">
              เลือกห้องเรียนปลายทาง
            </label>
            <select
              id="import-room"
              value={importRoomId}
              onChange={(e) => setImportRoomId(e.target.value)}
              className="input-thread mt-1"
            >
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <p className="mt-2.5 text-xs text-[#5C7299]">
              รูปแบบ: เลขที่,ชื่อ-สกุล,อีเมล@pccpl.ac.th
            </p>
          </div>
          <div className="sm:col-span-2">
            <textarea
              rows={5}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              aria-label="ข้อมูลรายชื่อนักเรียน CSV"
              className="w-full rounded-2xl border border-[#DCE7FA] bg-[#F8FAFF] p-3 font-code text-xs text-[#092551] outline-none focus:border-[#1364E7]"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            callApi(
              "/api/admin/students/import",
              "POST",
              { classroomId: importRoomId, csvText },
              "นำเข้ารายชื่อนักเรียนเข้าห้องเรียนแล้ว"
            )
          }
          className="ed-btn-primary text-sm"
        >
          นำเข้ารายชื่อเข้าห้องเรียน
        </button>
      </section>

      {/* 4. สิทธิ์ครูผู้สอนและผู้ดูแลระบบ */}
      <section className="ed-card space-y-4 p-6">
        <h2 className="font-display text-xl font-bold text-[#092551]">
          สิทธิ์ครูผู้สอนและผู้ดูแลระบบ
        </h2>

        <div className="flex flex-wrap gap-2">
          {staffList.map((st) => (
            <div
              key={st.email}
              className="inline-flex items-center gap-2 rounded-xl border border-[#DCE7FA] bg-[#F8FAFF] px-3 py-1.5 text-xs"
            >
              <span className="font-semibold text-[#092551]">{st.email}</span>
              <span className="rounded-lg bg-white px-2 py-0.5 text-[11px] font-bold text-[#1364E7] ring-1 ring-[#D4E2FA]">
                {st.assignedRole === "admin" ? "ผู้ดูแล" : "ครู"}
              </span>
              <button
                type="button"
                onClick={() =>
                  callApi(
                    `/api/admin/staff?email=${encodeURIComponent(st.email)}`,
                    "DELETE",
                    undefined,
                    `ลบ ${st.email} ออกจากรายชื่อสิทธิ์แล้ว`
                  )
                }
                aria-label={`ลบสิทธิ์ ${st.email}`}
                className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[#5C7299] hover:bg-red-50 hover:text-red-600"
              >
                <PixelIcon name="close" size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <input
            type="email"
            placeholder="teacher@pccpl.ac.th"
            value={staffEmail}
            onChange={(e) => setStaffEmail(e.target.value)}
            className="input-thread"
          />
          <select
            value={staffRole}
            onChange={(e) => setStaffRole(e.target.value as "teacher" | "admin")}
            className="input-thread"
          >
            <option value="teacher">ครูผู้สอน</option>
            <option value="admin">ผู้ดูแลระบบ</option>
          </select>
          <input
            type="text"
            placeholder="หมายเหตุ เช่น ครูวิทยาการคำนวณ"
            value={staffNote}
            onChange={(e) => setStaffNote(e.target.value)}
            className="input-thread"
          />
          <button
            type="button"
            onClick={() =>
              callApi(
                "/api/admin/staff",
                "POST",
                { email: staffEmail, assignedRole: staffRole, note: staffNote },
                "บันทึกสิทธิ์บุคลากรเรียบร้อยแล้ว"
              )
            }
            className="ed-btn-primary text-sm"
          >
            เพิ่มสิทธิ์
          </button>
        </div>
      </section>
    </div>
  );
}
