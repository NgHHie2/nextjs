// app/dashboard/documents/[code]/not-found.tsx
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";
import Link from "next/link";

export default function DocumentNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <FileX className="h-16 w-16 text-muted-foreground" />
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Document Not Found</h1>
        <p className="text-muted-foreground">
          The document you're looking for doesn't exist or you don't have
          permission to view it.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard/documents">Back to Documents</Link>
      </Button>
    </div>
  );
}
