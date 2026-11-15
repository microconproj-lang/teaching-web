import { createRemoteJWKSet, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { db } from "@/core/db";
import { staffAllowlist, users, type UserRole } from "@/core/db/schema";

const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

export function getAllowedGoogleDomain(): string {
  return (process.env.ALLOWED_GOOGLE_DOMAIN ?? "pccpl.ac.th").toLowerCase().trim();
}

export function getGoogleRedirectUri(): string {
  const appUrl = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");
  return `${appUrl}/api/auth/google/callback`;
}

export function buildGoogleAuthUrl(state: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is not configured.");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getGoogleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state,
    hd: getAllowedGoogleDomain(), // UX hint ให้เลือกบัญชีโรงเรียน
    prompt: "select_account",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export interface VerifiedGoogleProfile {
  sub: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
}

export async function exchangeCodeAndVerifyGoogleUser(code: string): Promise<VerifiedGoogleProfile> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth client credentials are not configured.");
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: getGoogleRedirectUri(),
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Google token exchange failed: ${errText}`);
  }

  const tokenJson = (await tokenRes.json()) as { id_token?: string };
  if (!tokenJson.id_token) {
    throw new Error("Google response did not include an id_token.");
  }

  const { payload } = await jwtVerify(tokenJson.id_token, GOOGLE_JWKS, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: clientId,
  });

  const allowedDomain = getAllowedGoogleDomain();
  const email = typeof payload.email === "string" ? payload.email.toLowerCase().trim() : "";
  const hd = typeof payload.hd === "string" ? payload.hd.toLowerCase().trim() : "";
  const emailVerified = payload.email_verified === true;

  // บังคับตรวจโดเมน @pccpl.ac.th ฝั่ง Server เสมอ (ห้ามเชื่อแค่ hd param ตอนส่งไป)
  if (!emailVerified || hd !== allowedDomain || !email.endsWith(`@${allowedDomain}`)) {
    throw new Error(`อนุญาตเฉพาะบัญชี Google Workspace @${allowedDomain} ที่ยืนยันแล้วเท่านั้น`);
  }

  if (!payload.sub) {
    throw new Error("Missing Google subject identifier.");
  }

  return {
    sub: payload.sub,
    email,
    fullName: typeof payload.name === "string" && payload.name.trim() ? payload.name.trim() : email,
    avatarUrl: typeof payload.picture === "string" ? payload.picture : null,
  };
}

export async function upsertUserFromGoogle(profile: VerifiedGoogleProfile): Promise<{
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
}> {
  const [allowEntry] = await db
    .select()
    .from(staffAllowlist)
    .where(eq(staffAllowlist.email, profile.email))
    .limit(1);

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, profile.email))
    .limit(1);

  if (existing) {
    const resolvedRole: UserRole = allowEntry ? allowEntry.assignedRole : existing.role;
    const [updated] = await db
      .update(users)
      .set({
        googleSub: profile.sub,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
        role: resolvedRole,
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id))
      .returning();

    return {
      id: updated.id,
      email: updated.email,
      fullName: updated.fullName,
      role: updated.role,
      isActive: updated.isActive,
    };
  }

  const initialRole: UserRole = allowEntry ? allowEntry.assignedRole : "student";
  const [created] = await db
    .insert(users)
    .values({
      googleSub: profile.sub,
      email: profile.email,
      fullName: profile.fullName,
      displayName: profile.fullName.split(" ")[0] ?? profile.fullName,
      avatarUrl: profile.avatarUrl,
      role: initialRole,
      lastLoginAt: new Date(),
    })
    .returning();

  return {
    id: created.id,
    email: created.email,
    fullName: created.fullName,
    role: created.role,
    isActive: created.isActive,
  };
}

