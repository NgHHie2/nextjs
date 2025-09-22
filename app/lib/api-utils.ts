import { NextRequest } from "next/server";

/**
 * Tạo headers để forward từ Next.js API đến backend
 * Bao gồm JWT cookie và custom headers
 */
export function createForwardHeaders(
  request: NextRequest,
  isFormData: boolean = false
): Record<string, string> {
  const headers: Record<string, string> = {};

  // Chỉ set Content-Type nếu không phải FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Forward cookies (bao gồm JWT)
  const cookie = request.headers.get("cookie");
  if (cookie) {
    headers["Cookie"] = cookie;
  }

  // Forward Authorization header (nếu có)
  const authorization = request.headers.get("authorization");
  if (authorization) {
    headers["Authorization"] = authorization;
  }

  // Forward các custom headers khác nếu cần
  const customHeaders = [
    "x-api-key",
    "x-client-id",
    "x-user-agent",
    "x-forwarded-for",
  ];

  customHeaders.forEach((headerName) => {
    const value = request.headers.get(headerName);
    if (value) {
      headers[headerName] = value;
    }
  });

  return headers;
}

/**
 * Helper function để gọi backend API với proper headers
 */
export async function forwardToBackend(
  request: NextRequest,
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const { headers: optionsHeaders, body, ...otherOptions } = options;

  // Detect if body is FormData
  const isFormData = body instanceof FormData;

  return fetch(endpoint, {
    ...otherOptions,
    body,
    headers: {
      ...createForwardHeaders(request, isFormData),
      ...optionsHeaders,
    },
  });
}
