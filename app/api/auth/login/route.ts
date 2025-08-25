import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/api-config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to backend
    const response = await fetch(`${API_BASE_URL}/account/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Create NextResponse with same status and data
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });

    // Forward all Set-Cookie headers
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        nextResponse.headers.set(key, value);
      }
    });

    return nextResponse;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
