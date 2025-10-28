// app/test/[id]/page.tsx
import {
  fetchSemesterTestById,
  fetchTestStatus,
} from "@/app/lib/data/server-test-data";
import { fetchCurrentUser } from "@/app/lib/data/server-auth-data";
import { fetchAccountsByIds } from "@/app/lib/data/server-account-data";
import { notFound, redirect } from "next/navigation";
import StudentTestClient from "@/app/ui/tests/student-test-client";
import TeacherTestClient from "@/app/ui/tests/teacher-test-client";

export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testId = parseInt(id);

  const [testData, currentUser, testStatus] = await Promise.all([
    fetchSemesterTestById(testId),
    fetchCurrentUser(),
    fetchTestStatus(testId),
  ]);

  if (!currentUser) {
    redirect("/login");
  }

  if (!testData || !testStatus) {
    notFound();
  }

  // Nếu là STUDENT, hiển thị màn hình student (gộp waiting + exam)
  if (currentUser.role === "STUDENT") {
    return (
      <StudentTestClient
        testData={testData}
        user={currentUser}
        initialTestStatus={testStatus}
      />
    );
  }

  // Fallback
  redirect("/dashboard");
}
