// app/ui/documents/edit-tabs.tsx
"use client";

import { useState, useEffect } from "react";
import { Document, Position } from "@/app/lib/definitions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileText, Users } from "lucide-react";
import EditDocumentInfoForm from "./edit-info-form";
import EditDocumentCatalogsSection from "./edit-catalogs-section";
import { fetchAllPositions } from "@/app/lib/data/document-data";
import { Button } from "@/components/ui/button";

interface EditDocumentTabsProps {
  document: Document;
}

export default function EditDocumentTabs({ document }: EditDocumentTabsProps) {
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [allPositions, setAllPositions] = useState<Position[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Initialize state after hydration and load positions once
  useEffect(() => {
    setIsClient(true);
    setCurrentDocument(document);

    // Load all positions once for the catalogs section
    const loadPositions = async () => {
      try {
        const positions = await fetchAllPositions();
        setAllPositions(positions);
      } catch (error) {
        console.error("Failed to load positions:", error);
      }
    };

    loadPositions();
  }, [document]);

  const handleDocumentUpdated = (updatedDocument: Partial<Document>) => {
    if (currentDocument) {
      setCurrentDocument((prev) =>
        prev
          ? {
              ...prev,
              ...updatedDocument,
            }
          : null
      );
    }
  };

  const handleCatalogsUpdated = (
    newCatalogs: { id: number; positionId: number; positionName?: string }[]
  ) => {
    if (currentDocument) {
      setCurrentDocument((prev) =>
        prev
          ? {
              ...prev,
              catalogs: newCatalogs,
            }
          : null
      );
    }
  };

  // Show loading skeleton until hydration is complete
  if (!isClient || !currentDocument) {
    return <div className="space-y-6"></div>;
  }

  return (
    <Tabs defaultValue="info" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="info" className="flex items-center gap-2">
          Document Information
        </TabsTrigger>
        <TabsTrigger value="catalogs" className="flex items-center gap-2">
          Access Permissions
        </TabsTrigger>
      </TabsList>

      <TabsContent value="info">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Document Information</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Update the basic information for this document.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open("/dashboard/documents/" + document.code, "_blank")
                }
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View Document
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <EditDocumentInfoForm
              document={currentDocument}
              onDocumentUpdated={handleDocumentUpdated}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="catalogs">
        <Card>
          <CardHeader>
            <CardTitle>Access Permissions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage which positions can access this document.
            </p>
          </CardHeader>
          <CardContent>
            <EditDocumentCatalogsSection
              document={currentDocument}
              allPositions={allPositions}
              onCatalogsUpdated={handleCatalogsUpdated}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
