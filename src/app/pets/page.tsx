import { PetsClient } from "@/core/components/PetsClient";
import { ServerAppShell } from "@/core/components/ServerAppShell";

export default async function PetsPage() {
  return (
    <ServerAppShell activePath="pets">
      <PetsClient />
    </ServerAppShell>
  );
}

