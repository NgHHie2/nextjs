// app/api/documents/[code]/catalogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/api-config";
import { forwardToBackend } from "@/app/lib/api-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const documentCode = code;
    const body = await request.json();

    const response = await forwardToBackend(
      request,
      `${API_BASE_URL}/document/catalog/${documentCode}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating document catalogs:", error);
    return NextResponse.json(
      { error: "Failed to update document catalogs" },
      { status: 500 }
    );
  }
}
