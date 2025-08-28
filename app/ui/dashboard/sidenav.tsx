"use client";

import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import AcmeLogo from "@/app/ui/acme-logo";
import { SimpleThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/app/lib/auth/auth-context";
import { Badge } from "@/components/ui/badge";
import SignoutButton from "../accounts/logout-button";

export default function SideNav() {
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-background dark:bg-gray-900">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 dark:bg-blue-900 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>

      {/* User Info Section */}
      <div className="mb-2 p-3 bg-muted/50 rounded-lg">
        {user ? (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </span>
            <Badge variant="outline" className="text-xs">
              {user.role}
            </Badge>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Not logged in</div>
        )}
      </div>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 dark:bg-gray-800 md:block"></div>
        <div className="flex justify-center md:justify-start mb-2">
          <SimpleThemeToggle />
        </div>

        <SignoutButton></SignoutButton>
      </div>
    </div>
  );
}
