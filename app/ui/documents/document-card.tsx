// app/ui/documents/document-card.tsx
"use client";

import Link from "next/link";
import {
  Eye,
  Pencil,
  FileText,
  Play,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Document } from "@/app/lib/definitions";
import { DeleteDocumentButton } from "@/app/ui/documents/buttons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePreviewCache } from "./preview-cache-context";
import { useRouter } from "next/navigation";
import { deleteDocument } from "@/app/lib/data/document-data";
import * as Tooltip from "@radix-ui/react-tooltip";

interface DocumentCardProps {
  document: Document;
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const {
    getPreview,
    setPreview,
    isLoading,
    setLoading,
    hasFailed,
    setFailed,
  } = usePreviewCache();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const previewImage = getPreview(document.code);
  const isLoadingPreview = isLoading(document.code);
  const hasFailedToLoad = hasFailed(document.code);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} kB`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  };

  // Fetch preview only if not already cached and not failed
  useEffect(() => {
    if (previewImage || isLoadingPreview || hasFailedToLoad) {
      return; // Already have preview, loading, or failed
    }

    const fetchPreview = async () => {
      setLoading(document.code, true);
      try {
        const response = await fetch(`/api/documents/preview/${document.code}`);
        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setPreview(document.code, imageUrl);
        } else {
          // Mark as failed to prevent retry
          setFailed(document.code);
        }
      } catch (error) {
        console.error("Error fetching preview:", error);
        // Mark as failed to prevent retry
        setFailed(document.code);
      }
    };

    fetchPreview();
  }, [
    document.code,
    previewImage,
    isLoadingPreview,
    hasFailedToLoad,
    setLoading,
    setPreview,
    setFailed,
  ]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDocument(document.code);
      router.refresh();
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="group transition-all duration-200 hover:shadow-xl hover:border-primary hover:scale-[1.02]">
      <CardHeader className="p-4 pb-2">
        {/* Document Preview */}
        <div className="relative w-full aspect-[3/2] bg-muted rounded-md overflow-hidden mb-3">
          {previewImage ? (
            <Image
              src={previewImage}
              alt={document.name}
              fill
              className="object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              {document.format === "PDF" ? (
                <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              ) : (
                <Play className="h-12 w-12 text-red-600 dark:text-red-400" />
              )}
            </div>
          )}

          {isLoadingPreview && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
            </div>
          )}

          {/* Format Badge */}
          <div className="absolute top-2 right-2">
            <Badge
              variant={document.format === "PDF" ? "default" : "destructive"}
            >
              {document.format}
            </Badge>
          </div>
        </div>

        {/* Document Info */}
        <div className="flex items-start justify-between">
          {/* Document number + name */}
          <div className="flex-1 min-w-0 space-y-1">
            <code className="text-sm text-muted-foreground block">
              {document.documentNumber ?? "-"}
            </code>
            <h3
              className="
        font-semibold font-sans leading-tight min-h-[2.5rem]
        overflow-hidden text-ellipsis break-words line-clamp-2
      "
            >
              {document.name}
            </h3>
          </div>

          {/* Actions menu */}
          <DropdownMenu>
            <Tooltip.Provider delayDuration={100}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-5 w-5 p-0 shrink-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </Tooltip.Trigger>

                <Tooltip.Content
                  side="top"
                  sideOffset={5}
                  className="rounded bg-gray-800 px-2 py-1 text-xs text-white shadow"
                >
                  See more
                  <Tooltip.Arrow className="fill-gray-800" />
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>

            <DropdownMenuContent align="start" className="w-40 rounded-lg">
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/documents/${document.code}`}
                  className="flex items-center"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/documents/${document.code}/edit`}
                  className="flex items-center"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {/* File Size */}
        <div className="text-sm text-muted-foreground mb-2">
          {formatFileSize(document.size)}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
          {document.tags && document.tags.length > 0
            ? document.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 text-sm rounded bg-muted text-foreground"
                >
                  {tag.name}
                </span>
              ))
            : null}
          {document.tags && document.tags.length > 2 && (
            <span className="px-2 py-1 text-sm rounded bg-muted text-muted-foreground">
              +{document.tags.length - 2}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
