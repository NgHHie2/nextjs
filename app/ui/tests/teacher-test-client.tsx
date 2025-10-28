// app/ui/tests/teacher-test-client.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Account, SubmittedStudents } from "@/app/lib/definitions";
import { SemesterTest } from "@/app/lib/data/server-test-data";
import { openTest } from "@/app/lib/data/test-data";
import TeacherTestInfo from "./teacher-test-info";
import TeacherStatistics from "./teacher-statistics";
import TeacherStudentList from "./teacher-student-list";
import {
  TestSocket,
  TestRoomUpdate,
  TestSubmittedEvent,
} from "@/app/lib/websocket/test-socket";

interface Props {
  testData: SemesterTest;
  user: Account;
  semesterAccounts: Account[];
  initialSubmittedUsers: SubmittedStudents[];
}

export default function TeacherTestClient({
  testData,
  user,
  semesterAccounts,
  initialSubmittedUsers,
}: Props) {
  const [isOpening, setIsOpening] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(testData.open || false);
  const [waitingRoom, setWaitingRoom] = useState<TestRoomUpdate | null>(null);
  const [submittedUsers, setSubmittedUsers] = useState<Map<number, number>>(
    new Map(initialSubmittedUsers.map((st) => [st.userId, st.score])) // ví dụ
  );
  const [socket, setSocket] = useState<TestSocket | null>(null);

  // Initialize WebSocket
  useEffect(() => {
    const ws = new TestSocket(
      testData.id,
      user.id,
      `${user.lastName} ${user.firstName}`,
      user.cccd,
      user.role
    );

    ws.connect(
      (update) => {
        setWaitingRoom(update);
      },
      undefined,
      (event: TestSubmittedEvent) => {
        setSubmittedUsers((prev) => {
          const newMap = new Map(prev);
          newMap.set(event.userId, event.score);
          return newMap;
        });
        console.log(`User ${event.userId} submitted with score ${event.score}`);
      }
    );

    setSocket(ws);

    return () => {
      ws.disconnect();
    };
  }, [testData.id, user]);

  const handleOpenTest = async () => {
    setIsOpening(true);
    try {
      const result = await openTest(testData.id);

      if (result.success) {
        setIsTestOpen(true);
        alert("Đã mở bài thi thành công!");
      } else {
        alert(result.message || "Không thể mở bài thi");
      }
    } catch (error) {
      console.error("Error opening test:", error);
      alert("Đã xảy ra lỗi khi mở bài thi");
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <TeacherTestInfo
        testData={testData}
        isTestOpen={isTestOpen}
        isOpening={isOpening}
        onOpenTest={handleOpenTest}
      />

      <TeacherStatistics
        waitingRoom={waitingRoom}
        submittedCount={submittedUsers.size}
      />

      <TeacherStudentList
        semesterAccounts={semesterAccounts}
        waitingRoom={waitingRoom}
        submittedUsers={submittedUsers}
      />
    </div>
  );
}
