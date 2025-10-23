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

export interface Answer {
  answerIndex: number;
  answerText: string;
}

export interface QuestionResponse {
  questionIndex: number;
  questionText: string;
  answers: Answer[];
  selectedAnswers: number[];
  flagged: boolean;
}

export interface EndTestResponse {
  success: boolean;
  resultId: number;
  score: number;
  message: string;
}

export interface QuestionOverview {
  questionIndex: number;
  questionText: string;
  answers: Answer[];
}

export interface StudentAnswer {
  flagged: boolean;
  selectedAnswers: number[];
}

export interface ResultDetailDTO {
  id: number;
  studentId: number;
  startDateTime: string;
  submitDateTime: string | null;
  score: number | null;
  detailTest: {
    endDate: string;
    testName: string;
    questions: QuestionOverview[];
    startDate: string;
    semesterTestName: string;
  };
  studentAnswers: Record<string, StudentAnswer>;
  trueAnswers: any;
  minutes: number;
}

export async function getQuestion(
  resultId: number,
  questionIndex: number
): Promise<QuestionResponse> {
  const response = await fetch(
    `${API_BASE_URL}/semester/test/result/${resultId}/question/${questionIndex}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get question");
  }

  return await response.json();
}

export async function selectAnswer(
  resultId: number,
  questionIndex: number,
  answerIndices: number[]
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(
    `${API_BASE_URL}/semester/test/result/${resultId}/question/${questionIndex}/answer`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answerIndices }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to select answer");
  }

  return await response.json();
}

export async function flagQuestion(
  resultId: number,
  questionIndex: number,
  flagged: boolean
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(
    `${API_BASE_URL}/semester/test/result/${resultId}/question/${questionIndex}/flag?flagged=${flagged}`,
    {
      method: "PUT",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to flag question");
  }

  return await response.json();
}

export async function endTest(resultId: number): Promise<EndTestResponse> {
  const response = await fetch(
    `${API_BASE_URL}/semester/test/${resultId}/end`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to end test");
  }

  return await response.json();
}

export async function getResultDetail(
  resultId: number
): Promise<ResultDetailDTO> {
  const response = await fetch(
    `${API_BASE_URL}/semester/test/result/${resultId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get result detail");
  }

  return await response.json();
}

export async function openTest(
  semesterTestId: number
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/semester/test/${semesterTestId}/open`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to open test");
    }

    return await response.json();
  } catch (error) {
    console.error("Open Test Error:", error);
    throw error;
  }
}
