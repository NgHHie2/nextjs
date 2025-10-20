// app/lib/data/server-test-data.ts
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/app/lib/api-config";

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
