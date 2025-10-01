// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Lấy auth token từ cookie
  const authToken = request.cookies.get("jwt");
  const isAuthenticated = !!authToken;

  const { pathname } = request.nextUrl;

  // Nếu đã đăng nhập và đang ở trang login hoặc trang chủ
  if (isAuthenticated && (pathname === "/login" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Nếu chưa đăng nhập và đang cố truy cập dashboard
  if (!isAuthenticated && !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Cấu hình routes áp dụng middleware
export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
