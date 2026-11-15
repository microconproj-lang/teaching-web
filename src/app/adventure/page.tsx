import { AdventureMapClient } from "@/core/components/AdventureMapClient";
import { ServerAppShell } from "@/core/components/ServerAppShell";

export default async function AdventurePage(props: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course } = await props.searchParams;
  return (
    <ServerAppShell activePath="adventure">
      <AdventureMapClient initialCourse={course ?? ""} />
    </ServerAppShell>
  );
}

