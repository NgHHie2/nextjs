// app/ui/dashboard/sidenav.tsx
import Link from "next/link";
import AcmeLogo from "@/app/ui/acme-logo";
import SignoutButton from "@/app/ui/accounts/logout-button";
import { fetchCurrentUser } from "@/app/lib/data/server-auth-data";
import { redirect } from "next/navigation";
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import NavLink from "./nav-links";
import { SimpleThemeToggle } from "@/components/theme-toggle";
import { BookText } from "lucide-react";

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

export default async function SideNav() {
  const user = await fetchCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const visibleLinks = links.filter((link) => link.roles.includes(user.role));

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-sidebar">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-primary p-4 md:h-40"
        href="/dashboard"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      {/* User info section */}
      <div className="hidden mb-2 md:block p-3 text-sm bg-sidebar-item rounded-md shadow-sm">
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {user.role}
        </div>
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {/* Navigation Links */}
        {visibleLinks.map((link) => {
          const LinkIcon = link.icon;
          return (
            <NavLink key={link.name} href={link.href}>
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </NavLink>
          );
        })}

        <div className="hidden h-auto w-full grow rounded-md bg-sidebar-item md:block shadow-sm"></div>

        <div className="flex justify-center md:justify-start mb-2">
          <SimpleThemeToggle />
        </div>

        <SignoutButton />
      </div>
    </div>
  );
}
