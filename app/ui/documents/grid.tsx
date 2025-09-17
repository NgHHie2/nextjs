// app/ui/documents/grid.tsx
import { Document } from "@/app/lib/definitions";
import { fetchAllDocuments } from "@/app/lib/data/server-document-data";
import { Card, CardContent } from "@/components/ui/card";
import DocumentCard from "./document-card";

interface DocumentsGridProps {
  query: string;
  currentPage?: number;
  currentSize?: number;
  format?: string;
  sortBy?: string;
  sortDir?: string;
}

export default async function DocumentsGrid({
  query,
  currentPage,
  currentSize,
  format,
  sortBy,
  sortDir,
}: DocumentsGridProps) {
  const data = await fetchAllDocuments(
    query,
    format,
    currentPage,
    currentSize,
    sortBy,
    sortDir
  );

  if (data.content.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No documents found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {data.content.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
}
