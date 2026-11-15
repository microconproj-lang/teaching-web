import type { ModuleDefinition } from "@/core/modules/contract";
import { microbitM1Manifest } from "./manifest";
import { gradeMicrobitM1Submission } from "./grader";

export const microbitM1Module: ModuleDefinition = {
  manifest: microbitM1Manifest,
  loadPlayer: () => import("./Player"),
  gradeSubmission: gradeMicrobitM1Submission,
};
