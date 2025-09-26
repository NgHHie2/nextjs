// app/dashboard/courses/create/page.tsx
import CreateCourseForm from "@/app/ui/courses/create-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { lusitana } from "@/app/ui/fonts";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Courses", href: "/dashboard/courses" },
          {
            label: "Create Course",
            href: "/dashboard/courses/create",
            active: true,
          },
        ]}
      />
      <CreateCourseForm />
    </main>
  );
}
