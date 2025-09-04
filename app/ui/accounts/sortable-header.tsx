// app/ui/accounts/sortable-header.tsx
"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortableHeaderProps {
  field: string;
  children: React.ReactNode;
  currentSort?: string;
  currentDir?: string;
}

export default function SortableHeader({
  field,
  children,
  currentSort,
  currentDir,
}: SortableHeaderProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSort = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // Reset to first page when sorting

    if (currentSort === field) {
      // Toggle direction
      if (currentDir === "asc") {
        params.set("sortDir", "desc");
      } else if (currentDir === "desc") {
        // Remove sorting
        params.delete("sortBy");
        params.delete("sortDir");
      } else {
        params.set("sortBy", field);
        params.set("sortDir", "asc");
      }
    } else {
      // New field, start with asc
      params.set("sortBy", field);
      params.set("sortDir", "asc");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const getSortIcon = () => {
    if (currentSort !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }

    if (currentDir === "asc") {
      return <ArrowUp className="h-4 w-4" />;
    } else if (currentDir === "desc") {
      return <ArrowDown className="h-4 w-4" />;
    }

    return <ArrowUpDown className="h-4 w-4" />;
  };

  return (
    <Button
      variant="ghost"
      onClick={handleSort}
      className="h-auto p-0 font-semibold justify-start text-foreground hover:bg-transparent"
    >
      {children}
      <span className="ml-2">{getSortIcon()}</span>
    </Button>
  );
}
