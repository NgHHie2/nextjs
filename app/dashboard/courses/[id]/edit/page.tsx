// app/dashboard/courses/[id]/edit/page.tsx
import EditCourseForm from "@/app/ui/courses/edit-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { fetchCourseById } from "@/app/lib/data/server-course-data";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const course = await fetchCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Courses", href: "/dashboard/courses" },
          {
            label: course.name,
            href: `/dashboard/courses/${id}`,
          },
          {
            label: "Edit Course",
            href: `/dashboard/courses/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditCourseForm course={course} />
    </main>
  );
}
