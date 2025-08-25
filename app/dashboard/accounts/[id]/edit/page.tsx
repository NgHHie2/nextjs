import EditAccountForm from "@/app/ui/accounts/edit-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { fetchAccountById } from "@/app/lib/data/server-account-data";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const account = await fetchAccountById(id);
  if (!account) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Accounts", href: "/dashboard/accounts" },
          {
            label: "Edit Account",
            href: `/dashboard/accounts/${id}/edit`,
          },
          {
            label: account.username,
            href: `/dashboard/accounts/${id}/edit#username`,
            active: true,
          },
        ]}
      />
      <EditAccountForm account={account} />
    </main>
  );
}
