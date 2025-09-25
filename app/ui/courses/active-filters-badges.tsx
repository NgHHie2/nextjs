// app/ui/courses/active-filters-badges.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ActiveFiltersBadgesProps {
  query?: string;
  startYear?: number;
  endYear?: number;
}

export default function ActiveFiltersBadges({
  query,
  startYear,
  endYear,
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
  if (!query && !startYear && !endYear) {
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

      {startYear && (
        <Badge variant="secondary" className="gap-1">
          Start Year: {startYear}
          <X
            className="h-3 w-3 cursor-pointer hover:bg-muted rounded-full"
            onClick={() => removeFilter("startYear")}
          />
        </Badge>
      )}

      {endYear && (
        <Badge variant="secondary" className="gap-1">
          End Year: {endYear}
          <X
            className="h-3 w-3 cursor-pointer hover:bg-muted rounded-full"
            onClick={() => removeFilter("endYear")}
          />
        </Badge>
      )}
    </div>
  );
}
