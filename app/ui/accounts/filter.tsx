// app/ui/accounts/filter.tsx
"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AccountsFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleRoleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // Reset to first page

    if (value === "all") {
      params.delete("role");
    } else {
      params.set("role", value);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const currentRole = searchParams.get("role") || "all";

  return (
    <Select value={currentRole} onValueChange={handleRoleChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Filter by role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Roles</SelectItem>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="TEACHER">Teacher</SelectItem>
        <SelectItem value="STUDENT">Student</SelectItem>
      </SelectContent>
    </Select>
  );
}
