export type Course = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  semesterDocuments: SemesterDocument[];
  semesterAccounts: SemesterAccount[];
  semesterTeachers: SemesterTeacher[];
  createdAt: string;
  createdBy: number;
  totalAccounts?: number;
  totalDocuments?: number;
};

export type SemesterDocument = {
  id: number;
  document: Document;
};

export type SemesterAccount = {
  id: number;
  accountId: number;
  position: Position;
};

export type SemesterTeacher = {
  id: number;
  teacherId: number;
};

export type CoursesPageResponse = {
  content: Course[];
  totalPages: number;
  totalElements: number;
};

export type Document = {
  id: number;
  name: string;
  code: string;
  documentNumber: string;
  format: "PDF" | "VIDEO";
  description: string;
  size: number;
  pages: number;
  minutes: number;
  catalogs: Catalog[];
  tags: Tag[];
};

export type Tag = {
  id: number;
  name: string;
};

export type Catalog = {
  id: number;
  position: Position;
};

export type DocumentsPageResponse = {
  content: Document[];
  totalPages: number;
  totalElements: number;
};

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
  role: "ADMIN" | "TEACHER" | "STUDENT" | "";
};

export type AccountsPageResponse = {
  content: Account[];
  totalPages: number;
  totalElements: number;
};

export type AccountForm = {
  // username: string;
  // password: string;
  firstName: string;
  lastName: string;
  // birthDay: string;
  // phoneNumber: string;
  // email: string;
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

export type Position = {
  id: number;
  name: string;
  description?: string;
};

export interface SidebarUserInfoProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface JwtPayload {
  sub: string;
  userId: number;
  cccd: string;
  role: "ADMIN" | "TEACHER" | "STUDENT" | "";
  jti: string;
  iat: number;
  exp: number;
}

export type SubmittedStudents = {
  userId: number;
  score: number;
};
