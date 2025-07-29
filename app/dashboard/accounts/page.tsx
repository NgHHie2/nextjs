import { Suspense } from "react";
import AccountsTable from "@/app/ui/accounts/table";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import Search from "@/app/ui/search";
import { lusitana } from "@/app/ui/fonts";
import { CreateAccountButton } from "@/app/ui/accounts/buttons";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Accounts</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search accounts..." />
        <CreateAccountButton></CreateAccountButton>
      </div>

      <Suspense key={query} fallback={<InvoicesTableSkeleton />}>
        <AccountsTable query={query} />
      </Suspense>
    </div>
  );
}
