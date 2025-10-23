import SideNav from "@/app/ui/dashboard/sidenav";
import { AuthProvider } from "@/app/lib/auth/auth-context";
import { SidebarProvider } from "../ui/dashboard/sidebar-wrapper";
import { fetchCurrentUser } from "../lib/data/server-auth-data";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await fetchCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    // <AuthProvider>
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <SidebarProvider>
        <SideNav user={user} />
      </SidebarProvider>
      <div className="flex-grow p-8 md:overflow-y-auto">{children}</div>
    </div>
    // </AuthProvider>
  );
}
