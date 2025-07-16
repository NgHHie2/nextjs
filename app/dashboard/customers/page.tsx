import { Suspense } from "react";
import CustomersTable from "@/app/ui/customers/table";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { fetchFilteredCustomers } from "@/app/lib/simple-data";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  // Await the searchParams since it's now a Promise in Next.js 15+
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";

  // Fetch customers data
  const customers = await fetchFilteredCustomers(query);

  return (
    <div className="w-full">
      <Suspense fallback={<InvoicesTableSkeleton />}>
        <CustomersTable customers={customers} />
      </Suspense>
    </div>
  );
}
