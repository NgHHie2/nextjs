// app/lib/data/test-data.ts (Client-side)
import { API_BASE_URL } from "@/app/lib/api-config";

export interface StartTestResponse {
  success: boolean;
  resultId: number;
  message: string;
}

export async function startTest(
  semesterTestId: number
): Promise<StartTestResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/semester/test/${semesterTestId}/start`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to start test");
    }

    return await response.json();
  } catch (error) {
    console.error("Start Test Error:", error);
    throw error;
  }
}
