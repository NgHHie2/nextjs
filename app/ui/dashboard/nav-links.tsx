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
        "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium transition-all duration-200 shadow-sm md:flex-none md:justify-start md:p-2 md:px-3 focus:outline-none focus-visible:ring-0 active:outline-none select-none",
        {
          "bg-sidebar-item text-gray-700 dark:text-gray-300 hover:bg-sidebar-item-hover hover:text-gray-900 dark:hover:text-white":
            !isActive,
          "bg-muted-foreground text-white dark:text-gray-700": isActive,
        },
        className
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {children}
    </Link>
  );
}
