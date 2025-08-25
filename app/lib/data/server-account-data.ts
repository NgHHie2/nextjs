import { cookies } from "next/headers";
import {
  Account,
  Subject,
  Participation,
  AccountStats,
  SubjectsTable,
  AccountTable,
  DashboardCardData,
  AccountForm,
  AccountsPageResponse,
} from "../definitions";
import { NEXT_BASE_URL } from "@/app/lib/api-config";

const API_BASE_URL = NEXT_BASE_URL;

// Helper function để tạo request với cookies forwarding đến Next.js API
async function createRequestWithCookies(
  url: string,
  options: RequestInit = {}
) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString(); // Lấy tất cả cookies

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader, // Forward cookies đến Next.js API
      ...options.headers,
    },
  });
}

export async function fetchAllAccounts(
  query?: string
): Promise<AccountsPageResponse> {
  try {
    // Next.js API route /api/accounts đã handle query parameter
    const queryParam = query ? `?keyword=${encodeURIComponent(query)}` : "";
    const response = await createRequestWithCookies(
      `${API_BASE_URL}/api/accounts${queryParam}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch accounts");
    }

    return await response.json();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch accounts data.");
  }
}

export async function fetchAccountById(id: number): Promise<Account | null> {
  try {
    const response = await createRequestWithCookies(
      `${API_BASE_URL}/api/accounts/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch account.");
  }
}

export async function fetchParticipationsByAccount(
  accountId: number
): Promise<Participation[]> {
  try {
    const response = await createRequestWithCookies(
      `${API_BASE_URL}/api/participations/account/${accountId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}
