// app/ui/documents/edit-info-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Document } from "@/app/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Plus, Save } from "lucide-react";
import { updateDocumentInfo } from "@/app/lib/data/document-data";
import { useToast } from "@/hooks/use-toast";

interface EditDocumentInfoFormProps {
  document: Document;
  onDocumentUpdated: (updatedDocument: Partial<Document>) => void;
}

interface FormData {
  name: string;
  documentNumber: string;
  description: string;
  tags: string[];
}

export default function EditDocumentInfoForm({
  document,
  onDocumentUpdated,
}: EditDocumentInfoFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Use useEffect to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    documentNumber: "",
    description: "",
    tags: [],
  });

  const [newTag, setNewTag] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data after hydration
  useEffect(() => {
    setIsClient(true);
    setFormData({
      name: document.name || "",
      documentNumber: document.documentNumber || "",
      description: document.description || "",
      tags: document.tags?.map((tag) => tag.name) || [],
    });
  }, [document]);

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Document name is required";
    } else if (formData.name.length > 255) {
      newErrors.name = "Document name must not exceed 255 characters";
    }

    if (formData.documentNumber.length > 100) {
      newErrors.documentNumber =
        "Document number must not exceed 100 characters";
    }

    if (formData.description.length > 1000) {
      newErrors.description = "Description must not exceed 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = () => {
    if (!isClient) return false;

    const originalTags = document.tags?.map((tag) => tag.name).sort() || [];
    const currentTags = [...formData.tags].sort();

    return (
      formData.name !== (document.name || "") ||
      formData.documentNumber !== (document.documentNumber || "") ||
      formData.description !== (document.description || "") ||
      JSON.stringify(originalTags) !== JSON.stringify(currentTags)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsUpdating(true);

      const updateData = {
        name: formData.name.trim(),
        documentNumber: formData.documentNumber.trim() || undefined,
        description: formData.description.trim() || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      };

      const result = await updateDocumentInfo(document.code, updateData);

      // Update parent component
      onDocumentUpdated({
        name: result.name,
        documentNumber: result.documentNumber,
        description: result.description,
        tags:
          result.tags?.map((tagName: string, index: number) => ({
            id: index + 1, // Temporary ID
            name: tagName,
          })) || [],
      });

      toast({
        title: "Success",
        description: "Document information updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update document",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: document.name || "",
      documentNumber: document.documentNumber || "",
      description: document.description || "",
      tags: document.tags?.map((tag) => tag.name) || [],
    });
    setErrors({});
  };

  // Show loading state until client hydration is complete
  if (!isClient) {
    return <div className="space-y-6 animate-pulse"></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Document Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Document Name</Label>
        <Input
          id="name"
          placeholder="Enter document name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          maxLength={255}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Document Number */}
      <div className="space-y-2">
        <Label htmlFor="documentNumber">Document Number</Label>
        <Input
          id="documentNumber"
          placeholder="Enter document number (optional)"
          value={formData.documentNumber}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, documentNumber: e.target.value }))
          }
          maxLength={100}
          className={errors.documentNumber ? "border-destructive" : ""}
        />
        {errors.documentNumber && (
          <p className="text-sm text-destructive">{errors.documentNumber}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter document description (optional)"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          maxLength={1000}
          rows={3}
          className={errors.description ? "border-destructive" : ""}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{errors.description || ""}</span>
          <span>{formData.description.length}/1000</span>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addTag())
            }
          />
          <Button type="button" variant="outline" onClick={addTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, index) => (
              <Badge
                key={`${tag}-${index}`}
                variant="secondary"
                className="pr-1"
              >
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isUpdating || !hasChanges()}
        >
          Reset
        </Button>

        <Button type="submit" disabled={isUpdating || !hasChanges()}>
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>Save Changes</>
          )}
        </Button>
      </div>
    </form>
  );
}
