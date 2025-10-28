// app/ui/tests/hooks/use-exam-countdown.ts

import { useState, useEffect } from "react";
import { ResultDetailDTO } from "@/app/lib/data/test-data";

interface ExamCountdown {
  minutes: number;
  seconds: number;
}

interface UseExamCountdownProps {
  resultDetail: ResultDetailDTO | null;
  enabled: boolean;
  onTimeout: () => void;
}

export default function useExamCountdown({
  resultDetail,
  enabled,
  onTimeout,
}: UseExamCountdownProps) {
  const [examCountdown, setExamCountdown] = useState<ExamCountdown | null>(
    null
  );

  useEffect(() => {
    if (!resultDetail || !enabled) return;

    const calculateExamCountdown = () => {
      const now = new Date();
      const startTime = new Date(resultDetail.startDateTime);
      const endTime = new Date(
        startTime.getTime() + resultDetail.minutes * 60 * 1000
      );

      if (now <= endTime) {
        const diff = endTime.getTime() - now.getTime();
        const totalMinutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setExamCountdown({ minutes: totalMinutes, seconds });
        return;
      }

      if (now > endTime) {
        setExamCountdown(null);
        onTimeout();
      }
    };

    calculateExamCountdown();
    const interval = setInterval(calculateExamCountdown, 1000);

    return () => clearInterval(interval);
  }, [resultDetail, enabled]);

  return { examCountdown };
}
