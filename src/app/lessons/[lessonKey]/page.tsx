import { notFound } from "next/navigation";
import { INTERACTIVE_LESSONS } from "@/core/config/curriculum";
import { LessonPlayerClient } from "@/core/components/LessonPlayerClient";
import { ServerAppShell } from "@/core/components/ServerAppShell";

export default async function LessonDetailPage(props: {
  params: Promise<{ lessonKey: string }>;
}) {
  const { lessonKey } = await props.params;
  const lesson = INTERACTIVE_LESSONS.find((l) => l.key === lessonKey);
  if (!lesson) notFound();

  return (
    <ServerAppShell activePath="lessons">
      <LessonPlayerClient lesson={lesson} />
    </ServerAppShell>
  );
}

