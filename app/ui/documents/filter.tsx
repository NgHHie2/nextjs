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

export default function DocumentsFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleFormatChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // Reset to first page

    if (value === "all") {
      params.delete("format");
    } else {
      params.set("format", value);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const currentFormat = searchParams.get("format") || "all";

  return (
    <Select value={currentFormat} onValueChange={handleFormatChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Filter by format" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Formats</SelectItem>
        <SelectItem value="PDF">PDF</SelectItem>
        <SelectItem value="VIDEO">VIDEO</SelectItem>
      </SelectContent>
    </Select>
  );
}
