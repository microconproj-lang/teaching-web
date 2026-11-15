import { pool } from "../src/core/db";

/**
 * Migration แบบเพิ่มเติม (idempotent) สำหรับฐานข้อมูลที่สร้างไว้ก่อนแล้ว
 * รันซ้ำได้อย่างปลอดภัย: npm run db:migrate-local
 */
const MIGRATIONS: { name: string; sql: string }[] = [
  {
    name: "001_users_avatar_key",
    sql: `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_key TEXT;`,
  },
  {
    name: "002_users_customization_and_arena_ap",
    sql: `
      ALTER TABLE users ADD COLUMN IF NOT EXISTS equipped_theme_key TEXT NOT NULL DEFAULT 'navy-pro';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS equipped_frame_key TEXT NOT NULL DEFAULT 'none';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS equipped_effect_key TEXT NOT NULL DEFAULT 'confetti';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS arena_ap INT NOT NULL DEFAULT 1000;
    `,
  },
  {
    name: "003_coin_ledger_and_shop_inventory",
    sql: `
      CREATE TABLE IF NOT EXISTS coin_ledger (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        source_type TEXT NOT NULL,
        ref_key TEXT,
        amount INT NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_coin_ledger_student ON coin_ledger (student_id, created_at);

      CREATE TABLE IF NOT EXISTS student_inventory (
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        item_key TEXT NOT NULL,
        category TEXT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (student_id, item_key)
      );
    `,
  },
  {
    name: "004_student_pets",
    sql: `
      CREATE TABLE IF NOT EXISTS student_pets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        species_key TEXT NOT NULL,
        nickname TEXT NOT NULL,
        rarity TEXT NOT NULL DEFAULT 'common',
        growth_xp INT NOT NULL DEFAULT 0,
        hunger SMALLINT NOT NULL DEFAULT 80,
        closeness SMALLINT NOT NULL DEFAULT 40,
        trait TEXT NOT NULL DEFAULT 'อยากรู้อยากเห็น',
        habitat_key TEXT NOT NULL DEFAULT 'habitat-desk',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        hatched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_student_pets_student ON student_pets (student_id);
    `,
  },
  {
    name: "005_lab_files_lessons_arena",
    sql: `
      CREATE TABLE IF NOT EXISTS lab_files (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        language TEXT NOT NULL DEFAULT 'python',
        code TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_lab_files_student ON lab_files (student_id, updated_at);

      CREATE TABLE IF NOT EXISTS lesson_progress (
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lesson_key TEXT NOT NULL,
        last_slide INT NOT NULL DEFAULT 0,
        completed_check_keys JSONB NOT NULL DEFAULT '[]'::jsonb,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (student_id, lesson_key)
      );

      CREATE TABLE IF NOT EXISTS arena_matches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        problem_key TEXT NOT NULL,
        mode TEXT NOT NULL DEFAULT 'ranked',
        score INT NOT NULL DEFAULT 0,
        ap_delta INT NOT NULL DEFAULT 0,
        duration_sec INT NOT NULL DEFAULT 0,
        passed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_arena_matches_student ON arena_matches (student_id, created_at);
    `,
  },
];

async function main() {
  for (const m of MIGRATIONS) {
    await pool.query(m.sql);
    console.log(`✓ ${m.name}`);
  }
  console.log("Migrations completed.");
}

main()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
