import { Course } from "../definitions";
import { API_BASE_URL } from "@/app/lib/api-config";

export async function deleteCourse(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/semester/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete course");
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete course.");
  }
}

export async function deleteDocumentFromCourse(
  id: number,
  code: string
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/semester/${id}/documents/${code}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to unassign document");
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to unassign document.");
  }
}

export async function deleteAccountFromCourse(
  id: number,
  accountId: number
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/semester/${id}/accounts/${accountId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to unassign account");
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to unassign account.");
  }
}

// Assign documents to course
export async function assignDocumentsToCourse(
  semesterId: number,
  documentCodes: string[]
): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/semester/${semesterId}/documents`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          documentCodes,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to assign documents to course"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Assign Error:", error);
    throw error;
  }
}

// Assign accounts to course
export async function assignAccountsToCourse(
  semesterId: number,
  accountAssignments: { accountId: number; positionId: number }[]
): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/semester/${semesterId}/accounts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          accountAssignments,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to assign accounts to course"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Assign Error:", error);
    throw error;
  }
}

// Search account by username or CCCD
export async function searchAccountByCccd(cccd: string): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/account/cccd/${encodeURIComponent(cccd)}`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("No accounts found");
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to search accounts");
    }

    const data = await response.json();
    // Assuming the response has a content array
    return data.content || data;
  } catch (error) {
    console.error("Search Error:", error);
    throw error;
  }
}

export async function updateCourse(
  semesterId: number,
  courseData: {
    name: string;
    startDate: string;
    endDate: string;
    description?: string;
  }
): Promise<Course> {
  try {
    const response = await fetch(`${API_BASE_URL}/semester/${semesterId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: courseData.name,
        startDate: new Date(courseData.startDate).toISOString(),
        endDate: new Date(courseData.endDate).toISOString(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update course");
    }

    return response.json();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update course.");
  }
}

export async function createCourse(courseData: {
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
}): Promise<Course> {
  try {
    const response = await fetch(`${API_BASE_URL}/semester`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: courseData.name,
        startDate: new Date(courseData.startDate).toISOString(),
        endDate: new Date(courseData.endDate).toISOString(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create course");
    }

    return response.json();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create course.");
  }
}
