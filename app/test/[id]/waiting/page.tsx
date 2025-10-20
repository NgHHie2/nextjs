// app/test/[id]/waiting/page.tsx (Server Component)
import { fetchSemesterTestById } from "@/app/lib/data/server-test-data";
import { fetchCurrentUser } from "@/app/lib/data/server-auth-data";
import { notFound, redirect } from "next/navigation";
import TestWaitingClient from "@/app/ui/tests/waiting-client";

export default async function TestWaitingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testId = parseInt(id);

  const [testData, currentUser] = await Promise.all([
    fetchSemesterTestById(testId),
    fetchCurrentUser(),
  ]);

  if (!currentUser) {
    redirect("/login");
  }

  if (!testData) {
    notFound();
  }

  return <TestWaitingClient testData={testData} user={currentUser} />;
}
