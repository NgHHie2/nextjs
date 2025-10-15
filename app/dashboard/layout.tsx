import SideNav from "@/app/ui/dashboard/sidenav";
import { AuthProvider } from "@/app/lib/auth/auth-context";
import { SidebarProvider } from "../ui/dashboard/sidebar-wrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <SidebarProvider>
          <SideNav />
        </SidebarProvider>
        <div className="flex-grow p-8 md:overflow-y-auto">{children}</div>
      </div>
    </AuthProvider>
  );
}
