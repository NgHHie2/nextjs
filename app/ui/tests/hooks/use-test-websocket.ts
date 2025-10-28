// app/ui/tests/hooks/use-test-websocket.ts

import { useState, useEffect } from "react";
import { Account } from "@/app/lib/definitions";
import { SemesterTest } from "@/app/lib/data/server-test-data";
import {
  TestSocket,
  TestRoomUpdate,
  TestOpenedEvent,
} from "@/app/lib/websocket/test-socket";

interface UseTestWebSocketProps {
  testData: SemesterTest;
  user: Account;
  isCompleted: boolean;
  onTestOpened?: (opened: boolean) => void;
}

export default function useTestWebSocket({
  testData,
  user,
  isCompleted,
  onTestOpened,
}: UseTestWebSocketProps) {
  const [waitingRoom, setWaitingRoom] = useState<TestRoomUpdate | null>(null);
  const [socket, setSocket] = useState<TestSocket | null>(null);

  useEffect(() => {
    // Không tạo socket nếu đã completed
    if (isCompleted) {
      return;
    }

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
      (event: TestOpenedEvent) => {
        onTestOpened?.(event.opened);
      }
    );

    setSocket(ws);

    return () => {
      ws.disconnect();
    };
  }, [testData.id, user, isCompleted]);

  return { waitingRoom, socket };
}
