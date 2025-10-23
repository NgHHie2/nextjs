// app/lib/websocket/test-socket.ts
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "../api-config";

export enum TestStatus {
  WAITING = "WAITING",
  TESTING = "TESTING",
  SUBMITTED = "SUBMITTED",
}

export interface UserStatus {
  userId: number;
  fullName: string;
  cccd: string;
  status: TestStatus;
}

export interface TestRoomUpdate {
  semesterTestId: number;
  users: UserStatus[];
  totalUsers: number;
  waitingCount: number;
  testingCount: number;
  submittedCount: number;
}

export interface TestOpenedEvent {
  semesterTestId: number;
  opened: boolean;
}

export class TestSocket {
  private client: Client | null = null;
  private semesterTestId: number;
  private userId: number;
  private fullName: string;
  private cccd: string;
  private role: string;
  private onRoomUpdateCallback?: (update: TestRoomUpdate) => void;
  private onTestOpenedCallback?: (event: TestOpenedEvent) => void;

  constructor(
    semesterTestId: number,
    userId: number,
    fullName: string,
    cccd: string,
    role: string
  ) {
    this.semesterTestId = semesterTestId;
    this.userId = userId;
    this.fullName = fullName;
    this.cccd = cccd;
    this.role = role;
  }

  connect(
    onRoomUpdate: (update: TestRoomUpdate) => void,
    onTestOpened?: (event: TestOpenedEvent) => void
  ) {
    this.onRoomUpdateCallback = onRoomUpdate;
    this.onTestOpenedCallback = onTestOpened;

    const socket = new SockJS(`${API_BASE_URL}/ws/test-waiting`);

    this.client = new Client({
      webSocketFactory: () => socket as any,

      onConnect: () => {
        console.log("WebSocket connected");

        // Subscribe to room updates
        this.client?.subscribe(
          `/topic/test/${this.semesterTestId}/users`,
          (message: IMessage) => {
            const update: TestRoomUpdate = JSON.parse(message.body);
            this.onRoomUpdateCallback?.(update);
          }
        );

        // Subscribe to test opened events
        if (this.onTestOpenedCallback) {
          this.client?.subscribe(
            `/topic/test/${this.semesterTestId}/opened`,
            (message: IMessage) => {
              const event: TestOpenedEvent = JSON.parse(message.body);
              this.onTestOpenedCallback?.(event);
            }
          );
        }

        // Send join message
        this.role == "STUDENT" &&
          this.client?.publish({
            destination: `/app/test/${this.semesterTestId}/join`,
            body: JSON.stringify({
              userId: this.userId,
              fullName: this.fullName,
              cccd: this.cccd,
            }),
          });

        (this.role == "ADMIN" || this.role == "TEACHER") &&
          this.client?.publish({
            destination: `/app/test/${this.semesterTestId}/request-state`,
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
