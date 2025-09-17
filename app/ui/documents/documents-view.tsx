// app/ui/documents/documents-view.tsx
"use client";

import { useState, useEffect } from "react";
import { List, Grid2X2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document } from "@/app/lib/definitions";
import DocumentsTableView from "./table-view";
import DocumentsGridView from "./grid-view";
import { PreviewCacheProvider } from "./preview-cache-context";

interface DocumentsViewProps {
  documents: Document[];
  sortBy?: string;
  sortDir?: string;
}

// Hook to get initial view mode without hydration mismatch
function useInitialViewMode() {
  const [viewMode, setViewMode] = useState<"list" | "grid" | null>(null);

  useEffect(() => {
    // Read from localStorage immediately when component mounts
    const savedViewMode = localStorage.getItem("documents-view-mode") as
      | "list"
      | "grid"
      | null;
    setViewMode(savedViewMode || "list");
  }, []);

  return viewMode;
}

export default function DocumentsView({
  documents,
  sortBy,
  sortDir,
}: DocumentsViewProps) {
  const initialViewMode = useInitialViewMode();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Update viewMode when initialViewMode is resolved
  useEffect(() => {
    if (initialViewMode !== null) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode]);

  const handleViewChange = (newView: "list" | "grid") => {
    setViewMode(newView);
    localStorage.setItem("documents-view-mode", newView);
  };

  // Show loading skeleton until we know the actual view mode
  if (initialViewMode === null) {
    return (
      <div className="space-y-4">
        {/* View Toggle Skeleton */}
        <div className="flex justify-end">
          <div className="flex border rounded-md">
            <div className="h-9 w-9 bg-muted animate-pulse rounded-l-md"></div>
            <div className="h-9 w-9 bg-muted animate-pulse rounded-r-md border-l"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="bg-muted animate-pulse rounded-lg h-96"></div>
      </div>
    );
  }

  return (
    <PreviewCacheProvider>
      <div className="space-y-4">
        {/* View Toggle */}
        <div className="flex justify-end">
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewChange("list")}
              className="rounded-none rounded-l-md border-0"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewChange("grid")}
              className="rounded-none rounded-r-md border-0 border-l"
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {viewMode === "grid" ? (
          <DocumentsGridView documents={documents} />
        ) : (
          <DocumentsTableView
            documents={documents}
            sortBy={sortBy}
            sortDir={sortDir}
          />
        )}
      </div>
    </PreviewCacheProvider>
  );
}
