import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/api-config";

export async function POST(request: NextRequest) {
  try {
    // Forward request to backend with all headers
    const response = await fetch(`${API_BASE_URL}/account/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward all cookies
        Cookie: request.headers.get("cookie") || "",
      },
    });

    const data = await response.json();

    // Create NextResponse with same status and data
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });

    // Forward all Set-Cookie headers (including cleared JWT)
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        nextResponse.headers.set(key, value);
      }
    });

    return nextResponse;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
