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
      <div className="flex-1 rounded-lg bg-muted px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl text-foreground`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-foreground"
              htmlFor="email"
            >
              Username
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-border bg-background py-[9px] pl-10 text-sm outline-2 placeholder:text-muted-foreground text-foreground focus:border-primary focus:outline-primary"
                id="email"
                type="text"
                name="email"
                placeholder="Enter your username"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground peer-focus:text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-foreground"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-border bg-background py-[9px] pl-10 text-sm outline-2 placeholder:text-muted-foreground text-foreground focus:border-primary focus:outline-primary"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground peer-focus:text-primary" />
            </div>
          </div>
        </div>
        <Button className="mt-4 w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-primary-foreground" />
        </Button>
        {error && (
          <div className="flex items-center space-x-1 mt-2">
            <ExclamationCircleIcon className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>
    </form>
  );
}
