"use client";

// app/ui/courses/documents-section.tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, ChevronDown } from "lucide-react";
import { Catalog } from "@/app/lib/definitions";
import AssignDocumentDialog from "./assign-document-dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DeleteDocumentFromSemesterButton } from "./buttons";
import { useAuth } from "@/app/lib/auth/auth-context";

export default function DocumentsSection({
  documents,
  semesterId,
}: {
  documents: any[];
  semesterId: number;
}) {
  const { isAdmin, isTeacher } = useAuth();
  const router = useRouter();

  const handleDocumentUpdate = () => {
    router.refresh();
  };
  const totalDocuments = documents?.length || 0;

  return (
    <Collapsible className="group">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <CardTitle className="flex items-center gap-2 cursor-pointer">
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                <FileText className="h-5 w-5" />
                Documents ({totalDocuments})
              </CardTitle>
            </CollapsibleTrigger>

            <AssignDocumentDialog
              semesterId={semesterId}
              onDocumentAssigned={handleDocumentUpdate}
            />
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent>
            {documents && documents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[37.5%]">Document</TableHead>
                    <TableHead className="w-[12.5% text-center">
                      Number
                    </TableHead>
                    <TableHead className="w-[37.5%] text-center">
                      Access
                    </TableHead>
                    <TableHead className="w-[12.5%] text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((semDoc) => (
                    <TableRow key={semDoc.id}>
                      <TableCell className="font-medium">
                        {semDoc.document.name}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-wrap justify-center">
                          {semDoc.document.documentNumber ?? "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center flex-wrap gap-1">
                          {semDoc.document.catalogs?.map((catalog: Catalog) => (
                            <Badge
                              key={catalog.id}
                              variant="outline"
                              className="text-xs"
                            >
                              {catalog.position.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center flex-wrap gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/dashboard/courses/${semesterId}/document/${semDoc.document.code}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {(isAdmin || isTeacher) && (
                            <DeleteDocumentFromSemesterButton
                              id={semesterId}
                              code={semDoc.document.code}
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No documents in this course.
                </p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
