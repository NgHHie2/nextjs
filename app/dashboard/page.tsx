import { lusitana } from "@/app/ui/fonts";
import DashboardCardWrapper from "@/app/ui/dashboard/cards";
import ParticipationChart from "@/app/ui/dashboard/participation-chart";
import LatestActivities from "@/app/ui/dashboard/latest-activities";
import { Suspense } from "react";
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Learning Dashboard
      </h1>
      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <DashboardCardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <ParticipationChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestActivities />
        </Suspense>
      </div> */}
    </main>
  );
}
