// app/lib/data/server-document-data.ts
import { cookies } from "next/headers";
import { Position } from "../definitions";
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

export async function fetchPositionByIds(ids: number[]): Promise<Position[]> {
  try {
    const params = new URLSearchParams();
    ids.forEach((id) => params.append("id", id.toString()));
    const url = `${API_BASE_URL}/api/positions?${params.toString()}`;
    const response = await createRequestWithCookies(url, {
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching position:", error);
    throw error;
  }
}
