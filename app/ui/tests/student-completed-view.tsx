// app/ui/tests/student-completed-view.tsx

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Account } from "@/app/lib/definitions";
import { SemesterTest } from "@/app/lib/data/server-test-data";
import WaitingHeader from "./waiting-header";
import { CheckCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  testData: SemesterTest;
  user: Account;
  score: number | null;
  resultId: number | null;
}

export default function StudentCompletedView({
  testData,
  user,
  score,
  resultId,
}: Props) {
  const router = useRouter();

  const handleViewDetail = () => {
    if (resultId) {
      router.push(`/dashboard/test/${testData.id}/result/${resultId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <WaitingHeader user={user} />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-8 w-full">
              <div className="flex items-center justify-center gap-3 mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
                <h2 className="text-3xl font-bold text-green-700 dark:text-green-400">
                  ĐÃ HOÀN THÀNH
                </h2>
              </div>
              <div className="text-center mb-6">
                <p className="text-xl text-muted-foreground mb-3">
                  Điểm số của bạn:
                </p>
                <p className="text-6xl font-bold text-primary mb-6">
                  {score?.toFixed(1) || "0.0"}
                </p>
                <p className="text-lg text-muted-foreground">
                  Bài thi: {testData.name}
                </p>
              </div>

              {/* Button xem chi tiết */}
              <div className="flex justify-center">
                <Button
                  onClick={handleViewDetail}
                  className="flex items-center gap-2 "
                >
                  Xem chi tiết bài làm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
