"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/lib/auth/auth-context";

// Navigation links
const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Accounts",
    href: "/dashboard/accounts",
    icon: UserGroupIcon,
    adminTeacherOnly: true,
  },
  {
    name: "Splitter",
    href: "/dashboard/splitter",
    icon: DocumentDuplicateIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { isAdmin, isTeacher, loading } = useAuth();

  return (
    <>
      {links.map((link) => {
        // Ẩn tab nếu là adminTeacherOnly và user là student
        if (link.adminTeacherOnly && !isAdmin && !isTeacher) {
          return null;
        }

        const LinkIcon = link.icon;
        const isActive =
          pathname === link.href ||
          (link.href !== "/dashboard" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium transition-colors md:flex-none md:justify-start md:p-2 md:px-3",
              {
                // Active state - giữ nguyên style gốc + dark mode
                "bg-sky-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200":
                  isActive,
                // Inactive state - giữ nguyên + dark mode
                "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400":
                  !isActive,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
