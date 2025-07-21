import { Account, Subject, Participation, AccountStats, SubjectsTable, AccountTable, DashboardCardData, AccountForm } from '../definitions';
import { NEXT_BASE_URL } from "@/app/lib/api-config"

const API_BASE_URL = NEXT_BASE_URL;

export async function fetchAllAccounts(): Promise<Account[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/accounts`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }
    
    return response.json();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch accounts data.');
  }
}

export async function fetchAccountById(id: number): Promise<Account | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/accounts/${id}`, {
      cache: 'no-store',
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

export async function fetchFilteredAccounts(query: string): Promise<Account[]> {
  try {
    const accounts = await fetchAllAccounts();
    return accounts;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered accounts.');
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


export async function createAccount(accountData: AccountForm): Promise<Account> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          ...accountData,
          birthDay: new Date(accountData.birthDay).toISOString(),
        }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create account');
    }
    
    return response.json();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create account.');
  }
}

export async function updateAccount(id: number, accountData: Account): Promise<Account> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/accounts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          ...accountData,
          birthDay: new Date(accountData.birthDay).toISOString(),
        }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update account');
    }
    
    return response.json();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update account.');
  }
}

export async function deleteAccount(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/accounts/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete account');
    }
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete account.');
  }
}