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
    const documentCode = code;

    const response = await forwardToBackend(
      request,
      `${API_BASE_URL}/document/download/${documentCode}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch document" },
        { status: response.status }
      );
    }

    // Get the PDF bytes and content type
    const pdfBytes = await response.arrayBuffer();
    const contentType =
      response.headers.get("content-type") || "application/pdf";
    const contentDisposition = response.headers.get("content-disposition");

    // Return the PDF directly for viewing in browser
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline", // inline để xem trong browser, không download
        "Cache-Control": "private, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}
