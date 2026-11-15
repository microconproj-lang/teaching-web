import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/core/auth/session";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/", process.env.APP_URL ?? "http://localhost:3000"));
}

