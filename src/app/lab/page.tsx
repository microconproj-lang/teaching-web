import { CodingLabClient } from "@/core/components/CodingLabClient";
import { ServerAppShell } from "@/core/components/ServerAppShell";

export default async function CodingLabPage(props: {
  searchParams: Promise<{ grade?: string; course?: string }>;
}) {
  const { grade, course } = await props.searchParams;
  const initialGrade = grade === "1" || grade === "2" || grade === "3" ? Number(grade) : 0;

  return (
    <ServerAppShell activePath="lab">
      <CodingLabClient initialGrade={initialGrade} initialCourse={course ?? ""} />
    </ServerAppShell>
  );
}

