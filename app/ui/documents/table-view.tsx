// app/ui/documents/table-view.tsx
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { Document } from "@/app/lib/definitions";
import { DeleteDocumentButton } from "@/app/ui/documents/buttons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SortableHeader from "@/app/ui/accounts/sortable-header";

interface DocumentsTableViewProps {
  documents: Document[];
  sortBy?: string;
  sortDir?: string;
}

export default function DocumentsTableView({
  documents,
  sortBy,
  sortDir,
}: DocumentsTableViewProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} kB`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  };

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
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/50">
              <TableHead className="font-semibold text-foreground">
                <SortableHeader
                  field="documentNumber"
                  currentSort={sortBy}
                  currentDir={sortDir}
                >
                  Code
                </SortableHeader>
              </TableHead>
              <TableHead className="min-w-[250px] max-w-[350px] font-semibold text-foreground">
                <SortableHeader
                  field="name"
                  currentSort={sortBy}
                  currentDir={sortDir}
                >
                  Name
                </SortableHeader>
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                <SortableHeader
                  field="size"
                  currentSort={sortBy}
                  currentDir={sortDir}
                >
                  Size
                </SortableHeader>
              </TableHead>
              <TableHead className="max-w-[150px] min-w-[100px] font-semibold text-foreground">
                <SortableHeader
                  field="tags"
                  currentSort={sortBy}
                  currentDir={sortDir}
                >
                  Tags
                </SortableHeader>
              </TableHead>
              <TableHead className="font-semibold text-foreground text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document, index) => (
              <TableRow
                key={document.id}
                className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
              >
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      {document.documentNumber}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-semibold">{document.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-sm font-mono">
                    {formatFileSize(document.size)}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {document.tags && document.tags.length > 0 ? (
                      document.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-0.5 text-sm rounded-full bg-muted text-foreground"
                        >
                          {tag.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-center gap-1">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/documents/${document.code}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/documents/${document.code}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteDocumentButton code={document.code} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
