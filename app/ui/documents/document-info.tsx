// app/ui/documents/document-info.tsx
"use client";

import { Document, Position } from "@/app/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  HardDrive,
  Hash,
  Edit,
  Download,
  Play,
  Files,
  Clock,
  AlignLeft,
  FolderTree,
  ChevronRight,
  ChevronLeft,
  Info,
} from "lucide-react";
import Link from "next/link";
import { getDocumentDownloadUrl } from "@/app/lib/data/document-data";
import { useAuth } from "@/app/lib/auth/auth-context";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DocumentInfoProps {
  document: Document;
}

export default function DocumentInfo({ document }: DocumentInfoProps) {
  const { isAdmin, isTeacher } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(document);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} kB`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}min`
      : `${hours}h`;
  };

  const downloadUrl = getDocumentDownloadUrl(currentDocument.code);

  const handleCatalogsUpdated = (
    newCatalogs: { id: number; position: Position }[]
  ) => {
    setCurrentDocument((prev) => ({
      ...prev,
      catalogs: newCatalogs,
    }));
  };

  return (
    <div
      className={cn(
        "transition-[width] duration-200 ease-in-out ",
        isCollapsed ? "w-12" : "w-80"
      )}
    >
      {/* Collapsed State - Minimal Tab */}
      {isCollapsed && (
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className="h-10 w-10 p-0"
            style={{ backgroundColor: "hsl(var(--muted))" }}
          >
            <Info className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Expanded State - Full Panel */}
      {!isCollapsed && (
        <div className="overflow-y-auto">
          <Card className="">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Document Info
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(true)}
                  className="h-auto p-1"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Basic Info */}
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  Name
                </label>
                <p className="text-sm mt-1 break-words font-medium">
                  {currentDocument.name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  Document Number
                </label>
                <p className="text-sm mt-1 font-mono">
                  {currentDocument.documentNumber || "-"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  Format
                </label>
                <div className="mt-1">
                  <Badge
                    variant={
                      currentDocument.format === "PDF"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {currentDocument.format}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  File Size
                </label>
                <p className="text-sm mt-1 font-mono">
                  {formatFileSize(currentDocument.size)}
                </p>
              </div>

              {/* Document-specific metrics */}
              {currentDocument.format === "PDF" &&
                currentDocument.pages > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      Pages
                    </label>
                    <p className="text-sm mt-1">
                      {currentDocument.pages} pages
                    </p>
                  </div>
                )}

              {currentDocument.format === "VIDEO" &&
                currentDocument.minutes > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      Duration
                    </label>
                    <p className="text-sm mt-1">
                      {formatDuration(currentDocument.minutes)}
                    </p>
                  </div>
                )}

              {/* Description */}
              {currentDocument.description && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      Description
                    </label>
                    <p className="text-sm mt-1 text-muted-foreground leading-relaxed">
                      {currentDocument.description}
                    </p>
                  </div>
                </>
              )}

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  Catalogs
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {currentDocument.tags && currentDocument.tags.length > 0 ? (
                    currentDocument.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 text-sm rounded bg-muted text-foreground"
                      >
                        {tag.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No tags</p>
                  )}
                </div>
              </div>

              {/* Catalogs/Positions */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    Positions
                  </label>
                </div>
                <div className="mt-2">
                  {currentDocument.catalogs &&
                  currentDocument.catalogs.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {currentDocument.catalogs.map((catalog) => (
                        <span
                          key={catalog.id}
                          className="px-2 py-1 text-sm rounded bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-mono"
                        >
                          {catalog.position.name ?? "No name"}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No position assignments
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              {isAdmin && (
                <div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link
                        href={`/dashboard/documents/${currentDocument.code}/edit`}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
