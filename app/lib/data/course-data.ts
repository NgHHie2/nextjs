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
