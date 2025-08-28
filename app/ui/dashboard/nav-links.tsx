// app/ui/dashboard/client-nav-link.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface ClientNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function ClientNavLink({
  href,
  children,
  className,
}: ClientNavLinkProps) {
  const pathname = usePathname();

  const isActive =
    pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={clsx(
        "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium transition-all duration-200 shadow-sm md:flex-none md:justify-start md:p-2 md:px-3",
        {
          "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white":
            !isActive,
          "bg-blue-600 text-white dark:bg-blue-600 dark:text-blue-300":
            isActive,
        },
        className
      )}
    >
      {children}
    </Link>
  );
}
