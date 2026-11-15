import type { ModuleDefinition } from "@/core/modules/contract";
import { iotSeM3Manifest } from "./manifest";
import { gradeIotSeSubmission } from "./grader";

export const iotSeM3Module: ModuleDefinition = {
  manifest: iotSeM3Manifest,
  loadPlayer: () => import("./Player"),
  gradeSubmission: gradeIotSeSubmission,
};
