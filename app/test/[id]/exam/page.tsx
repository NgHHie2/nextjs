// app/test/[id]/exam/page.tsx
import { fetchCurrentUser } from "@/app/lib/data/server-auth-data";
import { redirect } from "next/navigation";
import ExamClient from "@/app/ui/tests/exam-client";

export default async function ExamPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ resultId?: string }>;
}) {
  const { id } = await params;
  const { resultId } = await searchParams;

  const currentUser = await fetchCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (!resultId) {
    redirect(`/test/${id}/waiting`);
  }

  return <ExamClient resultId={parseInt(resultId)} user={currentUser} />;
}
