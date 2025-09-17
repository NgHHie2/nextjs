// app/ui/documents/document-info.tsx
"use client";

import { Document } from "@/app/lib/definitions";
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
} from "lucide-react";
import Link from "next/link";
import { getDocumentDownloadUrl } from "@/app/lib/data/document-data";

interface DocumentInfoProps {
  document: Document;
}

export default function DocumentInfo({ document }: DocumentInfoProps) {
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

  const downloadUrl = getDocumentDownloadUrl(document.code);

  return (
    <div className="h-full overflow-y-auto">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            {document.format === "PDF" ? (
              <FileText className="h-5 w-5 text-blue-600" />
            ) : (
              <Play className="h-5 w-5 text-red-600" />
            )}
            Document Info
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Actions */}
          <div className="flex gap-2">
            <Button asChild size="sm" className="flex-1">
              <Link href={`/dashboard/documents/${document.code}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={downloadUrl} download={document.name}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            </Button>
          </div>

          <Separator />

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Name
              </label>
              <p className="text-sm mt-1 break-words font-medium">
                {document.name}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Document Number
              </label>
              <p className="text-sm mt-1 font-mono">
                {document.documentNumber || "-"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Code
              </label>
              <p className="text-sm mt-1 font-mono bg-muted px-2 py-1 rounded">
                {document.code}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Format
              </label>
              <div className="mt-1">
                <Badge
                  variant={
                    document.format === "PDF" ? "default" : "destructive"
                  }
                >
                  {document.format}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                File Size
              </label>
              <p className="text-sm mt-1 font-mono">
                {formatFileSize(document.size)}
              </p>
            </div>

            {/* Document-specific metrics */}
            {document.format === "PDF" && document.pages > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Files className="h-3 w-3" />
                  Pages
                </label>
                <p className="text-sm mt-1">{document.pages} pages</p>
              </div>
            )}

            {document.format === "VIDEO" && document.minutes > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Duration
                </label>
                <p className="text-sm mt-1">
                  {formatDuration(document.minutes)}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Description */}
          {document.description && (
            <>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <AlignLeft className="h-3 w-3" />
                  Description
                </label>
                <p className="text-sm mt-1 text-muted-foreground leading-relaxed">
                  {document.description}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Tags
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {document.tags && document.tags.length > 0 ? (
                document.tags.map((tag) => (
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

          <Separator />

          {/* Catalogs/Positions */}
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <FolderTree className="h-3 w-3" />
              Catalogs
            </label>
            <div className="mt-2">
              {document.catalogs && document.catalogs.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {document.catalogs.map((catalog) => (
                    <span
                      key={catalog.id}
                      className="px-2 py-1 text-sm rounded bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-mono"
                    >
                      #{catalog.positionId}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No catalog assignments
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
