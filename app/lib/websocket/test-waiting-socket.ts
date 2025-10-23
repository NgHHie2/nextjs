// app/lib/websocket/test-waiting-socket.ts
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "../api-config";

export interface UserInfo {
  userId: number;
  fullName: string;
  cccd: string;
}

export interface WaitingRoomUpdate {
  semesterTestId: number;
  users: UserInfo[];
  totalUsers: number;
}

export class TestWaitingSocket {
  private client: Client | null = null;
  private semesterTestId: number;
  private userId: number;
  private fullName: string;
  private cccd: string;
  private onUpdateCallback?: (update: WaitingRoomUpdate) => void;

  constructor(
    semesterTestId: number,
    userId: number,
    fullName: string,
    cccd: string
  ) {
    this.semesterTestId = semesterTestId;
    this.userId = userId;
    this.fullName = fullName;
    this.cccd = cccd;
  }

  connect(onUpdate: (update: WaitingRoomUpdate) => void) {
    this.onUpdateCallback = onUpdate;

    // Kết nối qua Gateway
    const socket = new SockJS(`${API_BASE_URL}/ws/test-waiting`);

    this.client = new Client({
      webSocketFactory: () => socket as any,

      onConnect: () => {
        console.log("WebSocket connected");

        // Subscribe to room updates
        this.client?.subscribe(
          `/topic/test/${this.semesterTestId}/users`,
          (message: IMessage) => {
            const update: WaitingRoomUpdate = JSON.parse(message.body);
            this.onUpdateCallback?.(update);
          }
        );

        // Send join message
        this.client?.publish({
          destination: `/app/test/${this.semesterTestId}/join`,
          body: JSON.stringify({
            userId: this.userId,
            fullName: this.fullName,
            cccd: this.cccd,
          }),
        });
      },

      onDisconnect: () => {
        console.log("WebSocket disconnected");
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      // Send leave message
      this.client.publish({
        destination: `/app/test/${this.semesterTestId}/leave`,
        body: JSON.stringify({
          userId: this.userId,
        }),
      });

      this.client.deactivate();
      this.client = null;
    }
  }
}
