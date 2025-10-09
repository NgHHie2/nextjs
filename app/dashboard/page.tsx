import { lusitana } from "@/app/ui/fonts";
import { DocumentStatsChart } from "@/app/ui/statistics/document-stats-chart";
import { AccountStatsChart } from "@/app/ui/statistics/account-stats-chart";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Learning Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <AccountStatsChart />
        <DocumentStatsChart />
      </div>
    </main>
  );
}
