import { desc, eq } from "drizzle-orm";
import { db, isDatabaseReachable } from "@/core/db";
import { users } from "@/core/db/schema";
import { ARENA_SAMPLE_LEADERBOARD } from "@/core/config/curriculum";
import { CodeArenaClient, type LeaderboardEntry } from "@/core/components/CodeArenaClient";
import { ServerAppShell } from "@/core/components/ServerAppShell";

export default async function ArenaPage(props: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course } = await props.searchParams;
  let leaderboard: LeaderboardEntry[] = ARENA_SAMPLE_LEADERBOARD;

  if (await isDatabaseReachable()) {
    try {
      const topStudents = await db
        .select({
          fullName: users.fullName,
          displayName: users.displayName,
          ap: users.arenaAp,
        })
        .from(users)
        .where(eq(users.role, "student"))
        .orderBy(desc(users.arenaAp))
        .limit(10);

      if (topStudents.length > 0) {
        leaderboard = [
          ...topStudents.map((s, idx) => ({
            rank: idx + 1,
            displayName: s.displayName || s.fullName,
            room: "นักเรียน PCCPL",
            ap: s.ap,
            streak: 1,
            solved: 1,
          })),
          ...ARENA_SAMPLE_LEADERBOARD,
        ];
      }
    } catch {
      leaderboard = ARENA_SAMPLE_LEADERBOARD;
    }
  }

  return (
    <ServerAppShell activePath="arena">
      <CodeArenaClient leaderboard={leaderboard} initialCourse={course ?? ""} />
    </ServerAppShell>
  );
}

