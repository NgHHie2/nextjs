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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Account } from "@/app/lib/definitions";
import { TestStatus, TestRoomUpdate } from "@/app/lib/websocket/test-socket";

interface TeacherStudentListProps {
  semesterAccounts: Account[];
  waitingRoom: TestRoomUpdate | null;
}

export default function TeacherStudentList({
  semesterAccounts,
  waitingRoom,
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
      case TestStatus.SUBMITTED:
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Đã nộp</Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách học sinh ({semesterAccounts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[5%]">STT</TableHead>
              <TableHead className="w-[35%]">Họ và tên</TableHead>
              <TableHead className="w-[20%]">CCCD</TableHead>
              <TableHead className="w-[20%]">Email</TableHead>
              <TableHead className="w-[20%] text-center">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semesterAccounts.map((account, index) => {
              const status = getUserStatus(account.id);
              return (
                <TableRow key={account.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {account.lastName} {account.firstName}
                    </div>
                  </TableCell>
                  <TableCell>{account.cccd}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      {getStatusBadge(status)}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
