// app/dashboard/test/[id]/result/[resultId]/page.tsx

import {
  fetchSemesterTestById,
  fetchResultDetail,
} from "@/app/lib/data/server-test-data";
import { fetchCurrentUser } from "@/app/lib/data/server-auth-data";
import { fetchAccountById } from "@/app/lib/data/server-account-data";
import { notFound, redirect } from "next/navigation";
import ResultDetailView from "@/app/ui/tests/result-detail-view";

export default async function ResultDetailPage({
  params,
}: {
  params: Promise<{ id: string; resultId: string }>;
}) {
  const { id, resultId } = await params;
  const testId = parseInt(id);
  const resultIdNum = parseInt(resultId);

  const [testData, currentUser, resultDetail] = await Promise.all([
    fetchSemesterTestById(testId),
    fetchCurrentUser(),
    fetchResultDetail(resultIdNum),
  ]);

  if (!currentUser) {
    redirect("/login");
  }

  if (!testData || !resultDetail) {
    notFound();
  }

  // Kiểm tra quyền: Student chỉ xem được result của mình
  let studentAccount = null;
  if (currentUser.role === "STUDENT") {
    if (resultDetail.studentId !== currentUser.id) redirect("/dashboard");
    else studentAccount = await fetchCurrentUser();
  } else studentAccount = await fetchAccountById(resultDetail.studentId);

  if (!studentAccount) {
    notFound();
  }

  return (
    <ResultDetailView
      testData={testData}
      resultDetail={resultDetail}
      user={studentAccount}
    />
  );
}
