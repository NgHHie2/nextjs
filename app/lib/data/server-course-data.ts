// app/lib/data/server-course-data.ts
import { cookies } from "next/headers";
import { Course, CoursesPageResponse } from "../definitions";
import { NEXT_BASE_URL } from "@/app/lib/api-config";

const API_BASE_URL = NEXT_BASE_URL;

// Helper function để tạo request với cookies forwarding đến Next.js API
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

export async function fetchAllCourses(
  query?: string,
  startYear?: number,
  endYear?: number,
  currentPage?: number,
  currentSize?: number,
  sortBy?: string,
  sortDir?: string
): Promise<CoursesPageResponse> {
  try {
    const params = new URLSearchParams();

    if (query) params.set("keyword", query);
    if (startYear) params.set("startYear", startYear.toString());
    if (endYear) params.set("endYear", endYear.toString());
    if (sortBy) params.set("sortBy", sortBy);
    if (sortDir) params.set("sortDir", sortDir);
    if (currentPage) params.set("page", (currentPage - 1).toString());
    if (currentSize) params.set("size", currentSize.toString());

    const queryString = params.toString();
    const url = `${API_BASE_URL}/api/courses${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await createRequestWithCookies(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    return await response.json();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch courses data.");
  }
}

export async function fetchCourseById(id: number): Promise<Course | null> {
  try {
    const response = await createRequestWithCookies(
      `${API_BASE_URL}/api/courses/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch course.");
  }
}
