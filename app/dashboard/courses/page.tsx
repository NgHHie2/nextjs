// app/dashboard/courses/page.tsx
import { Suspense } from "react";
import CoursesTable from "@/app/ui/courses/table";
// import AccountsPagination from "@/app/ui/accounts/pagination";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import Search from "@/app/ui/search";
import { lusitana } from "@/app/ui/fonts";
// import { CreateCourseButton } from "@/app/ui/accounts/buttons";
import { fetchAllCourses } from "@/app/lib/data/server-course-data";
// import AccountsFilter from "@/app/ui/accounts/filter";
import { pages } from "next/dist/build/templates/app-page";
import ResetFiltersButton from "@/app/ui/accounts/reset-filters-button";
// import ActiveFiltersBadges from "@/app/ui/accounts/active-filters-badges";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    size?: string;
    startYear?: number;
    endYear?: number;
    sortBy?: string;
    sortDir?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const pageSize = Number(resolvedSearchParams?.size) || 10;
  const startYear = resolvedSearchParams?.startYear || undefined;
  const endYear = resolvedSearchParams?.endYear || undefined;
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
        {/* <CreateAccountButton /> */}
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Search placeholder="Search courses..." />
          </div>
          {/* <AccountsFilter /> */}
          <ResetFiltersButton />
        </div>

        {/* <ActiveFiltersBadges query={query} role={role} /> */}
      </div>

      <Suspense
        key={query + currentPage + startYear + endYear + sortBy + sortDir}
        fallback={<InvoicesTableSkeleton />}
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

      {/* {totalPages > 1 && (
        <AccountsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
        />
      )} */}
    </div>
  );
}
