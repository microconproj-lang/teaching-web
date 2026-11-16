import type { ModuleDefinition } from "@/core/modules/contract";
import { cyberDefenseM3Manifest } from "./manifest";
import { gradeCyberDefenseM3Submission } from "./grader";

export const cyberDefenseM3Module: ModuleDefinition = {
  manifest: cyberDefenseM3Manifest,
  loadPlayer: () => import("./Player"),
  gradeSubmission: gradeCyberDefenseM3Submission,
};
