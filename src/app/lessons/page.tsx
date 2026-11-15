import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Layers, Sparkles } from "lucide-react";
import { INTERACTIVE_LESSONS, matchesCourseCode } from "@/core/config/curriculum";
import { ServerAppShell } from "@/core/components/ServerAppShell";

const COURSE_FILTER_TABS = [
  { key: "all", label: "ทั้งหมด" },
  { key: "ว21103", label: "ว21103 (ม.1)" },
  { key: "ว21202", label: "ว21202 micro:bit (ม.1)" },
  { key: "ว22103", label: "ว22103 (ม.2)" },
  { key: "ว23103", label: "ว23103 Cyber (ม.3)" },
  { key: "ว23202", label: "ว23202 IoT (ม.3)" },
];

export default async function LessonsIndexPage(props: {
  searchParams: Promise<{ grade?: string; course?: string }>;
}) {
  const { grade, course } = await props.searchParams;
  const activeCourse = course ?? "all";
  const visibleLessons = INTERACTIVE_LESSONS.filter((l) => {
    if (activeCourse !== "all") {
      return matchesCourseCode(l.courseCode ?? "", activeCourse);
    }
    if (grade === "1" || grade === "2" || grade === "3") {
      return l.gradeLevel === Number(grade);
    }
    return true;
  });

  return (
    <ServerAppShell activePath="lessons">
      <div className="space-y-6">
        <section className="ed-hero p-6 sm:p-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0A5FE6]">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>บทเรียนสไลด์ Interactive + Live Visualizers</span>
          </div>
          <h1 className="font-display mt-2 text-2xl font-semibold text-[#092551] sm:text-3xl">
            เรียนรู้แบบเห็นภาพและทดลองเล่นได้ทันที
          </h1>
          <p className="mt-1 max-w-[60ch] text-sm text-[#35517D]">
            รวมสไลด์อธิบายพร้อมเครื่องมือจำลองการทำงานทีละขั้น (String Slicing, 8-Bit Binary, Loop Trace,
            Caesar Cipher, MQTT Pub/Sub, MoSCoW, Pico GPIO, QA Bug Triage) และภารกิจเขียนโค้ดในหน้าเดียว
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {COURSE_FILTER_TABS.map((tab) => {
              const selected =
                tab.key === "all"
                  ? activeCourse === "all" && !grade
                  : matchesCourseCode(activeCourse, tab.key);
              return (
                <Link
                  key={tab.key}
                  href={tab.key === "all" ? "/lessons" : `/lessons?course=${encodeURIComponent(tab.key)}`}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                    selected
                      ? "bg-[#092551] text-white shadow-xs"
                      : "border border-[#D4E4FC] bg-white text-[#35517D] hover:border-[#1364E7]"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleLessons.map((lesson) => (
            <Link
              key={lesson.key}
              href={`/lessons/${lesson.key}`}
              className="ed-card ed-card-hover flex flex-col justify-between p-5"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`flex h-11 w-11 items-center justify-center text-white shadow-xs ${
                      lesson.iconBg === "amber"
                        ? "squircle-amber text-[#092551]"
                        : lesson.iconBg === "purple"
                          ? "squircle-purple"
                          : lesson.iconBg === "emerald"
                            ? "squircle-emerald"
                            : "squircle-blue"
                    }`}
                  >
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <div className="flex flex-wrap items-center justify-end gap-1.5">
                    {lesson.courseCode && (
                      <span className="rounded-full bg-[#092551] px-2.5 py-1 font-mono text-[11px] font-bold text-[#F0742E]">
                        {lesson.courseCode}
                      </span>
                    )}
                    <span className="rounded-full bg-[#F4F7FD] px-3 py-1 text-xs font-semibold text-[#0A5FE6]">
                      ม.{lesson.gradeLevel} · หน่วย {lesson.unitNo}
                    </span>
                    {lesson.blueprintSlides && lesson.blueprintSlides.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-800">
                        <Layers className="h-3 w-3" />
                        {lesson.blueprintSlides.length}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-lg font-semibold text-[#092551]">
                    {lesson.title}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-[#5C7299]">{lesson.subtitle}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#E1EAFB] pt-3.5 text-xs">
                <span className="inline-flex items-center gap-1 text-[#5C7299]">
                  <Clock className="h-3.5 w-3.5" />
                  {lesson.slides.length} สไลด์ · ~{lesson.durationMin} นาที
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#1364E7]">
                  เริ่มบทเรียน <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ServerAppShell>
  );
}

