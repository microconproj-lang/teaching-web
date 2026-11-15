import { sql } from "drizzle-orm";
import {
  bigserial,
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export type UserRole = "student" | "teacher" | "admin";
export type EnrollmentStatus = "active" | "transferred" | "inactive";
export type ModuleRuntimeType = "native" | "sandbox_iframe";
export type ChallengeDifficulty = "easy" | "medium" | "hard" | "boss";
export type ReviewFlag = "none" | "needs_review" | "verified" | "flagged";
export type XpSourceType = "challenge_clear" | "star_bonus" | "badge" | "teacher_bonus";
export type CoinSourceType =
  | "challenge_clear"
  | "lesson_exercise"
  | "adventure_chest"
  | "arena_match"
  | "teacher_gift"
  | "shop_purchase"
  | "starter_gift";
export type ShopItemCategory = "egg" | "food" | "habitat" | "theme" | "frame" | "effect";
export type PetRarity = "common" | "rare" | "epic" | "legendary";
export type ArenaMode = "ranked" | "duel" | "practice";

// ============================================================================
// 1. ผู้ใช้และสิทธิ์ (Users & Role Bootstrap)
// ============================================================================

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    googleSub: text("google_sub").unique(),
    email: text("email").notNull().unique(),
    fullName: text("full_name").notNull(),
    displayName: text("display_name"),
    avatarUrl: text("avatar_url"),
    avatarKey: text("avatar_key"), // ตัวละคร Avatar ที่นักเรียนเลือกเอง (ไม่ถูกเขียนทับตอน Login)
    equippedThemeKey: text("equipped_theme_key").notNull().default("navy-pro"),
    equippedFrameKey: text("equipped_frame_key").notNull().default("none"),
    equippedEffectKey: text("equipped_effect_key").notNull().default("confetti"),
    arenaAp: integer("arena_ap").notNull().default(1000),
    role: text("role").$type<UserRole>().notNull().default("student"),
    isActive: boolean("is_active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("users_email_domain_check", sql`${table.email} = LOWER(${table.email}) AND ${table.email} LIKE '%@pccpl.ac.th'`),
    check("users_role_check", sql`${table.role} IN ('student', 'teacher', 'admin')`),
  ]
);

export const staffAllowlist = pgTable(
  "staff_allowlist",
  {
    email: text("email").primaryKey(),
    assignedRole: text("assigned_role").$type<"teacher" | "admin">().notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("staff_email_domain_check", sql`${table.email} = LOWER(${table.email}) AND ${table.email} LIKE '%@pccpl.ac.th'`),
    check("staff_role_check", sql`${table.assignedRole} IN ('teacher', 'admin')`),
  ]
);

// ============================================================================
// 2. ปีการศึกษา ภาคเรียน และห้องเรียน (Academic Calendar & Classrooms)
// ============================================================================

export const academicYears = pgTable(
  "academic_years",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    yearBe: smallint("year_be").notNull().unique(),
    label: text("label").notNull(),
    startsOn: date("starts_on").notNull(),
    endsOn: date("ends_on").notNull(),
    isCurrent: boolean("is_current").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_academic_years_current").on(table.isCurrent).where(sql`${table.isCurrent} = TRUE`),
    check("academic_years_dates_check", sql`${table.endsOn} > ${table.startsOn}`),
  ]
);

export const semesters = pgTable(
  "semesters",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    academicYearId: uuid("academic_year_id")
      .notNull()
      .references(() => academicYears.id, { onDelete: "restrict" }),
    termNo: smallint("term_no").notNull(),
    label: text("label").notNull(),
    startsOn: date("starts_on").notNull(),
    endsOn: date("ends_on").notNull(),
    isCurrent: boolean("is_current").notNull().default(false),
    isLocked: boolean("is_locked").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_semesters_year_term").on(table.academicYearId, table.termNo),
    uniqueIndex("uq_semesters_current").on(table.isCurrent).where(sql`${table.isCurrent} = TRUE`),
    check("semesters_term_check", sql`${table.termNo} IN (1, 2, 3)`),
    check("semesters_dates_check", sql`${table.endsOn} > ${table.startsOn}`),
  ]
);

export const classrooms = pgTable(
  "classrooms",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    academicYearId: uuid("academic_year_id")
      .notNull()
      .references(() => academicYears.id, { onDelete: "restrict" }),
    gradeLevel: smallint("grade_level").notNull(),
    roomNo: smallint("room_no").notNull(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_classrooms_year_grade_room").on(table.academicYearId, table.gradeLevel, table.roomNo),
    check("classrooms_grade_check", sql`${table.gradeLevel} IN (1, 2, 3)`),
    check("classrooms_room_check", sql`${table.roomNo} > 0`),
  ]
);

export const classroomTeachers = pgTable(
  "classroom_teachers",
  {
    classroomId: uuid("classroom_id")
      .notNull()
      .references(() => classrooms.id, { onDelete: "cascade" }),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.classroomId, table.teacherId] })]
);

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    academicYearId: uuid("academic_year_id")
      .notNull()
      .references(() => academicYears.id, { onDelete: "restrict" }),
    classroomId: uuid("classroom_id")
      .notNull()
      .references(() => classrooms.id, { onDelete: "restrict" }),
    studentNumber: smallint("student_number").notNull(),
    status: text("status").$type<EnrollmentStatus>().notNull().default("active"),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_enrollments_student_year").on(table.studentId, table.academicYearId),
    uniqueIndex("uq_enrollments_room_number_active")
      .on(table.classroomId, table.studentNumber)
      .where(sql`${table.status} = 'active'`),
    index("idx_enrollments_classroom").on(table.classroomId, table.status),
    check("enrollments_number_check", sql`${table.studentNumber} > 0`),
    check("enrollments_status_check", sql`${table.status} IN ('active', 'transferred', 'inactive')`),
  ]
);

// ============================================================================
// 3. ระบบ Module & Challenge แบบขยายได้ (Pluggable Modules)
// ============================================================================

export const modules = pgTable(
  "modules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    moduleKey: text("module_key").notNull().unique(),
    version: text("version").notNull().default("1.0.0"),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    runtimeType: text("runtime_type").$type<ModuleRuntimeType>().notNull(),
    entryPath: text("entry_path").notNull(),
    targetGrades: smallint("target_grades").array().notNull().default(sql`'{1,2,3}'`),
    competencyTags: text("competency_tags").array().notNull().default(sql`'{}'`),
    manifest: jsonb("manifest").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    isEnabled: boolean("is_enabled").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("modules_runtime_check", sql`${table.runtimeType} IN ('native', 'sandbox_iframe')`)]
);

export const challenges = pgTable(
  "challenges",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    challengeKey: text("challenge_key").notNull(),
    title: text("title").notNull(),
    orderIndex: integer("order_index").notNull().default(0),
    difficulty: text("difficulty").$type<ChallengeDifficulty>().notNull().default("easy"),
    maxScore: numeric("max_score", { precision: 6, scale: 2 }).notNull().default("100"),
    xpReward: integer("xp_reward").notNull().default(50),
    config: jsonb("config").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    solutionCheck: jsonb("solution_check").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    isPublished: boolean("is_published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_challenges_module_key").on(table.moduleId, table.challengeKey),
    index("idx_challenges_module_order").on(table.moduleId, table.orderIndex),
    check("challenges_difficulty_check", sql`${table.difficulty} IN ('easy', 'medium', 'hard', 'boss')`),
  ]
);

export const moduleAssignments = pgTable(
  "module_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    semesterId: uuid("semester_id")
      .notNull()
      .references(() => semesters.id, { onDelete: "restrict" }),
    classroomId: uuid("classroom_id")
      .notNull()
      .references(() => classrooms.id, { onDelete: "cascade" }),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "restrict" }),
    titleOverride: text("title_override"),
    weightPercent: numeric("weight_percent", { precision: 5, scale: 2 }).notNull().default("0"),
    opensAt: timestamp("opens_at", { withTimezone: true }),
    dueAt: timestamp("due_at", { withTimezone: true }),
    isPublished: boolean("is_published").notNull().default(false),
    focusMode: boolean("focus_mode").notNull().default(false),
    disablePaste: boolean("disable_paste").notNull().default(false),
    pinCodeHash: text("pin_code_hash"),
    settings: jsonb("settings").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_assignments_semester_room_module").on(table.semesterId, table.classroomId, table.moduleId),
    index("idx_assignments_semester_room").on(table.semesterId, table.classroomId),
  ]
);

// ============================================================================
// 4. การส่งงาน คะแนนรายบุคคล และ Process Telemetry
// ============================================================================

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    assignmentId: uuid("assignment_id")
      .notNull()
      .references(() => moduleAssignments.id, { onDelete: "cascade" }),
    challengeId: uuid("challenge_id")
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    attemptNo: integer("attempt_no").notNull(),
    score: numeric("score", { precision: 6, scale: 2 }).notNull().default("0"),
    maxScore: numeric("max_score", { precision: 6, scale: 2 }).notNull().default("100"),
    stars: smallint("stars").notNull().default(0),
    passed: boolean("passed").notNull().default(false),
    evidence: jsonb("evidence").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    reviewFlag: text("review_flag").$type<ReviewFlag>().notNull().default("none"),
    teacherNote: text("teacher_note"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_submissions_attempt").on(table.assignmentId, table.challengeId, table.studentId, table.attemptNo),
    index("idx_submissions_lookup").on(table.assignmentId, table.studentId, table.challengeId, table.submittedAt),
    index("idx_submissions_review_flag").on(table.assignmentId, table.reviewFlag).where(sql`${table.reviewFlag} <> 'none'`),
    check("submissions_stars_check", sql`${table.stars} BETWEEN 0 AND 3`),
    check("submissions_review_check", sql`${table.reviewFlag} IN ('none', 'needs_review', 'verified', 'flagged')`),
  ]
);

export const studentChallengeProgress = pgTable(
  "student_challenge_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    assignmentId: uuid("assignment_id")
      .notNull()
      .references(() => moduleAssignments.id, { onDelete: "cascade" }),
    challengeId: uuid("challenge_id")
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bestScore: numeric("best_score", { precision: 6, scale: 2 }).notNull().default("0"),
    bestStars: smallint("best_stars").notNull().default(0),
    passed: boolean("passed").notNull().default(false),
    attemptsCount: integer("attempts_count").notNull().default(0),
    hasReviewFlag: boolean("has_review_flag").notNull().default(false),
    bestSubmissionId: uuid("best_submission_id").references(() => submissions.id, { onDelete: "set null" }),
    firstPassedAt: timestamp("first_passed_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_progress_assignment_challenge_student").on(table.assignmentId, table.challengeId, table.studentId),
    index("idx_progress_heatmap").on(table.assignmentId, table.studentId),
  ]
);

export const studentModuleStates = pgTable(
  "student_module_states",
  {
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    assignmentId: uuid("assignment_id")
      .notNull()
      .references(() => moduleAssignments.id, { onDelete: "cascade" }),
    state: jsonb("state").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.studentId, table.assignmentId] })]
);

// ============================================================================
// 5. Gamification & Audit
// ============================================================================

export const xpLedger = pgTable(
  "xp_ledger",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    semesterId: uuid("semester_id")
      .notNull()
      .references(() => semesters.id, { onDelete: "cascade" }),
    sourceType: text("source_type").$type<XpSourceType>().notNull(),
    sourceId: uuid("source_id"),
    xpAmount: integer("xp_amount").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("idx_xp_ledger_student_semester").on(table.studentId, table.semesterId)]
);

export const badges = pgTable("badges", {
  id: uuid("id").defaultRandom().primaryKey(),
  badgeKey: text("badge_key").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconPath: text("icon_path").notNull(),
  criteria: jsonb("criteria").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const studentBadges = pgTable(
  "student_badges",
  {
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    badgeId: uuid("badge_id")
      .notNull()
      .references(() => badges.id, { onDelete: "cascade" }),
    semesterId: uuid("semester_id")
      .notNull()
      .references(() => semesters.id, { onDelete: "cascade" }),
    awardedAt: timestamp("awarded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.studentId, table.badgeId, table.semesterId] })]
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("idx_audit_logs_created_at").on(table.createdAt)]
);

// ============================================================================
// 7. เศรษฐกิจ Coins, ร้านค้าของตกแต่ง, สัตว์เลี้ยง, Coding Lab, Slides & Code Arena
// ============================================================================

export const coinLedger = pgTable(
  "coin_ledger",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sourceType: text("source_type").$type<CoinSourceType>().notNull(),
    refKey: text("ref_key"),
    amount: integer("amount").notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("idx_coin_ledger_student").on(table.studentId, table.createdAt)]
);

export const studentInventory = pgTable(
  "student_inventory",
  {
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemKey: text("item_key").notNull(),
    category: text("category").$type<ShopItemCategory>().notNull(),
    quantity: integer("quantity").notNull().default(1),
    purchasedAt: timestamp("purchased_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.studentId, table.itemKey] })]
);

export const studentPets = pgTable(
  "student_pets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    speciesKey: text("species_key").notNull(),
    nickname: text("nickname").notNull(),
    rarity: text("rarity").$type<PetRarity>().notNull().default("common"),
    growthXp: integer("growth_xp").notNull().default(0),
    hunger: smallint("hunger").notNull().default(80),
    closeness: smallint("closeness").notNull().default(40),
    trait: text("trait").notNull().default("อยากรู้อยากเห็น"),
    habitatKey: text("habitat_key").notNull().default("habitat-desk"),
    isActive: boolean("is_active").notNull().default(true),
    hatchedAt: timestamp("hatched_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("idx_student_pets_student").on(table.studentId)]
);

export const labFiles = pgTable(
  "lab_files",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    language: text("language").notNull().default("python"),
    code: text("code").notNull().default(""),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("idx_lab_files_student").on(table.studentId, table.updatedAt)]
);

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonKey: text("lesson_key").notNull(),
    lastSlide: integer("last_slide").notNull().default(0),
    completedCheckKeys: jsonb("completed_check_keys").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.studentId, table.lessonKey] })]
);

export const arenaMatches = pgTable(
  "arena_matches",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    problemKey: text("problem_key").notNull(),
    mode: text("mode").$type<ArenaMode>().notNull().default("ranked"),
    score: integer("score").notNull().default(0),
    apDelta: integer("ap_delta").notNull().default(0),
    durationSec: integer("duration_sec").notNull().default(0),
    passed: boolean("passed").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("idx_arena_matches_student").on(table.studentId, table.createdAt)]
);

