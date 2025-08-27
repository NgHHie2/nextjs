// app/dashboard/accounts/page.tsx
import { Suspense } from "react";
import AccountsTable from "@/app/ui/accounts/table";
import AccountsPagination from "@/app/ui/accounts/pagination";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import Search from "@/app/ui/search";
import { lusitana } from "@/app/ui/fonts";
import { CreateAccountButton } from "@/app/ui/accounts/buttons";
import { fetchAllAccounts } from "@/app/lib/data/server-account-data";
import AccountsFilter from "@/app/ui/accounts/filter";
import { pages } from "next/dist/build/templates/app-page";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    size?: string;
    role?: string;
    sortBy?: string;
    sortDir?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const pageSize = Number(resolvedSearchParams?.size) || 10;
  const role = resolvedSearchParams?.role || "";
  const sortBy = resolvedSearchParams?.sortBy || "";
  const sortDir = resolvedSearchParams?.sortDir || "";

  // Fetch data for pagination info
  const data = await fetchAllAccounts(
    query,
    role,
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
        <h1 className={`${lusitana.className} text-2xl`}>Accounts</h1>
        <CreateAccountButton />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Search placeholder="Search accounts..." />
        </div>
        <AccountsFilter />
      </div>

      <Suspense
        key={query + currentPage + role + sortBy + sortDir}
        fallback={<InvoicesTableSkeleton />}
      >
        <AccountsTable
          query={query}
          currentPage={currentPage}
          currentSize={pageSize}
          role={role}
          sortBy={sortBy}
          sortDir={sortDir}
        />
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
