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
      throw new Error(errorData.message || "Failed to delete course");
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete course.");
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
