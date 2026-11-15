import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, isDatabaseReachable } from "@/core/db";
import { users, type UserRole } from "@/core/db/schema";
import { setSessionCookie } from "@/core/auth/session";

const DEV_ACCOUNTS: Record<UserRole, { email: string; fullName: string }> = {
  student: { email: "student.demo@pccpl.ac.th", fullName: "นักเรียน ทดสอบ (ม.1/1)" },
  teacher: { email: "teacher.demo@pccpl.ac.th", fullName: "ครูผู้สอน ทดสอบ" },
  admin: { email: "admin.demo@pccpl.ac.th", fullName: "ผู้ดูแลระบบ ทดสอบ" },
};

/**
 * Endpoint สำหรับสลับบทบาททดสอบบน Windows เท่านั้น
 * ระบบจะปิดตัวเองโดยอัตโนมัติเมื่อ NODE_ENV=production หรือ ENABLE_DEV_AUTH !== "true"
 */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production" || process.env.ENABLE_DEV_AUTH !== "true") {
    return NextResponse.json({ error: "Dev auth is disabled." }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as { role?: UserRole };
  const role: UserRole =
    body.role === "teacher" || body.role === "admin" || body.role === "student"
      ? body.role
      : "student";

  const preset = DEV_ACCOUNTS[role];

  try {
    if (!(await isDatabaseReachable())) {
      throw new Error("PostgreSQL offline");
    }
    let [user] = await db.select().from(users).where(eq(users.email, preset.email)).limit(1);
    if (!user) {
      [user] = await db
        .insert(users)
        .values({
          email: preset.email,
          fullName: preset.fullName,
          displayName: preset.fullName,
          role,
        })
        .returning();
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });

    return NextResponse.json({ ok: true, role: user.role, mode: "database" });
  } catch {
    // กรณียังไม่ได้เปิด PostgreSQL บน Windows ให้ทดสอบ Session ชั่วคราวในโหมด Preview ได้
    await setSessionCookie({
      userId: `00000000-0000-0000-0000-00000000000${role === "student" ? "1" : role === "teacher" ? "2" : "3"}`,
      email: preset.email,
      fullName: preset.fullName,
      role,
    });
    return NextResponse.json({ ok: true, role, mode: "stateless-preview" });
  }
}

