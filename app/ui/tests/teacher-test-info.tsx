"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, Award, Play } from "lucide-react";
import { SemesterTest } from "@/app/lib/data/server-test-data";

interface TeacherTestInfoProps {
  testData: SemesterTest;
  isTestOpen: boolean;
  isOpening: boolean;
  onOpenTest: () => void;
}

export default function TeacherTestInfo({
  testData,
  isTestOpen,
  isOpening,
  onOpenTest,
}: TeacherTestInfoProps) {
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
    <div className="bg-card rounded-2xl shadow-xl overflow-hidden mb-6">
      <div className="flex flex-col items-center justify-center pt-8">
        <h1 className="text-3xl font-bold">{testData.name}</h1>
        {isTestOpen && (
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <p className="text-sm text-green-800 dark:text-green-300">
              Bài thi đã mở
            </p>
          </div>
        )}
      </div>

      <div className="p-8 space-y-6">
        {/* Test details */}
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
            <p className="text-sm text-muted-foreground mb-1">Đối tượng thi</p>
            <p className="font-semibold text-foreground">
              {testData.test.position.name}
            </p>
          </div>
        </div>

        {/* Open test button */}
        <Button
          onClick={onOpenTest}
          disabled={isTestOpen || isOpening}
          className="w-full h-12 bg-primary text-primary-foreground py-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOpening ? (
            <p className="text-lg">ĐANG MỞ...</p>
          ) : isTestOpen ? (
            <p className="text-lg">ĐÃ MỞ BÀI THI</p>
          ) : (
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              <p className="text-lg">MỞ BÀI THI</p>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
