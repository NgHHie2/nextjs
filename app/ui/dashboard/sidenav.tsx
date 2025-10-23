// app/ui/dashboard/sidenav.tsx
import SignoutButton from "@/app/ui/accounts/logout-button";
import { fetchCurrentUser } from "@/app/lib/data/server-auth-data";
import { redirect } from "next/navigation";
import {
  UserGroupIcon,
  HomeIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import ClientNavLink from "./nav-links";
import { SimpleThemeToggle } from "@/components/theme-toggle";
import { BookText } from "lucide-react";
import {
  SidebarContainer,
  SidebarLogo,
  SidebarToggle,
  SidebarUserInfo,
  SidebarControls,
} from "./sidebar-components";
import { SidebarUserInfoProps } from "@/app/lib/definitions";

const links = [
  {
    name: "Home",
    href: "/dashboard",
    icon: HomeIcon,
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
  {
    name: "Accounts",
    href: "/dashboard/accounts",
    icon: UserGroupIcon,
    roles: ["ADMIN"],
  },
  {
    name: "Documents",
    href: "/dashboard/documents",
    icon: BookText,
    roles: ["ADMIN", "TEACHER"],
  },
  {
    name: "Courses",
    href: "/dashboard/courses",
    icon: AcademicCapIcon,
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
];

export default async function SideNav({ user }: SidebarUserInfoProps) {
  // const user = await fetchCurrentUser();

  // if (!user) {
  //   redirect("/login");
  // }

  const visibleLinks = links.filter((link) => link.roles.includes(user.role));

  return (
    <SidebarContainer>
      <SidebarLogo />
      <SidebarUserInfo user={user} />

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {/* Navigation Links */}
        {visibleLinks.map((link) => {
          const LinkIcon = link.icon;
          return (
            <ClientNavLink key={link.name} href={link.href}>
              <LinkIcon className="w-6" />
              <p className="hidden md:block sidebar-nav-text">{link.name}</p>
            </ClientNavLink>
          );
        })}

        <div className="hidden h-auto w-full grow rounded-md bg-sidebar-item md:block shadow-sm"></div>

        {/* Theme Toggle and Sidebar Toggle */}
        <SidebarControls>
          <SimpleThemeToggle />
          <div className="hidden md:block">
            <SidebarToggle />
          </div>
        </SidebarControls>

        <SignoutButton />
      </div>
    </SidebarContainer>
  );
}
