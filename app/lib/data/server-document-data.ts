// app/lib/data/server-document-data.ts
import { cookies } from "next/headers";
import { Document, DocumentsPageResponse } from "../definitions";
import { NEXT_BASE_URL } from "@/app/lib/api-config";

const API_BASE_URL = NEXT_BASE_URL;

// Helper function để tạo request với cookies forwarding đến Next.js API
async function createRequestWithCookies(
  url: string,
  options: RequestInit = {}
) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
      ...options.headers,
    },
  });
}

export async function fetchAllDocuments(
  query?: string,
  format?: string,
  currentPage?: number,
  currentSize?: number,
  sortBy?: string,
  sortDir?: string
): Promise<DocumentsPageResponse> {
  try {
    const params = new URLSearchParams();

    if (query) params.set("keyword", query);
    if (format && format !== "all") params.set("format", format);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortDir) params.set("sortDir", sortDir);
    if (currentPage) params.set("page", (currentPage - 1).toString());
    if (currentSize) params.set("size", currentSize.toString());

    const queryString = params.toString();
    const url = `${API_BASE_URL}/api/documents${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await createRequestWithCookies(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch documents");
    }

    return await response.json();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch documents data.");
  }
}

export async function fetchDocumentByCode(code: string) {
  try {
    const url = `${API_BASE_URL}/api/documents/${code}/detail`;
    const response = await createRequestWithCookies(url, {
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
}
