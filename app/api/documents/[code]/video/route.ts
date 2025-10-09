// app/api/documents/[code]/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/api-config";
import { forwardToBackend } from "@/app/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const fileCode = code;

    const rangeHeader = request.headers.get("range") || undefined;

    const response = await forwardToBackend(
      request,
      `${API_BASE_URL}/document/stream/${fileCode}`,
      {
        method: "GET",
        headers: {
          ...(rangeHeader ? { Range: rangeHeader } : {}),
        },
      }
    );

    if (!response.ok && response.status !== 206) {
      return NextResponse.json(
        { error: "Failed to fetch document" },
        { status: response.status }
      );
    }

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}
