// app/lib/data/server-account-data.ts
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

export async function fetchAllAccounts(
  query?: string,
  role?: string,
  currentPage?: number,
  currentSize?: number,
  sortBy?: string,
  sortDir?: string
): Promise<AccountsPageResponse> {
  try {
    const params = new URLSearchParams();

    if (query) params.set("keyword", query);
    if (role && role !== "all") params.set("role", role);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortDir) params.set("sortDir", sortDir);
    if (currentPage) params.set("page", (currentPage - 1).toString());
    if (currentSize) params.set("size", currentSize.toString());

    const queryString = params.toString();
    const url = `${API_BASE_URL}/api/accounts${
      queryString ? `?${queryString}` : ""
    }`;

    console.log("hiep: ", url);

    const response = await createRequestWithCookies(url, {
      cache: "no-store",
    });

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
