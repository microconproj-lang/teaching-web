import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeAndVerifyGoogleUser, upsertUserFromGoogle } from "@/core/auth/google";
import { setSessionCookie } from "@/core/auth/session";

export async function GET(req: NextRequest) {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const errorParam = req.nextUrl.searchParams.get("error");

  if (errorParam) {
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(errorParam)}`, appUrl));
  }

  const cookieStore = await cookies();
  const expectedState = cookieStore.get("oauth_state")?.value;
  cookieStore.delete("oauth_state");

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/?error=invalid_oauth_state", appUrl));
  }

  try {
    const profile = await exchangeCodeAndVerifyGoogleUser(code);
    const user = await upsertUserFromGoogle(profile);

    if (!user.isActive) {
      return NextResponse.redirect(new URL("/?error=account_disabled", appUrl));
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });

    return NextResponse.redirect(new URL("/dashboard", appUrl));
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(msg)}`, appUrl));
  }
}

