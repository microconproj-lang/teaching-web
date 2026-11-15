import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { buildGoogleAuthUrl } from "@/core/auth/google";

export async function GET() {
  try {
    const state = randomBytes(24).toString("hex");
    const cookieStore = await cookies();
    const isHttps = (process.env.APP_URL ?? "").startsWith("https://");

    cookieStore.set("oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production" && isHttps,
      path: "/",
      maxAge: 600,
    });

    const url = buildGoogleAuthUrl(state);
    return NextResponse.redirect(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Google OAuth setup incomplete";
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(message)}`, process.env.APP_URL ?? "http://localhost:3000")
    );
  }
}

