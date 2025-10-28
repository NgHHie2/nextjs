// app/lib/data/server-test-data.ts
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/app/lib/api-config";
import { ResultDetailDTO } from "./test-data";
import { SubmittedStudents } from "../definitions";

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

export interface SemesterTest {
  id: number;
  startDate: string;
  endDate: string;
  name: string;
  open: boolean;
  test: {
    id: number;
    name: string;
    visible: boolean;
    position: {
      id: number;
      name: string;
    };
  };
}

export interface TestStatusResponse {
  semesterTestId: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  resultId: number | null;
  score: number | null;
}

// Call trực tiếp đến backend
export async function fetchSemesterTestById(
  semesterTestId: number
): Promise<SemesterTest | null> {
  try {
    const response = await createRequestWithCookies(
      `${API_BASE_URL}/semester/test/${semesterTestId}`,
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

export async function fetchSubmittedStudents(
  semesterTestId: number
): Promise<SubmittedStudents[]> {
  try {
    const response = await createRequestWithCookies(
      `${API_BASE_URL}/semester/test/${semesterTestId}/submitted-students`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export async function fetchTestStatus(
  semesterTestId: number
): Promise<TestStatusResponse | null> {
  try {
    const response = await createRequestWithCookies(
      `${API_BASE_URL}/semester/test/${semesterTestId}/status`,
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

export async function fetchResultDetail(
  resultId: number
): Promise<ResultDetailDTO | null> {
  try {
    const response = await createRequestWithCookies(
      `${API_BASE_URL}/semester/test/result/${resultId}`,
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
