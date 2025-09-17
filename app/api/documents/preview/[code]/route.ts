import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/api-config";
import { forwardToBackend } from "@/app/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const documentCode = code;

    const response = await forwardToBackend(
      request,
      `${API_BASE_URL}/document/preview/${documentCode}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch preview" },
        { status: response.status }
      );
    }

    // Get the image bytes and content type
    const imageBytes = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Return the image directly
    return new NextResponse(imageBytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error fetching document preview:", error);
    return NextResponse.json(
      { error: "Failed to fetch document preview" },
      { status: 500 }
    );
  }
}
