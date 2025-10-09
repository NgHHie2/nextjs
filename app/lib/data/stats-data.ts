import { API_BASE_URL } from "@/app/lib/api-config";

export type DocumentStats = {
  id: number;
  totalDocuments: number;
  totalPdf: number;
  totalVideo: number;
  lastUpdated: string;
};

export type AccountStats = {
  id: number;
  totalAccounts: number;
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  lastUpdated: string;
};

export async function fetchDocumentStats(): Promise<DocumentStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/documents`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch document stats");
    }

    return response.json();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch document stats.");
  }
}

export async function fetchAccountStats(): Promise<AccountStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/accounts`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch account stats");
    }

    return response.json();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch account stats.");
  }
}
