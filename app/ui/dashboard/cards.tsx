import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { fetchDashboardData } from "@/app/lib/learning-data";

const iconMap = {
  accounts: UserGroupIcon,
  subjects: InboxIcon,
  participations: BanknotesIcon,
  active: ClockIcon,
};

export default async function CardWrapper() {
  const data = await fetchDashboardData();

  return (
    <>
      <Card title="Total Accounts" value={data.totalAccounts} type="accounts" />
      <Card title="Total Subjects" value={data.totalSubjects} type="subjects" />
      <Card
        title="Total Participations"
        value={data.totalParticipations}
        type="participations"
      />
      <Card title="Active Subjects" value={data.activeSubjects} type="active" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "accounts" | "subjects" | "participations" | "active";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
