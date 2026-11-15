import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/core/db";
import { staffAllowlist, users } from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { getAllowedGoogleDomain } from "@/core/auth/google";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as {
    email?: string;
    assignedRole?: "teacher" | "admin";
    note?: string;
  } | null;

  const email = body?.email?.toLowerCase().trim() ?? "";
  const allowedDomain = getAllowedGoogleDomain();
  if (!email.endsWith(`@${allowedDomain}`)) {
    return NextResponse.json({ error: `ต้องเป็นอีเมล @${allowedDomain} เท่านั้น` }, { status: 400 });
  }

  const role = body?.assignedRole === "admin" ? "admin" : "teacher";

  await db
    .insert(staffAllowlist)
    .values({
      email,
      assignedRole: role,
      note: body?.note?.trim() || null,
    })
    .onConflictDoUpdate({
      target: staffAllowlist.email,
      set: { assignedRole: role, note: body?.note?.trim() || null },
    });

  // อัปเดต role ทันทีหากผู้ใช้นั้นเคย Login เข้าระบบแล้ว
  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.email, email));

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น" }, { status: 403 });
  }

  const email = req.nextUrl.searchParams.get("email")?.toLowerCase().trim();
  if (!email) {
    return NextResponse.json({ error: "กรุณาระบุ email" }, { status: 400 });
  }

  await db.delete(staffAllowlist).where(eq(staffAllowlist.email, email));
  return NextResponse.json({ ok: true });
}

