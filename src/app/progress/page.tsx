import { ProgressDashboardClient } from "@/core/components/ProgressDashboardClient";
import { ServerAppShell } from "@/core/components/ServerAppShell";

export default async function ProgressPage() {
  return (
    <ServerAppShell activePath="progress">
      <ProgressDashboardClient />
    </ServerAppShell>
  );
}

