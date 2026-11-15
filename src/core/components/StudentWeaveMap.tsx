import Link from "next/link";
import { CheckCircle2, Lock, Play, Star } from "lucide-react";
import { WORLD_MANIFESTS, type WorldDefinition } from "@/core/config/worlds";

export interface LiveChallengeNode {
  id: string;
  challengeKey: string;
  title: string;
  orderIndex: number;
  passed: boolean;
  bestStars: 0 | 1 | 2 | 3;
}

export interface LiveModuleAssignmentView {
  assignmentId: string;
  moduleKey: string;
  title: string;
  dueAt: string | null;
  challenges: LiveChallengeNode[];
}

type StageNodeStatus = "locked" | "open" | "active" | "passed";

interface BuiltStage {
  stageCode: string;
  title: string;
  topicTag: string;
  status: StageNodeStatus;
  stars: 0 | 1 | 2 | 3;
  href: string | null;
}

function buildWorldStages(
  world: WorldDefinition,
  assignments: LiveModuleAssignmentView[]
): BuiltStage[] {
  const matching = assignments.filter((a) => world.moduleKeys.includes(a.moduleKey));

  if (matching.length > 0) {
    const primary = matching[0];
    const hasPassedPrev = (idx: number) =>
      idx === 0 || Boolean(primary.challenges[idx - 1]?.passed);

    const firstUnfinishedIdx = primary.challenges.findIndex((c) => !c.passed);
    const activeIdx =
      firstUnfinishedIdx !== -1 ? firstUnfinishedIdx : Math.max(0, primary.challenges.length - 1);

    return primary.challenges.map((ch, idx) => {
      let status: StageNodeStatus = "locked";
      if (ch.passed) {
        status = "passed";
      } else if (idx === activeIdx && hasPassedPrev(idx)) {
        status = "active";
      } else if (hasPassedPrev(idx)) {
        status = "open";
      }

      const stageCode = `${world.order}-${idx + 1}`;
      return {
        stageCode,
        title: ch.title,
        topicTag: world.stages[idx]?.topicTag ?? "ภารกิจฝึกทักษะ",
        status,
        stars: ch.bestStars,
        href:
          status === "locked"
            ? null
            : `/learn/${primary.assignmentId}?stage=${encodeURIComponent(ch.id)}`,
      };
    });
  }

  return world.stages.map((st, idx) => {
    const demoModuleKey =
      world.key === "world-1"
        ? "algo-quest-m1"
        : world.key === "world-4"
          ? "iot-se-m3"
          : world.key === "world-5"
            ? "microbit-m1"
            : null;
    const status: StageNodeStatus =
      demoModuleKey && idx === 0
        ? "active"
        : demoModuleKey
          ? "open"
          : "locked";

    const href = !demoModuleKey
      ? null
      : demoModuleKey === "algo-quest-m1"
        ? `/learn/demo?stage=${encodeURIComponent(st.challengeKey ?? "")}`
        : `/learn/demo?module=${encodeURIComponent(demoModuleKey)}&stage=${encodeURIComponent(st.challengeKey ?? "")}`;

    return {
      stageCode: st.stageCode,
      title: st.title,
      topicTag: st.topicTag,
      status,
      stars: 0,
      href,
    };
  });
}

const WORLD_ACCENT_GRADIENTS: Record<string, string> = {
  "world-1": "from-[#1364E7] to-[#227FF5]",
  "world-2": "from-[#7C3AED] to-[#A855F7]",
  "world-3": "from-[#059669] to-[#10B981]",
  "world-4": "from-[#092551] to-[#F0742E]",
  "world-5": "from-[#064E3B] to-[#059669]",
};

export function StudentWeaveMap({
  assignments,
}: {
  assignments: LiveModuleAssignmentView[];
}) {
  return (
    <div className="space-y-6">
      {WORLD_MANIFESTS.map((world) => {
        const stages = buildWorldStages(world, assignments);
        const passedCount = stages.filter((s) => s.status === "passed").length;
        const grad = WORLD_ACCENT_GRADIENTS[world.key] ?? "from-[#1364E7] to-[#227FF5]";

        return (
          <section
            key={world.key}
            aria-labelledby={`world-title-${world.key}`}
            className="ed-card overflow-hidden p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EBF2FE] pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${grad} text-sm font-bold text-white shadow-sm`}
                >
                  W{world.order}
                </div>
                <div>
                  <h2 id={`world-title-${world.key}`} className="font-display text-lg font-bold text-[#092551] sm:text-xl">
                    {world.title}
                  </h2>
                  <p className="text-sm text-[#5C7299]">{world.subtitle}</p>
                </div>
              </div>
              <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#1364E7]">
                ผ่านแล้ว {passedCount}/{stages.length} ด่าน
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stages.map((stage) => {
                if (stage.href) {
                  return (
                    <Link
                      key={stage.stageCode}
                      href={stage.href}
                      className={`group flex items-start gap-3.5 rounded-2xl border p-4 transition ${
                        stage.status === "active"
                          ? "border-[#1364E7] bg-[#EFF6FF]/70 shadow-sm hover:bg-[#EFF6FF]"
                          : stage.status === "passed"
                            ? "border-emerald-200 bg-emerald-50/40 hover:border-emerald-300 hover:bg-emerald-50"
                            : "border-[#E1EAFB] bg-[#F8FAFF] hover:border-[#9FC0F8] hover:bg-white"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                          stage.status === "passed"
                            ? "bg-emerald-500 text-white"
                            : stage.status === "active"
                              ? "bg-[#1364E7] text-white"
                              : "bg-white text-[#1364E7] ring-1 ring-[#D4E2FA]"
                        }`}
                      >
                        {stage.status === "passed" ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Play className="h-4 w-4 fill-current" />
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wide text-[#5C7299]">
                            ด่าน {stage.stageCode}
                          </span>
                          {stage.stars > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-amber-500">
                              {Array.from({ length: stage.stars }).map((_, i) => (
                                <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                              ))}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-0.5 line-clamp-1 font-display text-sm font-bold text-[#092551] group-hover:text-[#1364E7]">
                          {stage.title}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-xs text-[#5C7299]">{stage.topicTag}</p>
                      </div>
                    </Link>
                  );
                }

                return (
                  <div
                    key={stage.stageCode}
                    className="flex items-start gap-3.5 rounded-2xl border border-dashed border-[#D6E3FA] bg-[#F8FAFF]/60 p-4 opacity-75"
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EBF2FE] text-[#7485A4]">
                      <Lock className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-[#7485A4]">
                        ด่าน {stage.stageCode}
                      </span>
                      <h3 className="mt-0.5 line-clamp-1 font-display text-sm font-bold text-[#5C7299]">
                        {stage.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#7485A4]">
                        {world.key === "world-1"
                          ? "ผ่านด่านก่อนหน้าเพื่อปลดล็อก"
                          : "ดูเส้นทางบทเรียนเต็มในแผนที่ผจญภัย"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
