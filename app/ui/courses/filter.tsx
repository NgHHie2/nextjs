// app/ui/courses/filter.tsx
"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CoursesFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Tạo array năm từ 2020 đến năm hiện tại + 2
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2018 }, (_, i) => 2020 + i);

  const handleStartYearChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // Reset to first page

    if (value === "all") {
      params.delete("startYear");
    } else {
      params.set("startYear", value);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleEndYearChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // Reset to first page

    if (value === "all") {
      params.delete("endYear");
    } else {
      params.set("endYear", value);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const currentStartYear = searchParams.get("startYear") || "all";
  const currentEndYear = searchParams.get("endYear") || "all";

  return (
    <div className="flex gap-2">
      <Select value={currentStartYear} onValueChange={handleStartYearChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Start year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Start Year</SelectItem>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentEndYear} onValueChange={handleEndYearChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="End year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">End Year</SelectItem>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
