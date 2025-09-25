// app/api/accounts/bulk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/api-config";
import { forwardToBackend } from "@/app/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get IDs from query parameters (e.g., ?ids=1,2,3,4 or ?ids=1&ids=2&ids=3)
    const idsParam = searchParams.get("ids");
    let accountIds: string[] = [];

    if (idsParam) {
      // Handle comma-separated IDs
      accountIds = idsParam
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id);
    } else {
      // Handle multiple ids parameters
      accountIds = searchParams.getAll("ids").filter((id) => id.trim());
    }

    // Validate input
    if (accountIds.length === 0) {
      return NextResponse.json({ accounts: [] });
    }

    // Remove duplicates and filter out invalid IDs
    const uniqueIds = [...new Set(accountIds)].filter(
      (id) => id != null && !isNaN(Number(id))
    );

    if (uniqueIds.length === 0) {
      return NextResponse.json({ accounts: [] });
    }

    // Create query parameters for each ID
    const queryParams = uniqueIds.map((id) => `ids=${id}`).join("&");
    const backendUrl = `${API_BASE_URL}/account/bulk?${queryParams}`;

    const response = await forwardToBackend(request, backendUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      // If backend API fails, return empty array instead of throwing error
      console.warn("Failed to fetch accounts from backend:", response.status);
      return NextResponse.json({ accounts: [] });
    }

    const data = await response.json();
    return NextResponse.json({ accounts: data });
  } catch (error) {
    console.error("Error fetching multiple accounts:", error);
    // Return empty array on error instead of 500, so the table can still render
    return NextResponse.json({ accounts: [] });
  }
}
