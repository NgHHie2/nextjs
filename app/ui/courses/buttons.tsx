// app/ui/courses/buttons.tsx
"use client";

import { Edit, Pencil, PlusIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteAccountFromCourse,
  deleteCourse,
  deleteDocumentFromCourse,
  deleteTeacherFromCourse,
} from "@/app/lib/data/course-data";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/app/lib/auth/auth-context";

export function CreateCourseButton() {
  const { isAdmin } = useAuth();

  return (
    isAdmin && (
      <Button asChild>
        <Link href="/dashboard/courses/create">
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Course
        </Link>
      </Button>
    )
  );
}

export function DeleteCourseButton({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { isAdmin } = useAuth();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCourse(id);
      router.refresh();
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    isAdmin && (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
}

export function EditCourseButton({ id }: { id: number }) {
  const { isAdmin } = useAuth();
  return (
    isAdmin && (
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/dashboard/courses/${id}/edit`}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
    )
  );
}

export function EditCourseButton2({ id }: { id: number }) {
  const { isAdmin } = useAuth();
  return (
    isAdmin && (
      <Button size={"sm"} className="w-[140px]" asChild>
        <Link href={`/dashboard/courses/${id}/edit`}>
          <Edit className="h-4 w-4" />
          Edit Course
        </Link>
      </Button>
    )
  );
}

export function DeleteDocumentFromSemesterButton({
  id,
  code,
}: {
  id: number;
  code: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { isAdmin, isTeacher } = useAuth();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDocumentFromCourse(id, code);
      router.refresh();
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    (isAdmin || isTeacher) && (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
}

export function DeleteAccountFromSemesterButton({
  id,
  accountId,
}: {
  id: number;
  accountId: number;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { isTeacher, isAdmin } = useAuth();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAccountFromCourse(id, accountId);
      router.refresh();
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    (isAdmin || isTeacher) && (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
}

export function DeleteTeacherFromSemesterButton({
  id,
  teacherId,
}: {
  id: number;
  teacherId: number;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { isAdmin } = useAuth();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTeacherFromCourse(id, teacherId);
      router.refresh();
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    isAdmin && (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
}
