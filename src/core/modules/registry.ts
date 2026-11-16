import type { ModuleDefinition } from "@/core/modules/contract";
import { algoQuestManifest } from "@/modules/algo-quest-m1/manifest";
import { gradeAlgoQuestSubmission } from "@/modules/algo-quest-m1/grader";
import { cyberDefenseM3Module } from "@/modules/cyber-defense-m3";
import { iotSeM3Module } from "@/modules/iot-se-m3";
import { microbitM1Module } from "@/modules/microbit-m1";
import type { WorldDefinition } from "@/core/config/worlds";

const algoQuestDefinition: ModuleDefinition = {
  manifest: algoQuestManifest,
  loadPlayer: () => import("@/modules/algo-quest-m1/Player"),
  gradeSubmission: gradeAlgoQuestSubmission,
};

/**
 * ศูนย์กลางลงทะเบียน Module ทั้งหมดของแพลตฟอร์ม
 * เมื่อเพิ่ม Module ใหม่ใน src/modules/ ให้นำมาเพิ่มใน Registry นี้
 */
export const MODULE_REGISTRY: Record<string, ModuleDefinition> = {
  [algoQuestManifest.moduleKey]: algoQuestDefinition,
  [cyberDefenseM3Module.manifest.moduleKey]: cyberDefenseM3Module,
  [iotSeM3Module.manifest.moduleKey]: iotSeM3Module,
  [microbitM1Module.manifest.moduleKey]: microbitM1Module,
};

export function getRegisteredModule(moduleKey: string): ModuleDefinition | null {
  return MODULE_REGISTRY[moduleKey] ?? null;
}

export function getDemoModuleKeyForWorld(world: WorldDefinition): string | null {
  return world.moduleKeys.find((k) => Boolean(MODULE_REGISTRY[k])) ?? null;
}

export function buildDemoHrefForWorld(world: WorldDefinition, stageChallengeKey?: string): string | null {
  const modKey = getDemoModuleKeyForWorld(world);
  if (!modKey) return null;
  const params = new URLSearchParams();
  if (modKey !== "algo-quest-m1") params.set("module", modKey);
  if (stageChallengeKey) params.set("stage", stageChallengeKey);
  const qs = params.toString();
  return qs ? `/learn/demo?${qs}` : "/learn/demo";
}

export function listRegisteredModules(): ModuleDefinition[] {
  return Object.values(MODULE_REGISTRY);
}

