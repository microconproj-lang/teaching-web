import React from "react";
import { eq } from "drizzle-orm";
import { db, isDatabaseReachable } from "@/core/db";
import { semesters } from "@/core/db/schema";
import { getCurrentSession } from "@/core/auth/session";
import { loadServerPlatformState } from "@/core/platform/server-state";
import { AppShell, type NavSectionKey } from "@/core/components/AppShell";

export async function ServerAppShell({
  activePath,
  hidePetWidget = false,
  children,
}: {
  activePath: NavSectionKey;
  hidePetWidget?: boolean;
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  const state = await loadServerPlatformState(session);

  let semesterLabel: string | null = null;
  if (await isDatabaseReachable()) {
    try {
      const [sem] = await db
        .select({ label: semesters.label })
        .from(semesters)
        .where(eq(semesters.isCurrent, true))
        .limit(1);
      semesterLabel = sem?.label ?? null;
    } catch {
      semesterLabel = null;
    }
  }

  const devAuthEnabled =
    process.env.NODE_ENV !== "production" && process.env.ENABLE_DEV_AUTH === "true";

  return (
    <AppShell
      initialState={state}
      activePath={activePath}
      semesterLabel={semesterLabel}
      devAuthEnabled={devAuthEnabled}
      hidePetWidget={hidePetWidget}
    >
      {children}
    </AppShell>
  );
}

