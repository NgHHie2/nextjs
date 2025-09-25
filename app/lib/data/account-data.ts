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
import { API_BASE_URL } from "@/app/lib/api-config";

export async function createAccount(
  accountData: AccountForm
): Promise<Account> {
  try {
    const response = await fetch(`${API_BASE_URL}/account`, {
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
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create account");
    }

    return response.json();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create account.");
  }
}

export async function updateAccount(
  id: number,
  accountData: Account
): Promise<Account> {
  try {
    const response = await fetch(`${API_BASE_URL}/account/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...accountData,
        birthDay: new Date(accountData.birthDay).toISOString(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update account");
    }

    return response.json();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update account.");
  }
}

export async function deleteAccount(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/account/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete account");
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete account.");
  }
}

export async function changePasswordByAdmin(
  id: number,
  passwordData: {
    newPassword: string;
    confirmPassword: string;
  }
): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/account/change-password/${id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to change password");
    }

    return await response.json();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to change password.");
  }
}
