// app/dashboard/documents/page.tsx
import { Suspense } from "react";
import DocumentsTable from "@/app/ui/documents/table";
import DocumentsGrid from "@/app/ui/documents/grid";
import AccountsPagination from "@/app/ui/accounts/pagination";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import Search from "@/app/ui/search";
import { lusitana } from "@/app/ui/fonts";
import { CreateDocumentButton } from "@/app/ui/documents/buttons";
import ViewToggle from "@/app/ui/documents/view-toggle";
import { fetchAllDocuments } from "@/app/lib/data/server-document-data";
import DocumentsFilter from "@/app/ui/documents/filter";
import ResetFiltersButton from "@/app/ui/accounts/reset-filters-button";
import ActiveFiltersBadges from "@/app/ui/documents/active-filters-badges";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    size?: string;
    format?: string;
    sortBy?: string;
    sortDir?: string;
    view?: "list" | "grid";
  }>;
}

// Grid skeleton component
function DocumentsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bg-gray-50 animate-pulse rounded-lg h-80" />
      ))}
    </div>
  );
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const viewMode = resolvedSearchParams?.view || "list";

  // Adjust page size based on view mode
  const defaultPageSize = viewMode === "grid" ? 12 : 10;
  const pageSize = Number(resolvedSearchParams?.size) || defaultPageSize;

  const format = resolvedSearchParams?.format || "";
  const sortBy = resolvedSearchParams?.sortBy || "";
  const sortDir = resolvedSearchParams?.sortDir || "";

  // Fetch data for pagination info
  const data = await fetchAllDocuments(
    query,
    format,
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
        <h1 className={`${lusitana.className} text-2xl`}>Documents</h1>
        <div className="flex items-center gap-3">
          <ViewToggle />
          <CreateDocumentButton />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Search placeholder="Search documents..." />
          </div>
          <DocumentsFilter />
          <ResetFiltersButton />
        </div>

        <ActiveFiltersBadges query={query} format={format} />
      </div>

      <Suspense
        key={query + currentPage + format + sortBy + sortDir + viewMode}
        fallback={
          viewMode === "grid" ? (
            <DocumentsGridSkeleton />
          ) : (
            <InvoicesTableSkeleton />
          )
        }
      >
        {viewMode === "grid" ? (
          <DocumentsGrid
            query={query}
            currentPage={currentPage}
            currentSize={pageSize}
            format={format}
            sortBy={sortBy}
            sortDir={sortDir}
          />
        ) : (
          <DocumentsTable
            query={query}
            currentPage={currentPage}
            currentSize={pageSize}
            format={format}
            sortBy={sortBy}
            sortDir={sortDir}
          />
        )}
      </Suspense>

      {totalPages > 1 && (
        <AccountsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
        />
      )}
    </div>
  );
}
