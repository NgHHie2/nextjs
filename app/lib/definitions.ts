export type Account = {
  id: number;
  username: string;
  cccd: string;
  password?: string;
  firstName: string;
  lastName: string;
  birthDay: string;
  phoneNumber: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
};

export type AccountsPageResponse = {
  content: Account[];
  totalPages: number;
  totalElements: number;
};

export type AccountForm = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDay: string;
  phoneNumber: string;
  email: string;
  cccd: string;
};

export type Subject = {
  status: string;
  id: number;
  title: string;
  code: string;
  description: string;
  participations?: Participation[];
};

export type Participation = {
  id: number;
  account: Account;
  subject: Subject;
};

export type AccountStats = {
  totalAccounts: number;
  activeAccounts: number;
  newAccountsThisMonth: number;
};

export type SubjectWithParticipants = {
  id: number;
  title: string;
  code: string;
  description: string;
  participantCount: number;
  participants: Account[];
};

// For pagination
export type AccountTable = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  totalSubjects: number;
  activeSubjects: number;
};

export type SubjectsTable = {
  id: number;
  title: string;
  code: string;
  description: string;
  participantCount: number;
  createdAt: string;
  status: "active" | "inactive";
};

// Dashboard card data
export type DashboardCardData = {
  totalAccounts: number;
  totalSubjects: number;
  totalParticipations: number;
  activeSubjects: number;
};
