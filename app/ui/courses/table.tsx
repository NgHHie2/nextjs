// app/ui/courses/table.tsx
import Link from "next/link";
import { Eye, Pencil, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Course, Account } from "@/app/lib/definitions";
import { fetchAllCourses } from "@/app/lib/data/server-course-data";
import { fetchAccountsByIds } from "@/app/lib/data/server-account-data";
import { DeleteCourseButton, EditCourseButton } from "@/app/ui/courses/buttons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SortableHeader from "@/app/ui/accounts/sortable-header";
import { jwtDecode } from "@/app/lib/auth/token-decode";

interface CoursesTableProps {
  query: string;
  currentPage?: number;
  currentSize?: number;
  startYear?: number;
  endYear?: number;
  sortBy?: string;
  sortDir?: string;
}

export default async function CoursesTable({
  query,
  currentPage = 1,
  currentSize = 10,
  startYear,
  endYear,
  sortBy,
  sortDir,
}: CoursesTableProps) {
  const data = await fetchAllCourses(
    query,
    startYear,
    endYear,
    currentPage,
    currentSize,
    sortBy,
    sortDir
  );

  const currentUser = await jwtDecode();
  const currentUserRole = currentUser.role;

  // // Get unique creator IDs
  // const creatorIds = [
  //   ...new Set(data.content.map((course) => course.createdBy)),
  // ].filter((id) => id != null);

  // // Fetch creator information
  // let creators: Account[] = [];
  // try {
  //   creators = await fetchAccountsByIds(creatorIds);
  // } catch (error) {
  //   console.warn("Failed to fetch creator information:", error);
  //   // creators will remain empty array, so we'll show "-" for creator names
  // }

  // // Create a map for quick lookup
  // const creatorMap = new Map(
  //   creators.map((creator) => [
  //     creator.id,
  //     `${creator.lastName} ${creator.firstName}`,
  //   ])
  // );

  if (data.content.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No courses found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/50">
              <TableHead className="font-semibold text-foreground">
                <SortableHeader
                  field="stt"
                  currentSort={sortBy}
                  currentDir={sortDir}
                >
                  STT
                </SortableHeader>
              </TableHead>
              <TableHead className="min-w-[250px] max-w-[350px] font-semibold text-foreground">
                <SortableHeader
                  field="name"
                  currentSort={sortBy}
                  currentDir={sortDir}
                >
                  Name
                </SortableHeader>
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                <SortableHeader
                  field="startDate"
                  currentSort={sortBy}
                  currentDir={sortDir}
                >
                  Start
                </SortableHeader>
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                <SortableHeader
                  field="endDate"
                  currentSort={sortBy}
                  currentDir={sortDir}
                >
                  End
                </SortableHeader>
              </TableHead>

              {/* <TableHead className="min-w-[200px] font-semibold text-foreground">
                <SortableHeader
                  field="createdBy"
                  currentSort={sortBy}
                  currentDir={sortDir}
                >
                  Teacher
                </SortableHeader>
              </TableHead> */}
              <TableHead className="font-semibold text-foreground text-center">
                <SortableHeader
                  field="totalAccounts"
                  currentSort={sortBy}
                  currentDir={sortDir}
                >
                  Total accounts
                </SortableHeader>
              </TableHead>
              <TableHead className="font-semibold text-foreground text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.content.map((course, index) => (
              <TableRow
                key={course.id}
                className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
              >
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      {index + 1}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-semibold">{course.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {course.startDate ? (
                    <span className="text-sm">
                      {new Date(course.startDate).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {course.endDate ? (
                    <span className="text-sm">
                      {new Date(course.endDate).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>

                {/* <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {creatorMap.get(course.createdBy) || "-"}
                    </span>
                  </div>
                </TableCell> */}
                <TableCell className="font-medium text-center">
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {course.totalAccounts}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-center gap-1">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/courses/${course.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>

                    {currentUserRole == "ADMIN" && (
                      <EditCourseButton id={course.id} />
                    )}
                    {currentUserRole == "ADMIN" && (
                      <DeleteCourseButton id={course.id} />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
