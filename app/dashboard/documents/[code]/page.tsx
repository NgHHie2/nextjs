// app/dashboard/documents/[code]/page.tsx
import { Suspense } from "react";
import { fetchDocumentByCode } from "@/app/lib/data/server-document-data";
import { notFound } from "next/navigation";
import PDFViewer from "@/app/ui/documents/pdf-viewer";
import DocumentInfo from "@/app/ui/documents/document-info";
import { lusitana } from "@/app/ui/fonts";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ code: string }>;
}

function DocumentSkeleton() {
  return (
    <div className="flex h-[calc(100vh-120px)] gap-4">
      {/* PDF Viewer Skeleton */}
      <div className="flex-1 bg-gray-100 animate-pulse rounded-lg"></div>

      {/* Info Panel Skeleton */}
      <div className="w-80 bg-gray-100 animate-pulse rounded-lg"></div>
    </div>
  );
}

export default async function DocumentViewPage({ params }: PageProps) {
  const { code } = await params;

  let document;
  try {
    document = await fetchDocumentByCode(code);
    console.log(document);
  } catch (error) {
    notFound();
  }

  if (!document) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/documents">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documents
            </Link>
          </Button>
          <h1 className={`${lusitana.className} text-xl md:text-2xl`}>
            {document.name}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <Suspense fallback={<DocumentSkeleton />}>
        <div className="flex h-[calc(100vh-160px)] gap-6">
          {/* PDF Viewer */}
          <div className="flex-1 min-w-0">
            {document.format === "PDF" ? (
              <PDFViewer document={document} />
            ) : (
              <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">
                    This document format is not supported for viewing.
                  </p>
                  <Button className="mt-4" asChild>
                    <a
                      href={`/api/documents/${document.code}/download`}
                      download
                    >
                      Download Document
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Document Info Panel */}
          <div className="w-80 flex-shrink-0">
            <DocumentInfo document={document} />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
