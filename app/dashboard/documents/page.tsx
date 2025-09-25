// app/dashboard/documents/page.tsx
import { Suspense } from "react";
import AccountsPagination from "@/app/ui/accounts/pagination";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import Search from "@/app/ui/search";
import { lusitana } from "@/app/ui/fonts";
import { CreateDocumentButton } from "@/app/ui/documents/buttons";
import { fetchAllDocuments } from "@/app/lib/data/server-document-data";
import DocumentsFilter from "@/app/ui/documents/filter";
import ResetFiltersButton from "@/app/ui/accounts/reset-filters-button";
import ActiveFiltersBadges from "@/app/ui/documents/active-filters-badges";
import DocumentsView from "@/app/ui/documents/documents-view";
import DocumentsPagination from "@/app/ui/documents/pagination";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    size?: string;
    format?: string;
    sortBy?: string;
    sortDir?: string;
  }>;
}

// Grid skeleton component
function DocumentsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"></div>
  );
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  // Use fixed page size - view mode doesn't affect server-side pagination
  const pageSize = Number(resolvedSearchParams?.size) || 12;

  const format = resolvedSearchParams?.format || "";
  const sortBy = resolvedSearchParams?.sortBy || "";
  const sortDir = resolvedSearchParams?.sortDir || "";

  // Fetch data once at the top level
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
        <CreateDocumentButton />
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
        key={query + currentPage + format + sortBy + sortDir}
        fallback={<DocumentsGridSkeleton />}
      >
        <DocumentsView
          documents={data.content}
          sortBy={sortBy}
          sortDir={sortDir}
        />
      </Suspense>

      {totalPages > 1 && (
        <DocumentsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
        />
      )}
    </div>
  );
}
