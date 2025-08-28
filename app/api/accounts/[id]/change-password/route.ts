import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/api-config";
import { forwardToBackend } from "@/app/lib/api-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;

    // Validate required fields
    if (!body.newPassword || !body.confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirm password are required" },
        { status: 400 }
      );
    }

    if (body.newPassword !== body.confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (body.newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const response = await forwardToBackend(
      request,
      `${API_BASE_URL}/account/change-password/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          newPassword: body.newPassword,
          confirmPassword: body.confirmPassword,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}
