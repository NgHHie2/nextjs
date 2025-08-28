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
      className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-gray-800 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <PowerIcon className="w-6" />
      <div className="hidden md:block">Sign Out</div>
    </Button>
  );
}
