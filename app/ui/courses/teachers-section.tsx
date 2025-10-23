"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { Button } from "@/components/ui/button";
import { Users, Eye, ChevronDown, GraduationCap } from "lucide-react";
import { Account, SemesterTeacher } from "@/app/lib/definitions";
import AssignTeacherDialog from "./assign-teacher-dialog";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/lib/auth/auth-context";
import { DeleteTeacherFromSemesterButton } from "./buttons";

type TeachersSectionProps = {
  semesterTeachers: SemesterTeacher[];
  accountMap: Map<number, Account>;
  semesterId: number;
  role: string;
};

export default function TeachersSection({
  semesterTeachers,
  accountMap,
  semesterId,
  role,
}: TeachersSectionProps) {
  // const { isAdmin, isTeacher } = useAuth();
  const router = useRouter();

  const handleTeacherUpdate = () => {
    router.refresh();
  };

  const totalTeachers = semesterTeachers?.length || 0;
  const existingTeacherIds = semesterTeachers?.map((st) => st.teacherId) || [];

  return (
    <Collapsible className="group">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <CardTitle className="flex items-center gap-2 cursor-pointer">
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                <GraduationCap className="h-5 w-5" />
                Teachers ({totalTeachers})
              </CardTitle>
            </CollapsibleTrigger>

            {role == "ADMIN" && (
              <AssignTeacherDialog
                semesterId={semesterId}
                existingTeacherIds={existingTeacherIds}
                onTeacherAssigned={handleTeacherUpdate}
              />
            )}
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent>
            {semesterTeachers && semesterTeachers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[37.5%]">Name</TableHead>
                    <TableHead className="w-[12.5%] text-center">
                      CCCD
                    </TableHead>
                    <TableHead className="w-[37.5%] text-center"></TableHead>
                    <TableHead className="w-[12.5%] text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {semesterTeachers.map((semAccount) => {
                    const account = accountMap.get(semAccount.teacherId);
                    return (
                      <TableRow key={semAccount.id}>
                        <TableCell className="font-medium">
                          {account
                            ? `${account.lastName} ${account.firstName}`
                            : "Unknown"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap justify-center">
                            {account ? account.cccd : "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap justify-center"></div>
                        </TableCell>

                        <TableCell>
                          {(role == "ADMIN" || role == "TEACHER") && (
                            <div className="flex justify-center flex-wrap gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <DeleteTeacherFromSemesterButton
                                id={semesterId}
                                teacherId={semAccount.teacherId}
                              />
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No teachers in this course.
                </p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
