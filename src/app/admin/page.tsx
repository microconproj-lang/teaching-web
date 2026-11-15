import Link from "next/link";
import { redirect } from "next/navigation";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/core/db";
import { academicYears, classrooms, modules, semesters, staffAllowlist } from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { AdminConsoleClient } from "@/core/components/AdminConsoleClient";
import { PixelIcon } from "@/core/components/PixelSprite";
import { WeaveNav } from "@/core/components/WeaveNav";

export default async function AdminPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/");
  if (session.role !== "admin") redirect("/dashboard");

  const years = await db.select().from(academicYears).orderBy(desc(academicYears.yearBe));
  const semesterRows = await db
    .select({
      id: semesters.id,
      academicYearId: semesters.academicYearId,
      yearBe: academicYears.yearBe,
      label: semesters.label,
      startsOn: semesters.startsOn,
      endsOn: semesters.endsOn,
      isCurrent: semesters.isCurrent,
      isLocked: semesters.isLocked,
    })
    .from(semesters)
    .innerJoin(academicYears, eq(semesters.academicYearId, academicYears.id))
    .orderBy(desc(academicYears.yearBe), asc(semesters.termNo));

  const roomRows = await db
    .select()
    .from(classrooms)
    .orderBy(asc(classrooms.gradeLevel), asc(classrooms.roomNo));

  const staffRows = await db.select().from(staffAllowlist).orderBy(asc(staffAllowlist.email));
  const moduleRows = await db
    .select({ moduleKey: modules.moduleKey, title: modules.title })
    .from(modules)
    .orderBy(asc(modules.title));

  const currentSemLabel = semesterRows.find((s) => s.isCurrent)?.label ?? null;

  return (
    <div className="min-h-screen bg-paper text-cloth-deep">
      <WeaveNav
        session={session}
        activePath="admin"
        semesterLabel={currentSemLabel}
        surface="paper"
      />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/dashboard" className="btn-notch-outline notch text-sm">
            <PixelIcon name="back" size={16} />
            <span>กลับภาพรวม</span>
          </Link>
          <span className="border-2 border-cloth-deep bg-cloth px-3 py-1 text-sm font-semibold">
            ผู้ดูแลระบบ: {session.email}
          </span>
        </div>

        <header className="notch-lg border-2 border-cloth-deep bg-paper p-6">
          <h1 className="text-2xl font-bold text-cloth-deep">จัดการระบบและปฏิทินการศึกษา</h1>
          <p className="mt-1 max-w-[45ch] text-base text-ink-2">
            จัดการปีการศึกษา ภาคเรียน เย็บขอบล็อกคะแนนปิดเทอม ห้องเรียน มอบหมายงาน นำเข้ารายชื่อนักเรียน และสิทธิ์ครูผู้สอน
          </p>
        </header>

        <AdminConsoleClient
          years={years}
          semesters={semesterRows}
          classrooms={roomRows}
          staffList={staffRows}
          modules={moduleRows}
        />
      </main>
    </div>
  );
}
