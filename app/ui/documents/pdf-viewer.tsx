// app/ui/documents/pdf-viewer.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Document } from "@/app/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { getDocumentDownloadUrl } from "@/app/lib/data/document-data";
import { useTheme } from "next-themes";
import { url } from "inspector";

interface PDFViewerProps {
  document: Document;
  semesterId?: number;
}

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export default function PDFViewer({ document, semesterId }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null); // For double buffering
  const { resolvedTheme } = useTheme();
  const pdfUrl = getDocumentDownloadUrl(document.code, { semesterId });
  const totalPages = document.pages || 1;

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && resolvedTheme === "dark";

  // Load PDF.js from local files
  useEffect(() => {
    const loadPdfJs = () => {
      if (typeof window !== "undefined" && window.pdfjsLib) {
        setIsScriptLoaded(true);
        return;
      }

      if (typeof window !== "undefined" && window.document) {
        const doc = window.document;
        const script = doc.createElement("script");
        script.src = "/libs/pdfjs/pdf.min.js";
        script.onload = () => {
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "/libs/pdfjs/pdf.worker.min.js";
            setIsScriptLoaded(true);
          }
        };
        script.onerror = () => {
          setHasError(true);
          setIsLoading(false);
        };
        doc.head.appendChild(script);
      }
    };

    loadPdfJs();
  }, []);

  // Load PDF document
  useEffect(() => {
    if (!isScriptLoaded || !window.pdfjsLib) return;

    const loadPdf = async () => {
      try {
        setIsLoading(true);
        const loadingTask = window.pdfjsLib.getDocument({
          url: pdfUrl,
          withCredentials: true,
        });
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadPdf();
  }, [isScriptLoaded, pdfUrl]);

  // Render page to canvas with double buffering
  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current || !hiddenCanvasRef.current) return;

    try {
      setIsRendering(true);
      const page = await pdfDoc.getPage(pageNum);

      // Render to hidden canvas first
      const hiddenCanvas = hiddenCanvasRef.current;
      const hiddenContext = hiddenCanvas.getContext("2d");

      if (!hiddenContext) {
        console.error("Could not get hidden canvas context");
        setIsRendering(false);
        return;
      }

      const viewport = page.getViewport({ scale: zoom, rotation });

      // Set hidden canvas dimensions
      hiddenCanvas.height = viewport.height;
      hiddenCanvas.width = viewport.width;

      // Set background based on theme
      hiddenContext.fillStyle = isDarkMode ? "#374151" : "#ffffff";
      hiddenContext.fillRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);

      // Render page to hidden canvas
      await page.render({
        canvasContext: hiddenContext,
        viewport: viewport,
      }).promise;

      // Now copy from hidden canvas to visible canvas (instant operation)
      const visibleCanvas = canvasRef.current;
      const visibleContext = visibleCanvas.getContext("2d");

      if (visibleContext) {
        visibleCanvas.height = viewport.height;
        visibleCanvas.width = viewport.width;
        visibleContext.drawImage(hiddenCanvas, 0, 0);
      }

      setIsRendering(false);
    } catch (error) {
      console.error("Error rendering page:", error);
      setIsRendering(false);
    }
  };

  // Re-render when page, zoom, or rotation changes
  useEffect(() => {
    if (pdfDoc && mounted) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, zoom, rotation, isDarkMode, mounted]);

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(validPage);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput);
    if (!isNaN(pageNum)) {
      handlePageChange(pageNum);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  if (hasError) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/50 rounded-lg">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Failed to load PDF viewer
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background border border-border rounded-lg shadow-sm">
      {/* PDF Content */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading PDF...</p>
            </div>
          </div>
        )}

        <div
          className="h-full overflow-auto flex items-center justify-center p-4"
          style={{
            backgroundColor: mounted
              ? isDarkMode
                ? "#1f2937"
                : "#f9fafb"
              : "#f9fafb",
            transition: "background-color 0.3s ease",
          }}
        >
          {/* Layer này chỉ để scroll */}
          <div className="max-h-full ">
            <div
              className="shadow-lg rounded-lg overflow-hidden"
              style={{ backgroundColor: "hsl(var(--muted))" }}
            >
              {/* Visible canvas */}
              <canvas
                ref={canvasRef}
                className="max-w-full block"
                style={{
                  display: pdfDoc ? "block" : "none",
                }}
              />

              {/* Hidden canvas for double buffering */}
              <canvas
                ref={hiddenCanvasRef}
                style={{
                  display: "none",
                  position: "absolute",
                  top: -9999,
                  left: -9999,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="relative flex items-center justify-between p-4 border-t border-border bg-card min-h-[72px]">
        {/* Left Controls - Fixed width container */}
        <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border border-border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.5))}
              disabled={zoom <= 0.5 || isLoading}
              className="border-0 rounded-r-none h-8 w-8 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            {/* Hide zoom percentage on small screens */}
            <span className="hidden lg:inline text-sm font-medium min-w-[60px] text-center px-2 py-1 bg-muted whitespace-nowrap">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom((prev) => Math.min(prev + 0.25, 3))}
              disabled={zoom >= 3 || isLoading}
              className="border-0 rounded-l-none h-8 w-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Rotate */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Center - Page Navigation (absolutely centered) */}
        {totalPages > 1 && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2">
              {/* Hide first/last page buttons on small screens */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isLoading}
                className="h-8 w-8 p-0 hidden lg:flex"
              >
                <SkipBack className="h-3 w-3" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>

              <form
                onSubmit={handlePageInputSubmit}
                className="flex items-center gap-1"
              >
                <Input
                  type="text"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  className="w-12 h-8 text-center text-sm p-1"
                  disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  / {totalPages}
                </span>
              </form>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>

              {/* Hide first/last page buttons on small screens */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || isLoading}
                className="h-8 w-8 p-0 hidden lg:flex"
              >
                <SkipForward className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Right Info - Fixed width container */}
        <div className="text-sm text-muted-foreground whitespace-nowrap min-w-0 flex-shrink-0">
          <span className="hidden sm:inline">{document.format} • </span>
          <span>
            {totalPages} {totalPages === 1 ? "page" : "pages"}
          </span>
        </div>
      </div>
    </div>
  );
}
