// app/dashboard/courses/[id]/test/[testId]/page.tsx
import { fetchSemesterTestById } from "@/app/lib/data/server-test-data";
import { fetchCurrentUser } from "@/app/lib/data/server-auth-data";
import { fetchCourseById } from "@/app/lib/data/server-course-data";
import { fetchAccountsByIds } from "@/app/lib/data/server-account-data";
import { notFound, redirect } from "next/navigation";
import StudentTestClient from "@/app/ui/tests/student-test-client";
import TeacherTestClient from "@/app/ui/tests/teacher-test-client";
import { Account } from "@/app/lib/definitions";

export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string; testId: string }>;
}) {
  const { id, testId } = await params;
  const courseId = parseInt(id);
  const semesterTestId = parseInt(testId);

  const [testData, currentUser, course] = await Promise.all([
    fetchSemesterTestById(semesterTestId),
    fetchCurrentUser(),
    fetchCourseById(courseId),
  ]);

  if (!currentUser) {
    redirect("/login");
  }

  if (!testData || !course) {
    notFound();
  }

  // Nếu là TEACHER hoặc ADMIN, lấy danh sách học sinh
  if (currentUser.role === "TEACHER" || currentUser.role === "ADMIN") {
    // Lấy danh sách accountId từ semesterAccounts
    const accountIds = course.semesterAccounts?.map((sa) => sa.accountId) || [];

    // Fetch thông tin chi tiết accounts
    let accounts: Account[] = [];
    if (accountIds.length > 0) {
      accounts = await fetchAccountsByIds(accountIds);
    }

    return (
      <TeacherTestClient
        testData={testData}
        user={currentUser}
        semesterAccounts={accounts}
      />
    );
  }

  // Fallback
  redirect("/dashboard");
}
