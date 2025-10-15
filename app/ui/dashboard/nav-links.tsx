"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSidebar } from "./sidebar-wrapper";
import { ReactElement, Children } from "react";

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
  const { isCollapsed } = useSidebar();

  const isActive =
    pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));

  // Separate icon and text from children
  const childrenArray = Children.toArray(children);
  const icon = childrenArray[0]; // Icon is first child
  const text = childrenArray[1]; // Text is second child

  return (
    <Link
      href={href}
      className={clsx(
        "flex h-[48px] grow items-center rounded-md p-3 text-sm font-medium transition-all duration-200 shadow-sm md:flex-none md:p-2  focus:outline-none focus-visible:ring-0 active:outline-none select-none relative overflow-hidden",
        {
          "bg-sidebar-item text-gray-700 dark:text-gray-300 hover:bg-sidebar-item-hover hover:text-gray-900 dark:hover:text-white":
            !isActive,
          "bg-muted-foreground text-white dark:text-gray-700": isActive,
        },
        className
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Icon - always visible */}
      <div className="flex-shrink-0">{icon}</div>

      {/* Text - fade in/out with opacity */}
      <div
        className={`pl-2 hidden md:block transition-opacity duration-200 whitespace-nowrap ${
          isCollapsed ? "pl-0 opacity-0 w-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {text}
      </div>
    </Link>
  );
}
