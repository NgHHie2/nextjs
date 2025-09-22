// app/ui/documents/edit-catalogs-section.tsx
"use client";

import { useState, useEffect } from "react";
import { Document, Position } from "@/app/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Loader2,
  Save,
  RotateCcw,
  Users,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  fetchAllPositions,
  updateDocumentCatalogs,
} from "@/app/lib/data/document-data";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EditDocumentCatalogsSectionProps {
  document: Document;
  allPositions?: Position[]; // Pass positions from parent
  onCatalogsUpdated: (
    catalogs: { id: number; positionId: number; positionName?: string }[]
  ) => void;
}

export default function EditDocumentCatalogsSection({
  document,
  allPositions = [],
  onCatalogsUpdated,
}: EditDocumentCatalogsSectionProps) {
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  const [positions, setPositions] = useState<Position[]>(allPositions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPositionIds, setSelectedPositionIds] = useState<number[]>([]);
  const [originalPositionIds, setOriginalPositionIds] = useState<number[]>([]);
  const [currentCatalogs, setCurrentCatalogs] = useState(
    document.catalogs || []
  );
  const [isLoading, setIsLoading] = useState(allPositions.length === 0);
  const [isSaving, setIsSaving] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);

  // Initialize after hydration
  useEffect(() => {
    setIsClient(true);
    const currentPositionIds =
      document.catalogs?.map((c) => c.positionId) || [];
    setOriginalPositionIds(currentPositionIds);
    setSelectedPositionIds([...currentPositionIds]);
    setCurrentCatalogs(document.catalogs || []);

    // Only load if positions not provided
    if (allPositions.length === 0) {
      loadPositions();
    } else {
      setPositions(allPositions);
      setIsLoading(false);
    }
  }, [document, allPositions]);

  const loadPositions = async () => {
    try {
      setIsLoading(true);
      setHasLoadError(false);
      const data = await fetchAllPositions();
      setPositions(data);
    } catch (error) {
      setHasLoadError(true);
      toast({
        title: "Error",
        description: "Failed to load positions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter positions based on search
  const filteredPositions = positions.filter(
    (position) =>
      position.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      position.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePositionToggle = (positionId: number) => {
    setSelectedPositionIds((prev) =>
      prev.includes(positionId)
        ? prev.filter((id) => id !== positionId)
        : [...prev, positionId]
    );
  };

  const handleClearAll = () => {
    setSelectedPositionIds([]);
  };

  const handleReset = () => {
    setSelectedPositionIds([...originalPositionIds]);
    setSearchQuery("");
  };

  const hasChanges = () => {
    if (!isClient) return false;
    const current = [...selectedPositionIds].sort();
    const original = [...originalPositionIds].sort();
    return JSON.stringify(current) !== JSON.stringify(original);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const result = await updateDocumentCatalogs(
        document.code,
        selectedPositionIds
      );

      // Create updated catalogs with position names
      const positionMap = new Map(positions.map((p) => [p.id, p]));
      const updatedCatalogs = result.catalogs.map(
        (positionId: number, index: number) => ({
          id: index + 1, // Temporary ID since backend doesn't return it
          positionId,
          positionName: positionMap.get(positionId)?.name,
        })
      );

      // Update parent component với data mới
      onCatalogsUpdated(updatedCatalogs);

      // Cập nhật local state
      setOriginalPositionIds([...selectedPositionIds]);
      setCurrentCatalogs(updatedCatalogs);

      toast({
        title: "Success",
        description: "Access permissions updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update access permissions",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getSelectedPositions = () => {
    return positions.filter((p) => selectedPositionIds.includes(p.id));
  };

  const getFilteredSelectedCount = () => {
    return filteredPositions.filter((p) => selectedPositionIds.includes(p.id))
      .length;
  };

  // Show loading state until client hydration is complete
  if (!isClient) {
    return <div className="space-y-6 animate-pulse"></div>;
  }

  if (hasLoadError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load positions. Please try refreshing the page.
          </AlertDescription>
        </Alert>
        <Button onClick={loadPositions} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Position Selection */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search positions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Selection Controls */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {getFilteredSelectedCount()}/{filteredPositions.length} visible
            positions selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-6 px-2 text-xs"
              disabled={isLoading || selectedPositionIds.length === 0}
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Positions List */}
        <Card>
          <ScrollArea className="h-64">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredPositions.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                {searchQuery ? "No positions found" : "No positions available"}
              </div>
            ) : (
              <div className="p-4 space-y-1">
                {filteredPositions.map((position, index) => (
                  <div
                    key={`position-${position.id}-${index}`}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handlePositionToggle(position.id)}
                  >
                    <Checkbox
                      checked={selectedPositionIds.includes(position.id)}
                      onChange={() => handlePositionToggle(position.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {position.name}
                        </span>
                        {originalPositionIds.includes(position.id) && (
                          <Badge variant="outline" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      {position.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {position.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>

        {/* Selected Positions Summary */}
        {selectedPositionIds.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Selected Positions ({selectedPositionIds.length})
            </Label>
            <div className="p-3 bg-muted/30 rounded-lg max-h-24 overflow-y-auto">
              <div className="flex flex-wrap gap-1">
                {getSelectedPositions().map((position, index) => (
                  <Badge
                    key={`selected-${position.id}-${index}`}
                    variant={
                      originalPositionIds.includes(position.id)
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {position.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Change Summary */}
        {hasChanges() && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              You have unsaved changes to the access permissions.
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4 justify-end">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isSaving || !hasChanges()}
          >
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !hasChanges()}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>Save Changes</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
