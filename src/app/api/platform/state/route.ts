import { NextResponse } from "next/server";
import { getCurrentSession } from "@/core/auth/session";
import { loadServerPlatformState } from "@/core/platform/server-state";

export async function GET() {
  const session = await getCurrentSession();
  const state = await loadServerPlatformState(session);
  return NextResponse.json(state);
}

