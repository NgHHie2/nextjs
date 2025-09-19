// app/api/positions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/api-config";
import { forwardToBackend } from "@/app/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Lấy danh sách id từ query string
    const ids = searchParams.getAll("id"); // trả về array string

    // Tạo query string cho backend
    const backendParams = new URLSearchParams();
    ids.forEach((id) => backendParams.append("id", id));

    const backendUrl = `${API_BASE_URL}/account/positions${
      backendParams.toString() ? `?${backendParams.toString()}` : ""
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
    console.error("Error fetching positions:", error);
    return NextResponse.json(
      { error: "Failed to fetch positions" },
      { status: 500 }
    );
  }
}
