// app/api/documents/[code]/detail/route.ts
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/api-config";
import { forwardToBackend } from "@/app/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    const response = await forwardToBackend(
      request,
      `${API_BASE_URL}/document/${code}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching document detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch document detail" },
      { status: 500 }
    );
  }
}
