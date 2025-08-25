"use client";

import { lusitana } from "@/app/ui/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/lib/api-config";

export default function LoginForm() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const username = formData.get("email") as string; // Backend expect username
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username, // Backend sử dụng username thay vì email
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);

        // Lưu user info vào localStorage
        if (data.userId && data.username) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: data.userId,
              username: data.username,
            })
          );
        }

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
    }

    setIsLoading(false);
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Username
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="text"
                name="email"
                placeholder="Enter your username"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <Button className="mt-4 w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        {error && (
          <div className="flex items-center space-x-1 mt-2">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Test credentials info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-600 font-medium">Test Account:</p>
          <p className="text-sm text-blue-600">Username: admin</p>
          <p className="text-sm text-blue-600">Password: password</p>
        </div>
      </div>
    </form>
  );
}
