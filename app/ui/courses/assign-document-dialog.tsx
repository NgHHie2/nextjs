// app/ui/courses/assign-document-dialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Loader2 } from "lucide-react";
import { searchDocumentByNumber } from "@/app/lib/data/document-data";
import { assignDocumentsToCourse } from "@/app/lib/data/course-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AssignDocumentDialogProps {
  semesterId: number;
  onDocumentAssigned?: () => void;
}

export default function AssignDocumentDialog({
  semesterId,
  onDocumentAssigned,
}: AssignDocumentDialogProps) {
  const [open, setOpen] = useState(false);
  const [documentNumber, setDocumentNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [foundDocument, setFoundDocument] = useState<any | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!documentNumber.trim()) {
      setSearchError("Please enter a document number");
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setFoundDocument(null);

    try {
      const document = await searchDocumentByNumber(documentNumber.trim());
      setFoundDocument(document);
    } catch (error) {
      console.error("Search error:", error);
      if (error instanceof Error) {
        setSearchError(error.message);
      } else {
        setSearchError("Document not found");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssign = async () => {
    if (!foundDocument) return;

    setIsAssigning(true);
    setSearchError(null);

    try {
      // Gọi API để assign document vào course
      await assignDocumentsToCourse(semesterId, [foundDocument.code]);
      // Reset form và đóng dialog
      setDocumentNumber("");
      setFoundDocument(null);
      setSearchError(null);
      setOpen(false);

      // Thông báo cho parent component
      onDocumentAssigned?.();
    } catch (error) {
      console.error("Assign error:", error);
      if (error instanceof Error) {
        setSearchError(error.message);
      } else {
        setSearchError("Failed to assign document");
      }
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setDocumentNumber("");
    setFoundDocument(null);
    setSearchError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-[140px]">
          <Plus className="h-4 w-4" />
          Assign Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Document To This Course</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                id="documentNumber"
                placeholder="Enter document number"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching || !documentNumber.trim()}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {searchError && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {searchError}
            </div>
          )}

          {foundDocument && (
            <div className="border rounded-lg bg-muted/50">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Number</TableHead>
                    <TableHead className="w-[50px] text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{foundDocument.name}</TableCell>
                    <TableCell>{foundDocument.documentNumber}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={handleAssign}
                        disabled={isAssigning}
                        size="icon"
                        variant="outline"
                      >
                        {isAssigning ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
