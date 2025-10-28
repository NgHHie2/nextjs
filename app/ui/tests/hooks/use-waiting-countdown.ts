// app/ui/tests/hooks/use-waiting-countdown.ts

import { useState, useEffect } from "react";
import { SemesterTest } from "@/app/lib/data/server-test-data";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface UseWaitingCountdownProps {
  testData: SemesterTest;
  isTestOpen: boolean;
  enabled: boolean;
}

export default function useWaitingCountdown({
  testData,
  isTestOpen,
  enabled,
}: UseWaitingCountdownProps) {
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  const [testStatus, setTestStatus] = useState<
    "upcoming" | "ongoing" | "ended"
  >("upcoming");
  const [canStart, setCanStart] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const calculateCountdown = () => {
      const now = new Date();
      const startTime = new Date(testData.startDate);
      const endTime = new Date(testData.endDate);

      // Test is ongoing
      if (now >= startTime && now <= endTime) {
        setCanStart(isTestOpen);
        setTestStatus("ongoing");
        setCountdown(null);
        return;
      }

      // Test is upcoming
      if (now < startTime) {
        const diff = startTime.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
        setCanStart(false);
        setTestStatus("upcoming");
        return;
      }

      // Test has ended
      if (now > endTime) {
        setCanStart(false);
        setTestStatus("ended");
        setCountdown(null);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [testData, isTestOpen, enabled]);

  return { countdown, testStatus, canStart };
}
