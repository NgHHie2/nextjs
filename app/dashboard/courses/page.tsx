// app/dashboard/courses/page.tsx
import { Suspense } from "react";
import CoursesTable from "@/app/ui/courses/table";
import CoursesPagination from "@/app/ui/courses/pagination";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import Search from "@/app/ui/search";
import { lusitana } from "@/app/ui/fonts";
import { CreateCourseButton } from "@/app/ui/courses/buttons";
import { fetchAllCourses } from "@/app/lib/data/server-course-data";
import CoursesFilter from "@/app/ui/courses/filter";
import ResetFiltersButton from "@/app/ui/courses/reset-filters-button";
import ActiveFiltersBadges from "@/app/ui/courses/active-filters-badges";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    size?: string;
    startYear?: string;
    endYear?: string;
    sortBy?: string;
    sortDir?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const pageSize = Number(resolvedSearchParams?.size) || 10;
  const startYear = resolvedSearchParams?.startYear
    ? Number(resolvedSearchParams.startYear)
    : undefined;
  const endYear = resolvedSearchParams?.endYear
    ? Number(resolvedSearchParams.endYear)
    : undefined;
  const sortBy = resolvedSearchParams?.sortBy || "";
  const sortDir = resolvedSearchParams?.sortDir || "";

  // Fetch data for pagination info
  const data = await fetchAllCourses(
    query,
    startYear,
    endYear,
    currentPage,
    pageSize,
    sortBy,
    sortDir
  );
  const totalPages = data.totalPages || 0;
  const totalElements = data.totalElements || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Courses</h1>
        <CreateCourseButton />
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Search placeholder="Search courses..." />
          </div>
          <CoursesFilter />
          <ResetFiltersButton />
        </div>

        <ActiveFiltersBadges
          query={query}
          startYear={startYear}
          endYear={endYear}
        />
      </div>

      <Suspense
        key={query + currentPage + startYear + endYear + sortBy + sortDir}
        // fallback={<InvoicesTableSkeleton />}
      >
        <CoursesTable
          query={query}
          currentPage={currentPage}
          currentSize={pageSize}
          startYear={startYear}
          endYear={endYear}
          sortBy={sortBy}
          sortDir={sortDir}
        />
      </Suspense>

      {totalPages > 1 && (
        <CoursesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
        />
      )}
    </div>
  );
}
