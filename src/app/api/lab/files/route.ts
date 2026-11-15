import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, isDatabaseReachable } from "@/core/db";
import { labFiles } from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { LAB_PROBLEMS } from "@/core/config/curriculum";
import { grantUniqueCoins } from "@/core/platform/rewards";
import { gradePythonChallenge } from "@/core/python/runner";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  const body = (await req.json().catch(() => null)) as {
    action?: "save_file" | "delete_file" | "submit_problem";
    fileId?: string;
    title?: string;
    code?: string;
    problemKey?: string;
  } | null;

  if (!body?.action) {
    return NextResponse.json({ error: "คำสั่งไม่ถูกต้อง" }, { status: 400 });
  }

  if (body.action === "submit_problem") {
    const problem = LAB_PROBLEMS.find((p) => p.key === body.problemKey);
    if (!problem) {
      return NextResponse.json({ error: "ไม่พบโจทย์ Coding Lab" }, { status: 404 });
    }
    const graded = gradePythonChallenge(body.code ?? "", problem.testCases);
    if (!graded.passed || !session || !(await isDatabaseReachable())) {
      return NextResponse.json({ ok: true, localMode: true, graded });
    }

    const coinRes = await db.transaction((tx) =>
      grantUniqueCoins(tx, {
        studentId: session.userId,
        sourceType: "lesson_exercise",
        refKey: `lab:${problem.key}`,
        amount: problem.coinReward,
        description: `ผ่านโจทย์ Coding Lab: ${problem.title}`,
        xpAmount: 25,
        boostCloseness: 6,
      })
    );
    return NextResponse.json({ ok: true, graded, ...coinRes });
  }

  if (!session || !(await isDatabaseReachable())) {
    return NextResponse.json({
      ok: true,
      localMode: true,
      file: {
        id: body.fileId || `local-${Date.now()}`,
        title: (body.title || "script.py").trim(),
        language: "python" as const,
        code: body.code ?? "",
        updatedAt: new Date().toISOString(),
      },
    });
  }

  if (body.action === "delete_file" && body.fileId) {
    await db
      .delete(labFiles)
      .where(and(eq(labFiles.id, body.fileId), eq(labFiles.studentId, session.userId)));
    return NextResponse.json({ ok: true });
  }

  if (body.action === "save_file") {
    const cleanTitle = (body.title ?? "untitled.py").trim().slice(0, 60) || "untitled.py";
    if (body.fileId && !body.fileId.startsWith("local-") && !body.fileId.startsWith("guest-")) {
      const [updated] = await db
        .update(labFiles)
        .set({ title: cleanTitle, code: body.code ?? "", updatedAt: new Date() })
        .where(and(eq(labFiles.id, body.fileId), eq(labFiles.studentId, session.userId)))
        .returning();
      if (updated) {
        return NextResponse.json({ ok: true, file: updated });
      }
    }

    const [created] = await db
      .insert(labFiles)
      .values({
        studentId: session.userId,
        title: cleanTitle,
        language: "python",
        code: body.code ?? "",
      })
      .returning();
    return NextResponse.json({ ok: true, file: created });
  }

  return NextResponse.json({ error: "ไม่รองรับคำสั่ง" }, { status: 400 });
}

