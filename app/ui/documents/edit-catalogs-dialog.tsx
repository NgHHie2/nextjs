// app/ui/documents/edit-catalogs-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import { Document, Position } from "@/app/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Search, Loader2, X } from "lucide-react";
import {
  fetchAllPositions,
  updateDocumentCatalogs,
} from "@/app/lib/data/document-data";
import { useToast } from "@/hooks/use-toast";

interface EditCatalogsDialogProps {
  document: Document;
  onCatalogsUpdated: (
    catalogs: { id: number; positionId: number; positionName?: string }[]
  ) => void;
}

export default function EditCatalogsDialog({
  document,
  onCatalogsUpdated,
}: EditCatalogsDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPositionIds, setSelectedPositionIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get current position IDs from document
  const currentPositionIds = document.catalogs?.map((c) => c.positionId) || [];

  // Load positions when dialog opens
  useEffect(() => {
    if (open) {
      loadPositions();
      setSelectedPositionIds([...currentPositionIds]);
    }
  }, [open]);

  const loadPositions = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllPositions();
      setPositions(data);
    } catch (error) {
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
  const filteredPositions = positions.filter((position) =>
    position.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePositionToggle = (positionId: number) => {
    setSelectedPositionIds((prev) =>
      prev.includes(positionId)
        ? prev.filter((id) => id !== positionId)
        : [...prev, positionId]
    );
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
      const updatedCatalogs = result.catalogs.map((positionId, index) => ({
        id: index + 1, // Temporary ID since backend doesn't return it
        positionId,
        positionName: positionMap.get(positionId)?.name,
      }));

      onCatalogsUpdated(updatedCatalogs);
      setOpen(false);

      toast({
        title: "Success",
        description: "Document catalogs updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update catalogs",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const clearSelection = () => {
    setSelectedPositionIds([]);
  };

  const hasChanges =
    JSON.stringify(selectedPositionIds.sort()) !==
    JSON.stringify(currentPositionIds.sort());

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Document Catalogs</DialogTitle>
          <DialogDescription>
            Select which positions can access this document.
          </DialogDescription>
        </DialogHeader>

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

          {/* Positions List */}
          <ScrollArea className="h-64 border rounded-md">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredPositions.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                {searchQuery ? "No positions found" : "No positions available"}
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {filteredPositions.map((position) => (
                  <div
                    key={position.id}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 cursor-pointer"
                    onClick={() => handlePositionToggle(position.id)}
                  >
                    <Checkbox
                      checked={selectedPositionIds.includes(position.id)}
                      onChange={() => handlePositionToggle(position.id)}
                    />
                    <span className="flex-1 text-sm">{position.name}</span>
                    {currentPositionIds.includes(position.id) && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Selected Positions Preview */}
          {selectedPositionIds.length > 0 && (
            <div className="space-y-2">
              {/* Selection Summary */}
              <div className="flex items-center al text-sm">
                <span className="text-muted-foreground">
                  {selectedPositionIds.length} selected
                </span>
                <div className="flex gap-2 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                    className="h-6 px-2 text-sm"
                    disabled={selectedPositionIds.length === 0}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {selectedPositionIds.map((positionId) => {
                  const position = positions.find((p) => p.id === positionId);
                  return position ? (
                    <Badge
                      key={positionId}
                      variant="secondary"
                      className="text-xs"
                    >
                      {position.name}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePositionToggle(positionId);
                        }}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-2 w-2" />
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
