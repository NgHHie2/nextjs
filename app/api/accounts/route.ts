// app/api/accounts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/api-config";
import { forwardToBackend } from "@/app/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Build query parameters for backend
    const backendParams = new URLSearchParams();

    const keyword = searchParams.get("keyword");
    const role = searchParams.get("role");
    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "10";
    const sortBy = searchParams.get("sortBy");
    const sortDir = searchParams.get("sortDir");

    if (keyword) backendParams.set("keyword", keyword);
    if (role && role !== "all") backendParams.set("role", role);
    if (sortBy) backendParams.set("sort", `${sortBy},${sortDir || "asc"}`);
    backendParams.set("page", page);
    backendParams.set("size", size);

    const queryString = backendParams.toString();
    const backendUrl = `${API_BASE_URL}/account/search${
      queryString ? `?${queryString}` : ""
    }`;

    // console.log(backendUrl);
    // console.log(sortBy);

    const response = await forwardToBackend(request, backendUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    // console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await forwardToBackend(
      request,
      `${API_BASE_URL}/account`,
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
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
