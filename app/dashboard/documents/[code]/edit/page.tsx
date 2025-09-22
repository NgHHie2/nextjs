// app/dashboard/documents/[code]/edit/page.tsx
import { Suspense } from "react";
import { fetchDocumentByCode } from "@/app/lib/data/server-document-data";
import { fetchPositionByIds } from "@/app/lib/data/server-position-data";
import { notFound } from "next/navigation";
import { lusitana } from "@/app/ui/fonts";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import EditDocumentTabs from "@/app/ui/documents/edit-tabs";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ code: string }>;
}

function EditDocumentSkeleton() {
  return <div className="space-y-6"></div>;
}

export default async function EditDocumentPage({ params }: PageProps) {
  const { code } = await params;

  let document;
  try {
    document = await fetchDocumentByCode(code);
    if (document) {
      const positionIds = Array.from(
        new Set((document.catalogs || []).map((c) => c.positionId))
      );
      const positions = await fetchPositionByIds(positionIds);
      const positionMap = new Map(positions.map((p) => [p.id, p]));
      (document.catalogs || []).forEach((c) => {
        c.positionName = positionMap.get(c.positionId)?.name;
      });
    }
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
          { label: "Documents", href: "/dashboard/documents" },
          {
            label: "Edit Document",
            href: `/dashboard/documents/${document.code}/edit`,
          },
          {
            label: document.name,
            href: `/dashboard/documents/${document.code}/edit/`,
            active: true,
          },
        ]}
      />

      {/* Tabs */}
      <Suspense fallback={<EditDocumentSkeleton />}>
        <EditDocumentTabs document={document} />
      </Suspense>
    </div>
  );
}
