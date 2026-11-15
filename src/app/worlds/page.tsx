import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { ArrowRight, BookOpen, Compass, Layers, Lock, Play, Sparkles } from "lucide-react";
import { db, isDatabaseReachable } from "@/core/db";
import { moduleAssignments, modules, semesters } from "@/core/db/schema";
import { WORLD_MANIFESTS } from "@/core/config/worlds";
import { ServerAppShell } from "@/core/components/ServerAppShell";

export const dynamic = "force-dynamic";

const WORLD_HEADER_GRADIENTS: Record<string, string> = {
  "world-1": "from-[#0E4EC7] to-[#227FF5]",
  "world-2": "from-[#6D28D9] to-[#8B5CF6]",
  "world-3": "from-[#047857] to-[#10B981]",
  "world-4": "from-[#092551] to-[#1364E7]",
  "world-5": "from-[#064E3B] to-[#059669]",
};

export default async function WorldsPage() {
  const liveByModuleKey = new Map<string, string>();

  try {
    if (await isDatabaseReachable()) {
      const [sem] = await db
        .select({ id: semesters.id })
        .from(semesters)
        .where(eq(semesters.isCurrent, true))
        .limit(1);

      if (sem) {
        const rows = await db
          .select({
            assignmentId: moduleAssignments.id,
            moduleKey: modules.moduleKey,
          })
          .from(moduleAssignments)
          .innerJoin(modules, eq(moduleAssignments.moduleId, modules.id))
          .where(and(eq(moduleAssignments.semesterId, sem.id), eq(moduleAssignments.isPublished, true)));

        for (const r of rows) {
          if (!liveByModuleKey.has(r.moduleKey)) {
            liveByModuleKey.set(r.moduleKey, r.assignmentId);
          }
        }
      }
    }
  } catch {
    // Graceful offline preview
  }

  return (
    <ServerAppShell activePath="courses">
      <div className="space-y-6">
        <div className="ed-hero flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#1364E7]">
              <Layers className="h-3.5 w-3.5" />
              <span>ภารกิจเชิงโต้ตอบและมินิเกมจัดลำดับ (Worlds)</span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold text-[#092551] sm:text-3xl">
              แผนที่โลกการเรียนรู้ทั้ง 3 ระดับชั้น
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-[#5C7299]">
              ฝึกจัดลำดับตรรกะกับ Algo Quest และเชื่อมต่อไปยังบทเรียน Python Interactive Slides และ Coding Lab
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link href="/courses" className="ed-btn-secondary text-sm">
              <BookOpen className="h-4 w-4 text-[#1364E7]" />
              <span>หลักสูตร ม.1–ม.3</span>
            </Link>
            <Link href="/adventure" className="ed-btn-primary text-sm">
              <Compass className="h-4 w-4" />
              <span>แผนที่ผจญภัย</span>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {WORLD_MANIFESTS.map((world) => {
            const matchedAssignmentId = world.moduleKeys
              .map((k) => liveByModuleKey.get(k))
              .find(Boolean);
            const launchHref = matchedAssignmentId
              ? `/learn/${matchedAssignmentId}`
              : world.key === "world-1"
                ? "/learn/demo"
                : world.key === "world-4"
                  ? "/learn/demo?module=iot-se-m3"
                  : world.key === "world-5"
                    ? "/learn/demo?module=microbit-m1"
                    : null;
            const headerGrad =
              WORLD_HEADER_GRADIENTS[world.key] ?? "from-[#0E4EC7] to-[#227FF5]";

            return (
              <section key={world.key} className="ed-card overflow-hidden">
                <div className={`bg-gradient-to-r ${headerGrad} p-5 text-white sm:p-6`}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold">
                        <Sparkles className="h-3 w-3" />
                        <span>WORLD {world.order}</span>
                      </div>
                      <h2 className="mt-1.5 font-display text-xl font-bold sm:text-2xl">
                        {world.title}
                      </h2>
                      <p className="mt-1 max-w-2xl text-sm text-white/90">{world.subtitle}</p>
                    </div>

                    {launchHref ? (
                      <Link href={launchHref} className="btn-notch-inverse text-sm">
                        <Play className="h-4 w-4 fill-current text-[#1364E7]" />
                        <span>เข้าทำด่านในโลกนี้</span>
                      </Link>
                    ) : (
                      <Link href="/adventure" className="btn-notch-inverse text-sm">
                        <span>เรียนต่อในแผนที่ผจญภัย</span>
                        <ArrowRight className="h-4 w-4 text-[#1364E7]" />
                      </Link>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
                  {world.stages.map((st) => (
                    <div
                      key={st.stageCode}
                      className="rounded-2xl border border-[#E1EAFB] bg-[#F8FAFF] p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-lg bg-white px-2.5 py-0.5 text-xs font-bold text-[#1364E7] ring-1 ring-[#D4E2FA]">
                          {st.stageCode}
                        </span>
                        {!launchHref && <Lock className="h-3.5 w-3.5 text-[#7485A4]" />}
                      </div>
                      <div className="mt-2 font-display text-sm font-bold text-[#092551]">
                        {st.title}
                      </div>
                      <div className="mt-1 text-xs text-[#5C7299]">{st.topicTag}</div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </ServerAppShell>
  );
}
