import { cookies } from 'next/headers';
import { Account, Subject, Participation, AccountStats, SubjectsTable, AccountTable, DashboardCardData, AccountForm, AccountsPageResponse } from '../definitions';
import { API_BASE_URL } from "@/app/lib/api-config"

export async function fetchAllAccounts(query: string): Promise<AccountsPageResponse> {
  try {
    const cookieStore = await cookies();
    const url = `${API_BASE_URL}/account/search${query ? `?keyword=${encodeURIComponent(query)}` : ""}`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: { Cookie: cookieStore.toString() },
    });

    if (!res.ok) throw new Error("Fetch failed");

    return await res.json();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch accounts data.');
  }
}

export async function fetchAccountById(id: number): Promise<Account | null> {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${API_BASE_URL}/account/${id}`, {
      cache: 'no-store',
      headers: {
      // Nếu bạn muốn forward cookie từ request của user
        Cookie: cookieStore.toString()
        },
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch account.');
  }
}

export async function fetchParticipationsByAccount(accountId: number): Promise<Participation[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/participations/account/${accountId}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}
