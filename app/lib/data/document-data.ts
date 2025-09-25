import { API_BASE_URL } from "@/app/lib/api-config";
import { Position } from "../definitions";

export async function deleteDocument(code: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/document/${code}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete document");
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete document.");
  }
}

export function getDocumentDownloadUrl(code: string): string {
  return `${API_BASE_URL}/document/download/${code}`;
}

export function getVideoStreamUrl(code: string): string {
  return `${API_BASE_URL}/document/stream/${code}`;
}

// Fetch all positions for the current user
export async function fetchAllPositions(): Promise<Position[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/document/position`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch positions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching positions:", error);
    throw error;
  }
}

// Update document catalogs
export async function updateDocumentCatalogs(
  documentCode: string,
  catalogs: number[]
): Promise<{ catalogs: number[] }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/document/catalog/${documentCode}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ catalogs }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update catalogs");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating catalogs:", error);
    throw error;
  }
}

// Upload document
export async function uploadDocument(formData: FormData): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/document/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload document");
    }

    return await response.json();
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
}

// Update document info (without catalogs)
export async function updateDocumentInfo(
  code: string,
  data: {
    name?: string;
    documentNumber?: string;
    description?: string;
    tags?: string[];
  }
): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/document/${code}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update document");
    }

    return await response.json();
  } catch (error) {
    console.error("Update Error:", error);
    throw error;
  }
}
