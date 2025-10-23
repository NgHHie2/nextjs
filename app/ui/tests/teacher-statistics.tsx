"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { TestRoomUpdate } from "@/app/lib/websocket/test-socket";

interface TeacherStatisticsProps {
  waitingRoom: TestRoomUpdate | null;
}

export default function TeacherStatistics({
  waitingRoom,
}: TeacherStatisticsProps) {
  if (!waitingRoom) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Thống kê phòng thi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-background rounded-lg text-center">
            <div className="text-2xl font-bold">{waitingRoom.totalUsers}</div>
            <div className="text-sm text-muted-foreground">
              Đang trong phòng
            </div>
          </div>
          <div className="p-4 bg-background rounded-lg text-center">
            <div className="text-2xl font-bold">{waitingRoom.waitingCount}</div>
            <div className="text-sm text-muted-foreground">Đang chờ</div>
          </div>
          <div className="p-4 bg-background rounded-lg text-center">
            <div className="text-2xl font-bold">{waitingRoom.testingCount}</div>
            <div className="text-sm text-muted-foreground">Đang thi</div>
          </div>
          <div className="p-4 bg-background rounded-lg text-center">
            <div className="text-2xl font-bold">
              {waitingRoom.submittedCount}
            </div>
            <div className="text-sm text-muted-foreground">Đã nộp</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
