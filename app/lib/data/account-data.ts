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

export async function createAccount(
  accountData: AccountForm
): Promise<Account> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/accounts`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...accountData,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create account");
    }

    return response.json();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create account.");
  }
}
