// app/ui/dashboard/sidebar-components.tsx
"use client";

import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeAltIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-wrapper";
import AcmeLogo from "@/app/ui/acme-logo";
import { SidebarUserInfoProps } from "@/app/lib/definitions";

export function SidebarToggle() {
  const { isCollapsed, toggleCollapse } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleCollapse}
      title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {isCollapsed ? (
        <ArrowRightIcon className="w-5 h-5" />
      ) : (
        <ArrowLeftIcon className="w-5 h-5" />
      )}
    </Button>
  );
}

export function SidebarLogo() {
  const { isCollapsed } = useSidebar();

  return (
    <Link
      className="mb-2 flex items-end rounded-md bg-primary p-1 transition-all duration-300 h-20 md:h-40 relative overflow-hidden"
      href="/dashboard"
    >
      {/* Icon - collapsed state */}
      <div
        className={`absolute inset-0 flex items-end justify-start p-1 transition-opacity duration-300 ${
          isCollapsed ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <GlobeAltIcon
          className="h-12 w-12 text-white"
          style={{ transform: "rotate(15deg)" }}
        />
      </div>

      {/* Logo - expanded state */}
      <div
        className={`transition-opacity duration-300 ${
          isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </div>
    </Link>
  );
}

export function SidebarUserInfo({ user }: SidebarUserInfoProps) {
  const { isCollapsed } = useSidebar();

  return (
    <Link
      href="/dashboard/profile"
      className="hidden mb-2 md:block relative bg-sidebar-item rounded-md shadow-sm hover:bg-sidebar-item-hover transition-colors cursor-pointer overflow-hidden h-[60px]"
      title={
        isCollapsed
          ? `${user.lastName} ${user.firstName} - ${user.role}`
          : undefined
      }
    >
      {/* Collapsed state - Initials */}
      <div
        className={`absolute inset-0 flex items-center justify-center p-3 text-sm transition-opacity duration-300 ${
          isCollapsed ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="text-lg text-gray-900 dark:text-gray-100">
          {user.firstName?.[0]}
          {user.lastName?.[0]}
        </div>
      </div>

      {/* Expanded state - Full info */}
      <div
        className={`p-3 text-sm transition-opacity duration-300 ${
          isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap overflow-hidden text-ellipsis">
          {user.lastName} {user.firstName}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">
          {user.role}
        </div>
      </div>
    </Link>
  );
}

export function SidebarContainer({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={`flex flex-none h-full flex-col px-3 py-4 md:px-2 bg-sidebar transition-all duration-300 ${
        isCollapsed ? "md:w-14" : "md:w-64"
      }`}
    >
      {children}
    </div>
  );
}

export function SidebarControls({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={`flex mb-2 gap-2 transition-all duration-300 ${
        isCollapsed
          ? "flex-col justify-center items-center"
          : "flex-row justify-center md:justify-start"
      }`}
    >
      {children}
    </div>
  );
}
