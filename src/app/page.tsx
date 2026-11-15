import { ALLOWED_EMAIL_DOMAIN } from "@/core/config/brand";
import { HomePortalClient } from "@/core/components/HomePortalClient";
import { ServerAppShell } from "@/core/components/ServerAppShell";

export default async function HomePage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const searchParams = await props.searchParams;
  const devAuthEnabled =
    process.env.NODE_ENV !== "production" && process.env.ENABLE_DEV_AUTH === "true";

  const errorMessage = searchParams.error
    ? searchParams.error.includes("pccpl") || searchParams.error.toLowerCase().includes("domain")
      ? `บัญชีนี้ไม่ใช่อีเมลโรงเรียน กรุณาเลือกบัญชีที่ลงท้ายด้วย ${ALLOWED_EMAIL_DOMAIN}`
      : searchParams.error
    : null;

  return (
    <ServerAppShell activePath="home">
      <HomePortalClient errorMessage={errorMessage} devAuthEnabled={devAuthEnabled} />
    </ServerAppShell>
  );
}
