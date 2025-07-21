import EditAccountForm from "@/app/ui/accounts/edit-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { fetchAccountById } from "@/app/lib/learning-data";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  console.log(id);
  const account = await fetchAccountById(id);
  console.log(account);
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
            active: true,
          },
        ]}
      />
      <EditAccountForm account={account} />
    </main>
  );
}
