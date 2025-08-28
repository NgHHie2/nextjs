import { cookies } from "next/headers";
import { Account } from "../definitions";
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

export async function fetchCurrentUser(): Promise<Account | null> {
  try {
    const response = await createRequestWithCookies(
      `${API_BASE_URL}/api/auth/me`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Database Error:", error);
    return null;
  }
}
