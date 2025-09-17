import { NEXT_BASE_URL } from "@/app/lib/api-config";

const API_BASE_URL = NEXT_BASE_URL;

export async function deleteDocument(code: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/documents/${code}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete document");
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete document.");
  }
}

export function getDocumentDownloadUrl(code: string): string {
  return `${API_BASE_URL}/api/documents/${code}/download`;
}
