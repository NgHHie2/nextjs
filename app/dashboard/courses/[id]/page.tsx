// app/dashboard/courses/[id]/page.tsx
import { fetchCourseById } from "@/app/lib/data/server-course-data";
import { fetchAccountsByIds } from "@/app/lib/data/server-account-data";
import { lusitana } from "@/app/ui/fonts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { Edit, Users, FileText, Eye } from "lucide-react";
import { Account } from "@/app/lib/definitions";
import DocumentsSection from "@/app/ui/courses/documents-section";
import AccountsSection from "@/app/ui/courses/accounts-section";
import TeachersSection from "@/app/ui/courses/teachers-section";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const course = await fetchCourseById(id);

  if (!course) {
    notFound();
  }

  // Gộp accountId từ semesterAccounts và semesterTeachers
  const accountIds = [
    ...(course.semesterAccounts?.map((sa) => sa.accountId) || []),
    ...(course.semesterTeachers?.map((st) => st.teacherId) || []),
  ];

  // Loại bỏ trùng lặp
  const uniqueAccountIds = Array.from(new Set(accountIds));

  // Fetch account information 1 lần
  let accounts: Account[] = [];
  try {
    if (uniqueAccountIds.length > 0) {
      accounts = await fetchAccountsByIds(uniqueAccountIds);
    }
  } catch (error) {
    console.warn("Failed to fetch account information:", error);
  }

  // Tạo map account cho lookup nhanh
  const accountMap = new Map(accounts.map((acc) => [acc.id, acc]));

  // Tách lại thành 2 map theo loại
  const semesterAccountMap = new Map<number, Account>(
    (course.semesterAccounts || []).map((sa) => [
      sa.accountId,
      accountMap.get(sa.accountId)!,
    ])
  );

  const semesterTeacherMap = new Map(
    (course.semesterTeachers || []).map((st) => [
      st.teacherId,
      accountMap.get(st.teacherId)!,
    ])
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const totalDocuments = course.semesterDocuments?.length || 0;
  const totalAccounts = course.semesterAccounts?.length || 0;

  return (
    <main className="space-y-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Courses", href: "/dashboard/courses/" },
          {
            label: "Course Details",
            href: `/dashboard/courses/${id}`,
          },
          {
            label: course.name,
            href: `/dashboard/courses/${id}#name`,
            active: true,
          },
        ]}
      />

      {/* Course Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Course Information</CardTitle>
            <Button size={"sm"} className="w-[140px]" asChild>
              <Link href={`/dashboard/courses/${id}/edit`}>
                <Edit className="h-4 w-4" />
                Edit Course
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500 text-sm font-medium block">
                  Course Name:
                </span>
                <span className="font-semibold text-sm">{course.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500 text-sm font-medium block">
                  Start Date:
                </span>
                <span className="font-semibold text-sm">
                  {formatDate(course.startDate)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500 text-sm font-medium block">
                  End Date:
                </span>
                <span className="font-semibold text-sm">
                  {formatDate(course.endDate)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500 text-sm font-medium block">
                  Course ID:
                </span>
                <span className="font-semibold text-sm">{course.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500 text-sm font-medium block">
                  Total Documents:
                </span>
                <span className="font-semibold text-sm">{totalDocuments}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500 text-sm font-medium block">
                  Total Accounts:
                </span>
                <span className="font-semibold text-sm">{totalAccounts}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TeachersSection
        semesterTeachers={course.semesterTeachers || []}
        accountMap={semesterTeacherMap}
        semesterId={course.id}
      />

      <DocumentsSection
        documents={course.semesterDocuments || []}
        semesterId={course.id}
      />

      <AccountsSection
        semesterAccounts={course.semesterAccounts || []}
        accountMap={semesterAccountMap}
        semesterId={course.id}
      />
    </main>
  );
}
