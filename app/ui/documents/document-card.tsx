// app/ui/documents/document-card.tsx
"use client";

import Link from "next/link";
import { Eye, Pencil, FileText, Play } from "lucide-react";
import { Document } from "@/app/lib/definitions";
import { DeleteDocumentButton } from "@/app/ui/documents/buttons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import Image from "next/image";

interface DocumentCardProps {
  document: Document;
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} kB`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  };

  // Auto fetch preview on component mount
  useEffect(() => {
    const fetchPreview = async () => {
      setIsLoadingPreview(true);
      try {
        const response = await fetch(`/api/documents/preview/${document.code}`);
        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setPreviewImage(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching preview:", error);
      } finally {
        setIsLoadingPreview(false);
      }
    };

    fetchPreview();
  }, [document.code]);

  // Cleanup blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
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
        <div className="space-y-1">
          <code className="text-sm text-muted-foreground block">
            {document.documentNumber}
          </code>
          <h3 className="font-semibold leading-tight min-h-[2.5rem] line-clamp-2">
            {document.name}
          </h3>
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

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-1 w-full">
          <Button variant="ghost" size="sm" asChild className="flex-1">
            <Link href={`/dashboard/documents/${document.code}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="flex-1">
            <Link href={`/dashboard/documents/${document.code}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1 flex justify-center">
            <DeleteDocumentButton code={document.code} />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
