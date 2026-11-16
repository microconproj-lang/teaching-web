import type { PythonTestCase } from "@/core/python/runner";

export type VisualizerType =
  | "queue-stepper"
  | "binary-bits"
  | "string-slicing"
  | "loop-list"
  | "caesar-cipher"
  | "phishing-inspector"
  | "mqtt-pubsub"
  | "moscow-backlog"
  | "pico-gpio"
  | "testing-triage"
  | "microbit-coords"
  | "radio-channel"
  | "array-sort"
  | "accel-gesture"
  | "tinkercad-circuit"
  | "data-cleansing";

export interface LessonResourceDef {
  label: string;
  kind: "knowledge" | "worksheet" | "slides" | "guide";
  href: string;
}

export interface BlueprintSlideDef {
  src: string;
  title?: string;
}

export interface CourseUnitDef {
  unitNo: number;
  title: string;
  description: string;
  status: "active" | "coming_soon";
  lessonKeys: string[];
  weekRange?: string;
  deliverable?: string;
}

export interface CourseDef {
  code: string;
  slug?: string;
  gradeLevel: 1 | 2 | 3;
  gradeLabel: string;
  title: string;
  subtitle: string;
  semesterLabel: string;
  status: "active" | "beta" | "coming_soon";
  theme: "white-azure" | "dark-navy" | "teal-shield" | "blueprint-navy" | "microbit-emerald";
  tags: string[];
  moduleKey: string;
  stats: {
    lessonsCount: number;
    exercisesCount: number;
    missionsCount: number;
    slidesCount: number;
  };
  courseResources?: LessonResourceDef[];
  units: CourseUnitDef[];
}

export interface LessonSlide {
  id: string;
  kind: "concept" | "visualizer" | "quiz" | "mission";
  title: string;
  subtitle?: string;
  body: string[];
  imageUrl?: string;
  imageCaption?: string;
  codeSnippet?: string;
  callout?: string;
  visualizerType?: VisualizerType;
  quiz?: {
    checkKey: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    coinReward: number;
  };
  mission?: {
    checkKey: string;
    filename: string;
    prompt: string;
    starterCode: string;
    hints: string[];
    testCases: PythonTestCase[];
    coinReward: number;
    xpReward: number;
  };
}

export interface InteractiveLessonDef {
  key: string;
  courseCode?: string;
  gradeLevel: 1 | 2 | 3;
  unitNo: number;
  title: string;
  subtitle: string;
  durationMin: number;
  iconBg: "blue" | "amber" | "purple" | "emerald";
  blueprintSlides?: BlueprintSlideDef[];
  resources?: LessonResourceDef[];
  slides: LessonSlide[];
}

export interface LabProblemDef {
  key: string;
  courseCode?: string;
  gradeLevel: 1 | 2 | 3;
  title: string;
  difficulty: "ง่าย" | "ปานกลาง" | "ท้าทาย";
  topic: string;
  description: string;
  filename: string;
  starterCode: string;
  hint: string;
  coinReward: number;
  testCases: PythonTestCase[];
}

export interface AdventureStageDef {
  key: string;
  code: string;
  title: string;
  topicTag: string;
  difficulty: "easy" | "medium" | "hard" | "boss";
  coinReward: number;
  xpReward: number;
  prompt: string;
  starterCode: string;
  hint: string;
  testCases: PythonTestCase[];
}

export interface AdventureIslandDef {
  key: string;
  courseCode?: string;
  order: number;
  gradeLevel: 1 | 2 | 3;
  name: string;
  subtitle: string;
  requiredLessonKey?: string;
  chestCoins: number;
  accentGradient: string;
  stages: AdventureStageDef[];
}

export interface ArenaProblemDef {
  key: string;
  courseCode?: string;
  title: string;
  gradeLevel: 1 | 2 | 3;
  difficulty: "Bronze" | "Silver" | "Gold";
  timeLimitSec: number;
  apRewardWin: number;
  coinReward: number;
  prompt: string;
  starterCode: string;
  testCases: PythonTestCase[];
}

/**
 * แปลงรหัสวิชาทั้งแบบ URL slug (`v23202`) และรหัสไทย (`ว23202`) ให้เทียบกันได้ตรง
 */
export function normalizeCourseCode(raw?: string | null): string {
  if (!raw) return "";
  const cleaned = raw.trim().toLowerCase();
  if (!cleaned || cleaned === "all") return "";
  return cleaned.replace(/^ว/, "v");
}

export function matchesCourseCode(
  itemCourseCode: string | undefined,
  filterParam: string | undefined | null
): boolean {
  const target = normalizeCourseCode(filterParam);
  if (!target) return true;
  return normalizeCourseCode(itemCourseCode) === target;
}
