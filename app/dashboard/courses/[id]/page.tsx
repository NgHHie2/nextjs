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

  // Get account IDs from semesterAccounts
  const accountIds = course.semesterAccounts?.map((sa) => sa.accountId) || [];

  // Fetch account information
  let accounts: Account[] = [];
  try {
    if (accountIds.length > 0) {
      accounts = await fetchAccountsByIds(accountIds);
    }
  } catch (error) {
    console.warn("Failed to fetch account information:", error);
  }

  // Create account map for quick lookup
  const accountMap = new Map(accounts.map((acc) => [acc.id, acc]));

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
            <CardTitle className="text-xl">Course Information</CardTitle>
            <Button asChild>
              <Link href={`/dashboard/courses/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Course
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500 font-medium block">
                  Course Name:
                </span>
                <span className="font-semibold">{course.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500 font-medium block">
                  Start Date:
                </span>
                <span>{formatDate(course.startDate)}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500 font-medium block">
                  End Date:
                </span>
                <span>{formatDate(course.endDate)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500 font-medium block">
                  Course ID:
                </span>
                <span>{course.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500 font-medium block">
                  Total Documents:
                </span>
                <span>{totalDocuments}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500 font-medium block">
                  Total Accounts:
                </span>
                <span>{totalAccounts}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DocumentsSection documents={course.semesterDocuments || []} />

      <AccountsSection
        semesterAccounts={course.semesterAccounts || []}
        accountMap={accountMap}
      />
    </main>
  );
}
