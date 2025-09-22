// app/dashboard/documents/create/page.tsx
import { Suspense } from "react";
import { lusitana } from "@/app/ui/fonts";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import CreateDocumentForm from "@/app/ui/documents/create-form";

export const dynamic = "force-dynamic";

function CreateDocumentSkeleton() {
  return <div className="space-y-6"></div>;
}

export default function CreateDocumentPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        breadcrumbs={[
          { label: "Documents", href: "/dashboard/documents" },
          {
            label: "Create Document",
            href: "/dashboard/documents/create",
            active: true,
          },
        ]}
      />

      {/* Page Header */}
      <div>
        <h1 className={`${lusitana.className} text-2xl`}>Create Document</h1>
        <p className="text-muted-foreground">
          Upload a new document and configure its settings.
        </p>
      </div>

      {/* Form */}
      <Suspense fallback={<CreateDocumentSkeleton />}>
        <CreateDocumentForm />
      </Suspense>
    </div>
  );
}
