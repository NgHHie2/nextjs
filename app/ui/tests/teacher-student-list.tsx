// app/ui/tests/teacher-student-list.tsx

"use client";

import React from "react";
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
import { Check, Circle, Users, X } from "lucide-react";
import { Account } from "@/app/lib/definitions";
import { TestStatus, TestRoomUpdate } from "@/app/lib/websocket/test-socket";

interface TeacherStudentListProps {
  semesterAccounts: Account[];
  waitingRoom: TestRoomUpdate | null;
  submittedUsers: Map<number, number>;
}

export default function TeacherStudentList({
  semesterAccounts,
  waitingRoom,
  submittedUsers,
}: TeacherStudentListProps) {
  const getUserStatus = (accountId: number): TestStatus | null => {
    if (!waitingRoom) return null;

    const userInRoom = Array.from(waitingRoom.users).find(
      (u) => u.userId === accountId
    );

    return userInRoom?.status || null;
  };

  const getStatusBadge = (status: TestStatus | null) => {
    if (!status) {
      return <Badge variant="outline">Chưa vào</Badge>;
    }

    switch (status) {
      case TestStatus.WAITING:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Đang chờ</Badge>
        );
      case TestStatus.TESTING:
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Đang thi</Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách thi ({semesterAccounts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[5%]">STT</TableHead>
              <TableHead className="w-[30%]">Họ và tên</TableHead>
              <TableHead className="w-[15%]">CCCD</TableHead>
              <TableHead className="w-[20%] text-center">Trạng thái</TableHead>
              <TableHead className="w-[15%] text-center">Nộp bài</TableHead>
              <TableHead className="w-[15%] text-center">Điểm</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semesterAccounts.map((account, index) => {
              const status = getUserStatus(account.id);
              const hasSubmitted = submittedUsers.has(account.id);
              let score = null;
              if (hasSubmitted) score = submittedUsers.get(account.id);

              return (
                <TableRow key={account.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {account.lastName} {account.firstName}
                  </TableCell>
                  <TableCell>{account.cccd}</TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      {getStatusBadge(status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      {hasSubmitted ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="flex justify-center">{score}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
