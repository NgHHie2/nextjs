// app/ui/documents/pdf-viewer.tsx
"use client";

import { useState, useEffect } from "react";
import { Document } from "@/app/lib/definitions";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw, Loader2 } from "lucide-react";
import { getDocumentDownloadUrl } from "@/app/lib/data/document-data";

interface PDFViewerProps {
  document: Document;
}

export default function PDFViewer({ document }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const pdfUrl = getDocumentDownloadUrl(document.code);

  useEffect(() => {
    // Reset states when document changes
    setIsLoading(true);
    setHasError(false);
    setZoom(1);
    setRotation(0);
  }, [document.code]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          {document.format} • {document.pages > 0 && `${document.pages} pages`}
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}

        {hasError ? (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Failed to load PDF</p>
              <p className="text-sm text-gray-500">
                The document might be protected or corrupted.
              </p>
            </div>
          </div>
        ) : (
          <div
            className="h-full overflow-auto flex items-center justify-center p-4"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: "center center",
            }}
          >
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={document.name}
            />
          </div>
        )}
      </div>
    </div>
  );
}
