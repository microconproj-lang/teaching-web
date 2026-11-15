-- ============================================================================
-- Teaching Web (ม.1 - ม.3) — PostgreSQL 16/17 Database Schema
-- ออกแบบสำหรับ:
--   1. Google Workspace Auth (@pccpl.ac.th) + RBAC
--   2. จัดการปีการศึกษา / ภาคเรียน / ห้องเรียน / การเลื่อนชั้น
--   3. ระบบ Module & Challenge แบบขยายได้ด้วย JSONB (Pluggable Modules)
--   4. ติดตามคะแนนรายบุคคล, Class Heatmap, Process Telemetry (กัน Copy/AI)
--   5. Gamification (XP, Stars, Badges)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ผู้ใช้และสิทธิ์ (Users & Role Bootstrap)
-- ----------------------------------------------------------------------------

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_sub      TEXT UNIQUE,                                -- Google OIDC subject ID (ตัวตนถาวร)
    email           TEXT NOT NULL UNIQUE
                    CHECK (email = LOWER(email) AND email LIKE '%@pccpl.ac.th'),
    full_name       TEXT NOT NULL,
    display_name    TEXT,                                       -- ชื่อเล่น/ชื่อแสดงบน Leaderboard
    avatar_url      TEXT,
    avatar_key      TEXT,                                       -- ตัวละคร Avatar ที่นักเรียนเลือกเอง
    equipped_theme_key TEXT NOT NULL DEFAULT 'navy-pro',
    equipped_frame_key TEXT NOT NULL DEFAULT 'none',
    equipped_effect_key TEXT NOT NULL DEFAULT 'confetti',
    arena_ap        INT NOT NULL DEFAULT 1000,
    role            TEXT NOT NULL DEFAULT 'student'
                    CHECK (role IN ('student', 'teacher', 'admin')),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- รายชื่ออีเมลครู/แอดมินที่อนุญาตล่วงหน้า เพื่อกำหนด Role อัตโนมัติเมื่อ Login ครั้งแรก
CREATE TABLE staff_allowlist (
    email           TEXT PRIMARY KEY
                    CHECK (email = LOWER(email) AND email LIKE '%@pccpl.ac.th'),
    assigned_role   TEXT NOT NULL CHECK (assigned_role IN ('teacher', 'admin')),
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. ปีการศึกษา ภาคเรียน และห้องเรียน (Academic Calendar & Classrooms)
-- ----------------------------------------------------------------------------

CREATE TABLE academic_years (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_be         SMALLINT NOT NULL UNIQUE,                   -- เช่น 2569, 2570
    label           TEXT NOT NULL,                              -- เช่น 'ปีการศึกษา 2569'
    starts_on       DATE NOT NULL,
    ends_on         DATE NOT NULL,
    is_current      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (ends_on > starts_on)
);

-- บังคับให้มีปีการศึกษาปัจจุบันได้ไม่เกิน 1 ปี
CREATE UNIQUE INDEX uq_academic_years_current
    ON academic_years (is_current)
    WHERE is_current = TRUE;

CREATE TABLE semesters (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year_id    UUID NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
    term_no             SMALLINT NOT NULL CHECK (term_no IN (1, 2, 3)), -- 1=เทอม 1, 2=เทอม 2, 3=ฤดูร้อน
    label               TEXT NOT NULL,                          -- เช่น 'ภาคเรียนที่ 1/2569'
    starts_on           DATE NOT NULL,
    ends_on             DATE NOT NULL,
    is_current          BOOLEAN NOT NULL DEFAULT FALSE,
    is_locked           BOOLEAN NOT NULL DEFAULT FALSE,         -- ล็อกคะแนนเมื่อปิดภาคเรียน (Archive Mode)
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (academic_year_id, term_no),
    CHECK (ends_on > starts_on)
);

-- บังคับให้มีภาคเรียนปัจจุบันได้ไม่เกิน 1 ภาคเรียน
CREATE UNIQUE INDEX uq_semesters_current
    ON semesters (is_current)
    WHERE is_current = TRUE;

CREATE TABLE classrooms (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year_id    UUID NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
    grade_level         SMALLINT NOT NULL CHECK (grade_level IN (1, 2, 3)), -- 1=ม.1, 2=ม.2, 3=ม.3
    room_no             SMALLINT NOT NULL CHECK (room_no > 0),
    name                TEXT NOT NULL,                          -- เช่น 'ม.1/1'
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (academic_year_id, grade_level, room_no)
);

-- ครูผู้รับผิดชอบแต่ละห้องเรียน (1 ห้องมีครูได้หลายคน / 1 ครูสอนได้หลายห้อง)
CREATE TABLE classroom_teachers (
    classroom_id    UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    teacher_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (classroom_id, teacher_id)
);

-- การลงทะเบียนนักเรียนรายปี (แยกตัวตนถาวรออกจากห้องเรียนแต่ละปี เพื่อรองรับการเลื่อนชั้น)
CREATE TABLE enrollments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    academic_year_id    UUID NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
    classroom_id        UUID NOT NULL REFERENCES classrooms(id) ON DELETE RESTRICT,
    student_number      SMALLINT NOT NULL CHECK (student_number > 0), -- เลขที่ในห้อง (ใช้เรียงตอน Export ปพ.5)
    status              TEXT NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'transferred', 'inactive')),
    enrolled_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, academic_year_id)
);

-- ใน 1 ห้อง เลขที่ของนักเรียนที่สถานะ active ห้ามซ้ำกัน
CREATE UNIQUE INDEX uq_enrollments_room_number_active
    ON enrollments (classroom_id, student_number)
    WHERE status = 'active';

CREATE INDEX idx_enrollments_classroom ON enrollments (classroom_id, status);

-- ----------------------------------------------------------------------------
-- 3. ระบบ Module & Challenge แบบขยายได้ (Pluggable Modules)
-- ----------------------------------------------------------------------------

CREATE TABLE modules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_key      TEXT NOT NULL UNIQUE,                       -- เช่น 'python-m1-basics', 'logic-gate-lab'
    version         TEXT NOT NULL DEFAULT '1.0.0',
    title           TEXT NOT NULL,
    description     TEXT NOT NULL DEFAULT '',
    runtime_type    TEXT NOT NULL CHECK (runtime_type IN ('native', 'sandbox_iframe')),
    entry_path      TEXT NOT NULL,                              -- เส้นทาง Component หรือ HTML5 game URL
    target_grades   SMALLINT[] NOT NULL DEFAULT '{1,2,3}',      -- เช่น '{1}' หรือ '{1,2}'
    competency_tags TEXT[] NOT NULL DEFAULT '{}',               -- เช่น '{"ว 4.2 ม.1/1", "Algorithm"}'
    manifest        JSONB NOT NULL DEFAULT '{}'::JSONB,         -- Metadata เพิ่มเติมของ Module
    is_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE challenges (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id       UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    challenge_key   TEXT NOT NULL,                              -- เช่น 'level-01-loop-maze'
    title           TEXT NOT NULL,
    order_index     INT NOT NULL DEFAULT 0,
    difficulty      TEXT NOT NULL DEFAULT 'easy'
                    CHECK (difficulty IN ('easy', 'medium', 'hard', 'boss')),
    max_score       NUMERIC(6, 2) NOT NULL DEFAULT 100 CHECK (max_score > 0),
    xp_reward       INT NOT NULL DEFAULT 50 CHECK (xp_reward >= 0),
    -- config: เก็บโจทย์, แผนที่เกม, AST constraints, ข้อความ Hint, Template คำถาม Micro-Question
    config          JSONB NOT NULL DEFAULT '{}'::JSONB,
    -- solution_check: เก็บ Test Case ลับ / เฉลยฝั่ง Server (ห้ามส่งให้ Browser นักเรียน!)
    solution_check  JSONB NOT NULL DEFAULT '{}'::JSONB,
    is_published    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (module_id, challenge_key)
);

CREATE INDEX idx_challenges_module_order ON challenges (module_id, order_index);

-- การมอบหมาย Module ให้ห้องเรียนในแต่ละภาคเรียน
CREATE TABLE module_assignments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_id     UUID NOT NULL REFERENCES semesters(id) ON DELETE RESTRICT,
    classroom_id    UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    module_id       UUID NOT NULL REFERENCES modules(id) ON DELETE RESTRICT,
    title_override  TEXT,
    weight_percent  NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (weight_percent >= 0 AND weight_percent <= 100),
    opens_at        TIMESTAMPTZ,
    due_at          TIMESTAMPTZ,
    is_published    BOOLEAN NOT NULL DEFAULT FALSE,
    -- โหมดสอบ / ควบคุมในคาบเรียน (Classroom Focus Mode)
    focus_mode      BOOLEAN NOT NULL DEFAULT FALSE,
    disable_paste   BOOLEAN NOT NULL DEFAULT FALSE,
    pin_code_hash   TEXT,                                       -- Hash ของ PIN ประจำคาบ (ถ้าเปิดใช้)
    settings        JSONB NOT NULL DEFAULT '{}'::JSONB,         -- เช่น เปิด/ปิด Hint, จำกัดจำนวนครั้ง
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (semester_id, classroom_id, module_id)
);

CREATE INDEX idx_assignments_semester_room ON module_assignments (semester_id, classroom_id);

-- ----------------------------------------------------------------------------
-- 4. การส่งงาน คะแนนรายบุคคล และหลักฐานกระบวนการทำ (Submissions & Telemetry)
-- ----------------------------------------------------------------------------

CREATE TABLE submissions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id       UUID NOT NULL REFERENCES module_assignments(id) ON DELETE CASCADE,
    challenge_id        UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    student_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attempt_no          INT NOT NULL CHECK (attempt_no > 0),
    score               NUMERIC(6, 2) NOT NULL DEFAULT 0 CHECK (score >= 0),
    max_score           NUMERIC(6, 2) NOT NULL DEFAULT 100 CHECK (max_score > 0),
    stars               SMALLINT NOT NULL DEFAULT 0 CHECK (stars BETWEEN 0 AND 3),
    passed              BOOLEAN NOT NULL DEFAULT FALSE,
    -- evidence (JSONB) เก็บเฉพาะโครงสร้างของแต่ละ Module + Process Telemetry เช่น:
    -- {
    --   "code": "...",
    --   "snapshots": [{"t": 12, "code": "..."}],
    --   "telemetry": {
    --     "keystrokes": 145, "paste_chars": 0, "tab_switches": 1,
    --     "duration_sec": 94, "hints_used": 1
    --   },
    --   "micro_check": {"question": "...", "answered_correct": true}
    -- }
    evidence            JSONB NOT NULL DEFAULT '{}'::JSONB,
    review_flag         TEXT NOT NULL DEFAULT 'none'
                        CHECK (review_flag IN ('none', 'needs_review', 'verified', 'flagged')),
    teacher_note        TEXT,
    submitted_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (assignment_id, challenge_id, student_id, attempt_no)
);

CREATE INDEX idx_submissions_lookup
    ON submissions (assignment_id, student_id, challenge_id, submitted_at DESC);
CREATE INDEX idx_submissions_review_flag
    ON submissions (assignment_id, review_flag)
    WHERE review_flag <> 'none';

-- ตารางสรุปคะแนนที่ดีที่สุดต่อด่าน (ช่วยให้ Class Heatmap & Gradebook ดึงข้อมูลได้ทันที)
CREATE TABLE student_challenge_progress (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id       UUID NOT NULL REFERENCES module_assignments(id) ON DELETE CASCADE,
    challenge_id        UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    student_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    best_score          NUMERIC(6, 2) NOT NULL DEFAULT 0,
    best_stars          SMALLINT NOT NULL DEFAULT 0 CHECK (best_stars BETWEEN 0 AND 3),
    passed              BOOLEAN NOT NULL DEFAULT FALSE,
    attempts_count      INT NOT NULL DEFAULT 0,
    has_review_flag     BOOLEAN NOT NULL DEFAULT FALSE,
    best_submission_id  UUID REFERENCES submissions(id) ON DELETE SET NULL,
    first_passed_at     TIMESTAMPTZ,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (assignment_id, challenge_id, student_id)
);

CREATE INDEX idx_progress_heatmap ON student_challenge_progress (assignment_id, student_id);

-- Save Game / State ปัจจุบันของนักเรียนในแต่ละ Module
CREATE TABLE student_module_states (
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assignment_id   UUID NOT NULL REFERENCES module_assignments(id) ON DELETE CASCADE,
    state           JSONB NOT NULL DEFAULT '{}'::JSONB,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (student_id, assignment_id)
);

-- ----------------------------------------------------------------------------
-- 5. Gamification (XP & Badges)
-- ----------------------------------------------------------------------------

CREATE TABLE xp_ledger (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    semester_id     UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    source_type     TEXT NOT NULL CHECK (source_type IN ('challenge_clear', 'star_bonus', 'badge', 'teacher_bonus')),
    source_id       UUID,                                       -- อ้างอิง challenge_id หรือ badge_id
    xp_amount       INT NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_xp_ledger_student_semester ON xp_ledger (student_id, semester_id);

CREATE TABLE badges (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    badge_key       TEXT NOT NULL UNIQUE,                       -- เช่น 'bug-hunter', 'zero-hint-master'
    title           TEXT NOT NULL,
    description     TEXT NOT NULL,
    icon_path       TEXT NOT NULL,
    criteria        JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE student_badges (
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id        UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    semester_id     UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    awarded_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (student_id, badge_id, semester_id)
);

-- ----------------------------------------------------------------------------
-- 6. Audit Log (ตรวจสอบการแก้คะแนนหรือปลดล็อกภาคเรียนย้อนหลัง)
-- ----------------------------------------------------------------------------

CREATE TABLE audit_logs (
    id              BIGSERIAL PRIMARY KEY,
    actor_id        UUID REFERENCES users(id) ON DELETE SET NULL,
    action          TEXT NOT NULL,                              -- เช่น 'semester.lock', 'submission.override_score'
    target_type     TEXT NOT NULL,
    target_id       TEXT NOT NULL,
    payload         JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at DESC);

-- ----------------------------------------------------------------------------
-- 7. Coins, Cosmetic Shop, Virtual Pets, Coding Lab, Slides & Code Arena
-- ----------------------------------------------------------------------------

CREATE TABLE coin_ledger (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_type     TEXT NOT NULL,
    ref_key         TEXT,
    amount          INT NOT NULL,
    description     TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_coin_ledger_student ON coin_ledger (student_id, created_at DESC);

CREATE TABLE student_inventory (
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_key        TEXT NOT NULL,
    category        TEXT NOT NULL,
    quantity        INT NOT NULL DEFAULT 1,
    purchased_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (student_id, item_key)
);

CREATE TABLE student_pets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    species_key     TEXT NOT NULL,
    nickname        TEXT NOT NULL,
    rarity          TEXT NOT NULL DEFAULT 'common',
    growth_xp       INT NOT NULL DEFAULT 0,
    hunger          SMALLINT NOT NULL DEFAULT 80,
    closeness       SMALLINT NOT NULL DEFAULT 40,
    trait           TEXT NOT NULL DEFAULT 'อยากรู้อยากเห็น',
    habitat_key     TEXT NOT NULL DEFAULT 'habitat-desk',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    hatched_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_student_pets_student ON student_pets (student_id);

CREATE TABLE lab_files (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    language        TEXT NOT NULL DEFAULT 'python',
    code            TEXT NOT NULL DEFAULT '',
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_lab_files_student ON lab_files (student_id, updated_at DESC);

CREATE TABLE lesson_progress (
    student_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_key           TEXT NOT NULL,
    last_slide           INT NOT NULL DEFAULT 0,
    completed_check_keys JSONB NOT NULL DEFAULT '[]'::JSONB,
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (student_id, lesson_key)
);

CREATE TABLE arena_matches (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_key     TEXT NOT NULL,
    mode            TEXT NOT NULL DEFAULT 'ranked',
    score           INT NOT NULL DEFAULT 0,
    ap_delta        INT NOT NULL DEFAULT 0,
    duration_sec    INT NOT NULL DEFAULT 0,
    passed          BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_arena_matches_student ON arena_matches (student_id, created_at DESC);

