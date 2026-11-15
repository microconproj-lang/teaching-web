import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, isDatabaseReachable } from "@/core/db";
import { users } from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { isValidAvatarKey } from "@/core/avatars";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    avatarKey?: unknown;
    displayName?: unknown;
  } | null;

  if (!body || !isValidAvatarKey(body.avatarKey)) {
    return NextResponse.json({ error: "ตัวละครไม่ถูกต้อง" }, { status: 400 });
  }

  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
  if (displayName.length < 2 || displayName.length > 20) {
    return NextResponse.json({ error: "ชื่อเล่นต้องยาว 2–20 ตัวอักษร" }, { status: 400 });
  }

  if (!(await isDatabaseReachable())) {
    return NextResponse.json({ error: "ยังไม่ได้เชื่อมต่อฐานข้อมูล (โหมด Preview)" }, { status: 503 });
  }

  const [updated] = await db
    .update(users)
    .set({ avatarKey: body.avatarKey, displayName, updatedAt: new Date() })
    .where(eq(users.id, session.userId))
    .returning({ id: users.id });

  if (!updated) {
    return NextResponse.json({ error: "ไม่พบบัญชีผู้ใช้" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

