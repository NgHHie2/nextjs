"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ActiveFiltersBadgesProps {
  query?: string;
  role?: string;
}

export default function ActiveFiltersBadges({
  query,
  role,
}: ActiveFiltersBadgesProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const removeFilter = (filterType: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(filterType);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Không hiển thị gì nếu không có filter nào active
  if (!query && (!role || role === "all")) {
    return null;
  }

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <span className="text-sm text-muted-foreground">Active filters:</span>

      {query && (
        <Badge variant="secondary" className="gap-1">
          Search: {query}
          <X
            className="h-3 w-3 cursor-pointer hover:bg-muted rounded-full"
            onClick={() => removeFilter("query")}
          />
        </Badge>
      )}

      {role && role !== "all" && (
        <Badge variant="secondary" className="gap-1">
          Role: {role}
          <X
            className="h-3 w-3 cursor-pointer hover:bg-muted rounded-full"
            onClick={() => removeFilter("role")}
          />
        </Badge>
      )}
    </div>
  );
}
