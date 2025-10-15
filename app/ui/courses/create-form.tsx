// app/ui/courses/create-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, X } from "lucide-react";
import { createCourse } from "@/app/lib/data/course-data";

interface CourseFormData {
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export default function CreateCourseForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CourseFormData>();

  const startDate = watch("startDate");

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      // Validate dates
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (end <= start) {
        setError("End date must be after start date");
        return;
      }

      await createCourse(data);
      router.push("/dashboard/courses");
      router.refresh();
    } catch (error) {
      console.error("Error creating course:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create course. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
          <CardDescription>
            Create a new course/semester. Fields marked with * are required.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Course Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Course Name *</Label>
            <Input
              id="name"
              {...register("name", {
                required: "Course name is required",
                minLength: {
                  value: 3,
                  message: "Course name must be at least 3 characters",
                },
                maxLength: {
                  value: 200,
                  message: "Course name must not exceed 200 characters",
                },
              })}
              placeholder="Enter course name (e.g., Toán học, Văn học)"
              className={errors.name ? "border-primary" : ""}
            />
            {errors.name && (
              <p className="text-sm text-primary">{errors.name.message}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate", {
                  required: "Start date is required",
                })}
                className={errors.startDate ? "border-primary" : ""}
              />
              {errors.startDate && (
                <p className="text-sm text-primary">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate", {
                  required: "End date is required",
                })}
                min={startDate}
                className={errors.endDate ? "border-primary" : ""}
              />
              {errors.endDate && (
                <p className="text-sm text-primary">{errors.endDate.message}</p>
              )}
              {startDate && (
                <p className="text-xs text-muted-foreground">
                  End date must be after{" "}
                  {new Date(startDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/courses">Cancel</Link>
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>Create Course</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
