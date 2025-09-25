// app/api/courses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/api-config";
import { forwardToBackend } from "@/app/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Build query parameters for backend
    const backendParams = new URLSearchParams();

    const keyword = searchParams.get("keyword");
    const startYear = searchParams.get("startYear"); // Frontend gửi startYear
    const endYear = searchParams.get("endYear"); // Frontend gửi endYear
    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "10";
    const sortBy = searchParams.get("sortBy");
    const sortDir = searchParams.get("sortDir");

    // Map parameters correctly to backend
    if (keyword) backendParams.set("keyword", keyword);
    if (startYear) backendParams.set("startYear", startYear); // Backend cũng expect startYear
    if (endYear) backendParams.set("endYear", endYear); // Backend cũng expect endYear
    if (sortBy) backendParams.set("sort", `${sortBy},${sortDir || "asc"}`);
    backendParams.set("page", page);
    backendParams.set("size", size);

    const queryString = backendParams.toString();
    const backendUrl = `${API_BASE_URL}/semester/search${
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
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await forwardToBackend(
      request,
      `${API_BASE_URL}/semester`,
      {
        method: "POST",
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
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
