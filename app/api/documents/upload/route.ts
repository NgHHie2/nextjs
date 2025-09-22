// app/api/documents/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/api-config";
import { forwardToBackend } from "@/app/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const response = await forwardToBackend(
      request,
      `${API_BASE_URL}/document/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}
