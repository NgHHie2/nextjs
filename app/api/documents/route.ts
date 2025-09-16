// app/api/documents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/api-config";
import { forwardToBackend } from "@/app/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Build query parameters for backend
    const backendParams = new URLSearchParams();

    const keyword = searchParams.get("keyword");
    const format = searchParams.get("format");
    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "10";
    const sortBy = searchParams.get("sortBy");
    const sortDir = searchParams.get("sortDir");

    if (keyword) backendParams.set("keyword", keyword);
    if (format && format !== "all") backendParams.set("format", format);
    if (sortBy) backendParams.set("sort", `${sortBy},${sortDir || "asc"}`);
    backendParams.set("page", page);
    backendParams.set("size", size);

    const queryString = backendParams.toString();
    const backendUrl = `${API_BASE_URL}/document/search${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await forwardToBackend(request, backendUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
