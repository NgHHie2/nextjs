// app/ui/documents/grid-view.tsx
import { Document } from "@/app/lib/definitions";
import { Card, CardContent } from "@/components/ui/card";
import DocumentCard from "./document-card";

interface DocumentsGridViewProps {
  documents: Document[];
}

export default function DocumentsGridView({
  documents,
}: DocumentsGridViewProps) {
  if (documents.length === 0) {
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
      {documents.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
}
