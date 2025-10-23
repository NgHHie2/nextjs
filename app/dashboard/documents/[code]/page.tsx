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
import BackButton from "@/app/ui/documents/back-button";
import VideoViewer from "@/app/ui/documents/video-viewer";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { jwtDecode } from "@/app/lib/auth/token-decode";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ code: string }>;
}

function DocumentSkeleton() {
  return <div className="flex h-[calc(100vh-120px)] gap-6"></div>;
}

export default async function DocumentViewPage({ params }: PageProps) {
  const { code } = await params;
  const currentUser = await jwtDecode();
  const currentUserRole = currentUser.role;

  let document;
  try {
    document = await fetchDocumentByCode(code);
  } catch (error) {
    notFound();
  }

  if (!document) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        breadcrumbs={[
          { label: "Documents", href: "/dashboard/documents/" },
          {
            label: "View Document",
            href: `/dashboard/documents/${document.code}`,
          },
          {
            label: document.name,
            href: `/dashboard/documents/${document.code}/`,
            active: true,
          },
        ]}
      />

      {/* Main Content */}
      <Suspense fallback={<DocumentSkeleton />}>
        <div className="flex h-[85vh] gap-6">
          {/* PDF/Video Viewer - Flexible width */}
          <div className="flex-1 min-w-0">
            {document.format === "PDF" ? (
              <PDFViewer document={document} />
            ) : document.format === "VIDEO" ? (
              <VideoViewer videoDoc={document} />
            ) : (
              <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">
                    This document format is not supported for viewing.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Document Info Panel - Dynamic width */}
          <DocumentInfo document={document} role={currentUserRole} />
        </div>
      </Suspense>
    </div>
  );
}
