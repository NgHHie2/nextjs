"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, Award, AlertCircle, Users } from "lucide-react";
import { SemesterTest } from "@/app/lib/data/server-test-data";
import { TestRoomUpdate } from "@/app/lib/websocket/test-socket";

interface StudentWaitingViewProps {
  testData: SemesterTest;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null;
  testStatus: "upcoming" | "ongoing" | "ended";
  isTestOpen: boolean;
  canStart: boolean;
  isStarting: boolean;
  waitingRoom: TestRoomUpdate | null;
  onStartTest: () => void;
}

export default function StudentWaitingView({
  testData,
  countdown,
  testStatus,
  isTestOpen,
  canStart,
  isStarting,
  waitingRoom,
  onStartTest,
}: StudentWaitingViewProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col items-center justify-center pt-8">
          <h1 className="text-3xl font-bold">{testData.name}</h1>
          {testStatus === "ongoing" && (
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <p className="text-sm text-green-800 dark:text-green-300">
                Bài thi đang diễn ra
              </p>
            </div>
          )}
        </div>

        <div className="p-8 space-y-6">
          {/* Test Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Thời gian bắt đầu
                </p>
                <p className="font-semibold text-foreground">
                  {formatDate(testData.startDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
              <Clock className="w-5 h-5" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Thời gian kết thúc
                </p>
                <p className="font-semibold text-foreground">
                  {formatDate(testData.endDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
            <Award className="w-5 h-5 text-accent-foreground" />
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Đối tượng thi
              </p>
              <p className="font-semibold text-foreground">
                {testData.test.position.name}
              </p>
            </div>
          </div>

          {/* Countdown */}
          {testStatus === "upcoming" && countdown && (
            <div className="bg-background rounded-lg p-4">
              <p className="text-sm mb-4 text-center">
                Thời gian còn lại đến khi bắt đầu:
              </p>

              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Ngày", value: countdown.days },
                  { label: "Giờ", value: countdown.hours },
                  { label: "Phút", value: countdown.minutes },
                  { label: "Giây", value: countdown.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-card rounded-lg p-4 text-center"
                  >
                    <div className="text-3xl font-bold">
                      {item.value.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alert Messages */}
          {testStatus === "ended" && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <p className="font-semibold text-red-800 dark:text-red-300">
                  Bài thi đã kết thúc
                </p>
              </div>
            </div>
          )}

          {testStatus === "ongoing" && !isTestOpen && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                  Giám thị chưa mở bài thi. Vui lòng chờ...
                </p>
              </div>
            </div>
          )}

          {/* Start Button */}
          <Button
            onClick={onStartTest}
            disabled={!canStart || isStarting}
            className="w-full h-12 bg-primary text-primary-foreground py-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStarting ? (
              <p className="text-lg">ĐANG VÀO BÀI...</p>
            ) : (
              <p className="text-lg">BẮT ĐẦU</p>
            )}
          </Button>
        </div>
      </div>

      {/* Room Statistics */}
      {waitingRoom && waitingRoom.totalUsers > 0 && (
        <div className="mt-6 bg-card rounded-2xl shadow-xl overflow-hidden p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Trạng thái phòng thi
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-background rounded-lg text-center">
              <div className="text-2xl font-bold">
                {waitingRoom.waitingCount}
              </div>
              <div className="text-sm text-muted-foreground">Đang chờ</div>
            </div>
            <div className="p-4 bg-background rounded-lg text-center">
              <div className="text-2xl font-bold">
                {waitingRoom.testingCount}
              </div>
              <div className="text-sm text-muted-foreground">Đang thi</div>
            </div>
            <div className="p-4 bg-background rounded-lg text-center">
              <div className="text-2xl font-bold">
                {waitingRoom.submittedCount}
              </div>
              <div className="text-sm text-muted-foreground">Đã nộp</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
