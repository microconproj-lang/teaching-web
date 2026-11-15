import { ShopClient } from "@/core/components/ShopClient";
import { ServerAppShell } from "@/core/components/ServerAppShell";

export default async function ShopPage() {
  return (
    <ServerAppShell activePath="shop">
      <ShopClient />
    </ServerAppShell>
  );
}

