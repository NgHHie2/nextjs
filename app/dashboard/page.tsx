import { lusitana } from "@/app/ui/fonts";
import DashboardCardWrapper from "@/app/ui/dashboard/cards";
import ParticipationChart from "@/app/ui/dashboard/participation-chart";
import LatestActivities from "@/app/ui/dashboard/latest-activities";
import { Suspense } from "react";
import { ChartPieLegend } from "@/app/ui/statistics/document-stats";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Learning Dashboard
      </h1>
      <ChartPieLegend></ChartPieLegend>
    </main>
  );
}
