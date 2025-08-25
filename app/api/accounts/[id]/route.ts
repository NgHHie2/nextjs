import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/api-config";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const authToken = cookieStore.get("jwt")?.value;
    const response = await fetch(`${API_BASE_URL}/account/${id}`, {
      cache: "no-store",
      headers: {
        Cookie: `jwt=${authToken || ""}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch account");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const cookieStore = await cookies();
    const authToken = cookieStore.get("jwt")?.value;
    const response = await fetch(`${API_BASE_URL}/account/${id}`, {
      method: "PUT",
      headers: {
        Cookie: `jwt=${authToken || ""}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to update account");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const authToken = cookieStore.get("jwt")?.value;
    const response = await fetch(`${API_BASE_URL}/account/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: `jwt=${authToken || ""}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete account");
    }

    const message = await response.text();
    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
