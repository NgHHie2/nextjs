// app/ui/documents/view-toggle.tsx
"use client";

import { List, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

type ViewMode = "list" | "grid";

export default function ViewToggle() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentView = (searchParams.get("view") as ViewMode) || "list";

  const handleViewChange = (view: ViewMode) => {
    const params = new URLSearchParams(searchParams);
    if (view === "list") {
      params.delete("view");
    } else {
      params.set("view", view);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex border rounded-md">
      <Button
        variant={currentView === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleViewChange("list")}
        className="rounded-none rounded-l-md border-0"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={currentView === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleViewChange("grid")}
        className="rounded-none rounded-r-md border-0 border-l"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
    </div>
  );
}
