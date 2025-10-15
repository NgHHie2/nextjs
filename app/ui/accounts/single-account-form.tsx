"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { createAccount } from "@/app/lib/data/account-data";
import { AccountForm } from "@/app/lib/definitions";

export default function SingleAccountForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountForm>({
    defaultValues: {
      cccd: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (data: AccountForm) => {
    setIsSubmitting(true);
    setError("");

    try {
      await createAccount(data);
      router.push("/dashboard/accounts");
      router.refresh();
    } catch (err) {
      console.error("Error creating account:", err);

      if (err instanceof Error) {
        try {
          // Nếu message là JSON dạng { field: "message" }
          const parsed = JSON.parse(err.message);
          if (typeof parsed === "object") {
            const firstError = Object.values(parsed)[0] as string;
            setError(firstError);
            return;
          }
        } catch {
          // Nếu không parse được, hiển thị message bình thường
          setError(
            err.message || "Failed to create account. Please try again."
          );
        }
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="border-0 shadow-none">
        <CardHeader className="p-0"></CardHeader>

        <CardContent className="space-y-2 p-0">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* CCCD */}
          <div className="space-y-2 mt-2">
            <Label htmlFor="cccd">CCCD *</Label>
            <Input
              id="cccd"
              placeholder="Enter CCCD"
              {...register("cccd", {
                required: "CCCD is required",
                minLength: {
                  value: 9,
                  message: "CCCD must be between 9 and 12 characters",
                },
                maxLength: {
                  value: 12,
                  message: "CCCD must be between 9 and 12 characters",
                },
              })}
              className={errors.cccd ? "border-primary" : ""}
            />
            {errors.cccd && (
              <p className="text-sm text-primary">{errors.cccd.message}</p>
            )}
          </div>

          {/* First Name + Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className={errors.firstName ? "border-primary" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-primary">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                {...register("lastName", {
                  required: "Last name is required",
                })}
                className={errors.lastName ? "border-primary" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-primary">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-4 p-0 mt-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/accounts">Cancel</Link>
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>Create Account</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
