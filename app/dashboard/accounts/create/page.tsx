import CreateAccountForm from "@/app/ui/accounts/create-form";
import Form from "@/app/ui/accounts/create-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { lusitana } from "@/app/ui/fonts";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Accounts", href: "/dashboard/accounts" },
          {
            label: "Create Account",
            href: "/dashboard/accounts/create",
            active: true,
          },
        ]}
      />
      <CreateAccountForm />
    </main>
  );
}
