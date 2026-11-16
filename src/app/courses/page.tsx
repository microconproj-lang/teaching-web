import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Code2, Compass, FileText, Sparkles } from "lucide-react";
import { ADVENTURE_ISLANDS, COURSES, INTERACTIVE_LESSONS, matchesCourseCode } from "@/core/config/curriculum";
import { ServerAppShell } from "@/core/components/ServerAppShell";

export default async function CoursesPage(props: {
  searchParams: Promise<{ grade?: string; course?: string }>;
}) {
  const { grade, course } = await props.searchParams;
  const selectedGrade = grade === "1" || grade === "2" || grade === "3" ? Number(grade) : 0;
  const selectedCourse = course ?? "";
  const filteredCourses = selectedCourse
    ? COURSES.filter(
        (c) => matchesCourseCode(c.code, selectedCourse) || c.slug === selectedCourse.toLowerCase()
      )
    : selectedGrade === 0
      ? COURSES
      : COURSES.filter((c) => c.gradeLevel === selectedGrade);

  return (
    <ServerAppShell activePath="courses">
      <div className="space-y-6">
        <section className="ed-hero p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0A5FE6]">
                <BookOpen className="h-3.5 w-3.5" />
                <span>หลักสูตรวิทยาการคำนวณ ม.1 – ม.3</span>
              </div>
              <h1 className="font-display text-2xl font-semibold text-[#092551] sm:text-3xl">
                รายวิชาและแผนการเรียนรู้ตามระดับชั้น
              </h1>
              <p className="max-w-[54ch] text-sm text-[#35517D]">
                เลือกระดับชั้นเพื่อเข้าสู่หน่วยการเรียนรู้ บทเรียนสไลด์ Interactive และภารกิจเขียนโค้ดจริง
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 rounded-xl border border-[#D4E4FC] bg-white p-1.5 shadow-xs">
              {[
                { key: "all", label: "ทุกรายวิชา", href: "/courses", active: selectedGrade === 0 && !selectedCourse },
                { key: "v21103", label: "ม.1 (ว21103)", href: "/courses?course=v21103", active: matchesCourseCode("ว21103", selectedCourse) },
                { key: "v21202", label: "ม.1 micro:bit (ว21202)", href: "/courses?course=v21202", active: matchesCourseCode("ว21202", selectedCourse) },
                { key: "v22103", label: "ม.2 (ว22103)", href: "/courses?course=v22103", active: matchesCourseCode("ว22103", selectedCourse) || selectedGrade === 2 },
                { key: "v23103", label: "ม.3 Cyber (ว23103)", href: "/courses?course=v23103", active: matchesCourseCode("ว23103", selectedCourse) },
                { key: "v23202", label: "ม.3 IoT (ว23202)", href: "/courses?course=v23202", active: matchesCourseCode("ว23202", selectedCourse) },
              ].map((tab) => (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                    tab.active
                      ? tab.key === "v23202"
                        ? "bg-[#092551] text-[#F0742E] shadow-xs"
                        : tab.key === "v21202"
                          ? "bg-[#065F46] text-emerald-200 shadow-xs"
                          : "bg-[#1364E7] text-white shadow-xs"
                      : "text-[#5C7299] hover:bg-[#F4F7FD] hover:text-[#092551]"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-6">
          {filteredCourses.map((course) => {
            const relatedIslands = ADVENTURE_ISLANDS.filter((i) =>
              i.courseCode ? matchesCourseCode(i.courseCode, course.code) : i.gradeLevel === course.gradeLevel
            );
            const isBlueprint = course.theme === "blueprint-navy";
            const isMicrobit = course.theme === "microbit-emerald";
            const isDark = course.theme === "dark-navy" || isBlueprint || isMicrobit;
            const courseParam = encodeURIComponent(course.slug ?? course.code);
            return (
              <section key={course.code} className="ed-card overflow-hidden">
                <div
                  className={`border-b px-6 py-5 ${
                    isBlueprint
                      ? "border-[#F0742E]/40 bg-gradient-to-r from-[#071B3D] via-[#092551] to-[#123A78] text-white"
                      : isMicrobit
                        ? "border-emerald-400/40 bg-gradient-to-r from-[#064E3B] via-[#065F46] to-[#047857] text-white"
                        : isDark
                          ? "border-[#224E8C] bg-gradient-to-r from-[#071B3D] to-[#0B387C] text-white"
                          : "border-[#E1EAFB] bg-[#F8FAFF] text-[#092551]"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                        <span
                          className={`rounded-full px-2.5 py-0.5 ${
                            isBlueprint
                              ? "bg-[#F0742E] text-white"
                              : isMicrobit
                                ? "bg-emerald-300 text-[#052E16]"
                                : isDark
                                  ? "bg-white/15 text-sky-200"
                                  : "bg-sky-100 text-sky-800"
                          }`}
                        >
                          {course.gradeLabel}
                        </span>
                        <span className="font-mono opacity-85">{course.code}</span>
                      </div>
                      <h2 className="font-display mt-1.5 text-xl font-semibold sm:text-2xl">
                        {course.title}
                      </h2>
                      <p
                        className={`mt-1 text-xs sm:text-sm ${
                          isDark ? "text-[#C2D2EE]" : "text-[#5C7299]"
                        }`}
                      >
                        {course.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/lab?course=${courseParam}`}
                        className={
                          isDark
                            ? "inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/25"
                            : "ed-btn-secondary !min-h-10 !px-3.5 !text-xs"
                        }
                      >
                        <Code2 className="h-4 w-4" />
                        <span>Coding Lab ({course.code})</span>
                      </Link>
                      {relatedIslands[0] && (
                        <Link
                          href={`/adventure?course=${courseParam}`}
                          className="ed-btn-primary !min-h-10 !px-4 !text-xs"
                        >
                          <Compass className="h-4 w-4" />
                          <span>ลุยด่านล่าสมบัติ</span>
                        </Link>
                      )}
                      {course.moduleKey === "algo-quest-m1" && (
                        <Link
                          href="/learn/demo"
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-[#092551] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#133A7A]"
                        >
                          <Sparkles className="h-4 w-4 text-amber-300" />
                          <span>ภารกิจ Algo & Tinkercad (4 ด่าน)</span>
                        </Link>
                      )}
                      {course.moduleKey === "iot-se-m3" && (
                        <Link
                          href="/learn/demo?module=iot-se-m3"
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-[#F0742E] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#D9611E]"
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>ภารกิจ IoT SE 9 หน่วย</span>
                        </Link>
                      )}
                      {course.moduleKey === "microbit-m1" && (
                        <Link
                          href="/learn/demo?module=microbit-m1"
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-emerald-400 px-4 py-2 text-xs font-bold text-[#052E16] shadow-xs hover:bg-emerald-300"
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>ภารกิจ micro:bit 13 หน่วย</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  {course.courseResources && course.courseResources.length > 0 && (
                    <div className="rounded-2xl border border-[#DCE7FA] bg-[#F4F7FD] p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#092551]">
                        <FileText className="h-4 w-4 text-[#1364E7]" />
                        <span>เอกสารหลักประจำรายวิชา ({course.code})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {course.courseResources.map((res) => (
                          <a
                            key={res.href}
                            href={res.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D4E4FC] bg-white px-3 py-1.5 text-xs font-semibold text-[#092551] hover:border-[#1364E7] hover:text-[#1364E7]"
                          >
                            <FileText className="h-3.5 w-3.5 text-[#F0742E]" />
                            <span>{res.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {course.units.map((unit) => {
                    const unitLessons = INTERACTIVE_LESSONS.filter((l) =>
                      unit.lessonKeys.includes(l.key)
                    );
                    return (
                      <div
                        key={unit.unitNo}
                        className="rounded-2xl border border-[#E1EAFB] bg-[#FBFCFF] p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="font-display text-base font-semibold text-[#092551]">
                                {unit.title}
                              </div>
                              {unit.weekRange && (
                                <span className="rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#1364E7]">
                                  {unit.weekRange}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-[#5C7299]">{unit.description}</p>
                            {unit.deliverable && (
                              <div className="mt-1.5 inline-block rounded-lg bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                                ผลงาน/เกณฑ์: {unit.deliverable}
                              </div>
                            )}
                          </div>
                          {unit.status === "active" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              เปิดเรียนแล้ว
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              <Clock className="h-3.5 w-3.5" />
                              เร็วๆ นี้
                            </span>
                          )}
                        </div>

                        {unitLessons.length > 0 && (
                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {unitLessons.map((lesson) => (
                              <Link
                                key={lesson.key}
                                href={`/lessons/${lesson.key}`}
                                className="ed-card ed-card-hover flex items-center justify-between gap-3 p-4"
                              >
                                <div className="flex items-start gap-3">
                                  <span
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center text-white shadow-xs ${
                                      lesson.iconBg === "amber"
                                        ? "squircle-amber text-[#092551]"
                                        : lesson.iconBg === "purple"
                                          ? "squircle-purple"
                                          : lesson.iconBg === "emerald"
                                            ? "squircle-emerald"
                                            : "squircle-blue"
                                    }`}
                                  >
                                    <Sparkles className="h-4 w-4" />
                                  </span>
                                  <div>
                                    <div className="font-display text-sm font-semibold text-[#092551]">
                                      {lesson.title}
                                    </div>
                                    <div className="mt-0.5 text-xs text-[#5C7299]">
                                      {lesson.slides.length} สไลด์ · ประมาณ {lesson.durationMin} นาที
                                    </div>
                                  </div>
                                </div>
                                <ArrowRight className="h-4 w-4 shrink-0 text-[#1364E7]" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </ServerAppShell>
  );
}

