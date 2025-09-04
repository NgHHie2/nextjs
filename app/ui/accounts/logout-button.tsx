"use client";

import { useAuth } from "@/app/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { PowerIcon } from "@heroicons/react/24/outline";

export default function SignoutButton() {
  const { logout } = useAuth();

  const handleSignout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      logout();
      window.location.href = "/login";
    }
  };

  return (
    <Button
      onClick={handleSignout}
      variant="ghost"
      className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-white dark:bg-gray-800 p-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white md:flex-none md:justify-start md:p-2 md:px-3 transition-all duration-200 shadow-sm dark:shadow-none"
    >
      <PowerIcon className="w-6" />
      <div className="hidden md:block">Sign Out</div>
    </Button>
  );
}
