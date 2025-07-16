import { Account, Subject, Participation, AccountStats, SubjectsTable, AccountsTable, DashboardCardData } from './definitions';

const API_BASE_URL = 'http://localhost:8080';

// Account functions
export async function fetchAllAccounts(): Promise<Account[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/account`, {
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
    const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
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

export async function fetchFilteredAccounts(query: string): Promise<AccountsTable[]> {
  try {
    const accounts = await fetchAllAccounts();
    
    // Filter accounts based on query
    const filteredAccounts = accounts.filter(account =>
      account.username.toLowerCase().includes(query.toLowerCase()) ||
      account.firstName.toLowerCase().includes(query.toLowerCase()) ||
      account.lastName.toLowerCase().includes(query.toLowerCase()) ||
      account.email.toLowerCase().includes(query.toLowerCase())
    );
    
    // Transform to AccountsTable format
    const accountsTable: AccountsTable[] = await Promise.all(
      filteredAccounts.map(async (account) => {
        const participations = await fetchParticipationsByAccount(account.id);
        
        return {
          id: account.id,
          username: account.username,
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          phoneNumber: account.phoneNumber,
          totalSubjects: participations.length,
          activeSubjects: participations.length, // Assume all are active for now
        };
      })
    );
    
    return accountsTable;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered accounts.');
  }
}

// Subject functions
export async function fetchSubjectById(id: number): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch subject');
    }
    
    return response.json();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch subject.');
  }
}

export async function fetchFilteredSubjects(query: string): Promise<SubjectsTable[]> {
  try {
    // Since we don't have a direct subjects list endpoint, we'll need to mock this
    // or create a new endpoint. For now, let's return mock data
    const mockSubjects: SubjectsTable[] = [
      {
        id: 1,
        title: 'Mathematics',
        code: 'MATH101',
        description: 'Basic Mathematics',
        participantCount: 25,
        createdAt: '2023-01-01',
        status: 'active',
      },
      {
        id: 2,
        title: 'Physics',
        code: 'PHYS101',
        description: 'Introduction to Physics',
        participantCount: 18,
        createdAt: '2023-01-02',
        status: 'active',
      },
    ];
    
    return mockSubjects.filter(subject =>
      subject.title.toLowerCase().includes(query.toLowerCase()) ||
      subject.code.toLowerCase().includes(query.toLowerCase()) ||
      subject.description.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch subjects.');
  }
}

export async function fetchSubjectsPages(query: string): Promise<number> {
  try {
    const subjects = await fetchFilteredSubjects(query);
    return Math.ceil(subjects.length / 6); // 6 items per page
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch subjects pages.');
  }
}

// Participation functions
export async function fetchParticipationsByAccount(accountId: number): Promise<Participation[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/participations/account/${accountId}`, {
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

// Dashboard functions
export async function fetchDashboardData(): Promise<DashboardCardData> {
  try {
    const [accountsResponse, statsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/accounts`, { cache: 'no-store' }),
      fetch(`${API_BASE_URL}/stats`, { cache: 'no-store' })
    ]);
    
    const accounts = accountsResponse.ok ? await accountsResponse.json() : [];
    const stats = statsResponse.ok ? await statsResponse.json() : {};
    
    // Calculate participations from all accounts
    let totalParticipations = 0;
    for (const account of accounts) {
      const participations = await fetchParticipationsByAccount(account.id);
      totalParticipations += participations.length;
    }
    
    return {
      totalAccounts: accounts.length,
      totalSubjects: 10, // Mock data - should be fetched from backend
      totalParticipations,
      activeSubjects: 8, // Mock data
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch dashboard data.');
  }
}

// Latest activities (replacing latest invoices)
export async function fetchLatestActivities() {
  try {
    const accounts = await fetchAllAccounts();
    
    // Get latest 5 accounts with their participations
    const latestActivities = await Promise.all(
      accounts.slice(0, 5).map(async (account) => {
        const participations = await fetchParticipationsByAccount(account.id);
        
        return {
          id: account.id,
          name: `${account.firstName} ${account.lastName}`,
          email: account.email,
          image_url: '/customers/default-avatar.png', // Default avatar
          activity: `Joined ${participations.length} subject(s)`,
          amount: participations.length, // Number of subjects joined
        };
      })
    );
    
    return latestActivities;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch latest activities.');
  }
}

// Revenue chart (transformed to participation chart)
export async function fetchParticipationChart() {
  try {
    // Mock data for participation trends
    const participationData = [
      { month: 'Jan', participants: 15 },
      { month: 'Feb', participants: 20 },
      { month: 'Mar', participants: 18 },
      { month: 'Apr', participants: 25 },
      { month: 'May', participants: 22 },
      { month: 'Jun', participants: 28 },
      { month: 'Jul', participants: 30 },
      { month: 'Aug', participants: 27 },
      { month: 'Sep', participants: 32 },
      { month: 'Oct', participants: 35 },
      { month: 'Nov', participants: 38 },
      { month: 'Dec', participants: 40 },
    ];
    
    return participationData;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch participation chart data.');
  }
}

// Account operations
export async function createAccount(accountData: Omit<Account, 'id'>): Promise<Account> {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData),
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

export async function updateAccount(id: number, accountData: Partial<Account>): Promise<Account> {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData),
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
    const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
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