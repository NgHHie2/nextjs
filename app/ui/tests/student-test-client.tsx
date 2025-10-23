"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Account } from "@/app/lib/definitions";
import {
  getQuestion,
  selectAnswer,
  flagQuestion,
  endTest,
  getResultDetail,
  startTest,
  QuestionResponse,
  ResultDetailDTO,
  StudentAnswer,
} from "@/app/lib/data/test-data";
import { SemesterTest } from "@/app/lib/data/server-test-data";
import WaitingHeader from "./waiting-header";
import ExamHeader from "./exam-header";
import StudentWaitingView from "./student-waiting-view";
import StudentExamView from "./student-exam-view";
import {
  TestSocket,
  TestRoomUpdate,
  TestOpenedEvent,
} from "@/app/lib/websocket/test-socket";

interface Props {
  testData: SemesterTest;
  user: Account;
}

type ViewMode = "waiting" | "exam";

export default function StudentTestClient({ testData, user }: Props) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("waiting");
  const [resultId, setResultId] = useState<number | null>(null);

  // Waiting state
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [canStart, setCanStart] = useState(false);
  const [testStatus, setTestStatus] = useState<
    "upcoming" | "ongoing" | "ended"
  >("upcoming");
  const [isTestOpen, setIsTestOpen] = useState(testData.open || false);

  // Exam state
  const [resultDetail, setResultDetail] = useState<ResultDetailDTO | null>(
    null
  );
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState<
    Record<string, StudentAnswer>
  >({});
  const [examCountdown, setExamCountdown] = useState<{
    minutes: number;
    seconds: number;
  } | null>(null);

  // WebSocket state
  const [waitingRoom, setWaitingRoom] = useState<TestRoomUpdate | null>(null);
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
      (event) => {
        setIsTestOpen(event.opened);
      }
    );

    setSocket(ws);

    return () => {
      ws.disconnect();
    };
  }, [testData.id, user]);

  // Calculate countdown for waiting
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const startTime = new Date(testData.startDate);
      const endTime = new Date(testData.endDate);

      if (now >= startTime && now <= endTime) {
        setCanStart(isTestOpen);
        setTestStatus("ongoing");
        setCountdown(null);
        return;
      }

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

      if (now > endTime) {
        setCanStart(false);
        setTestStatus("ended");
        setCountdown(null);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [testData, isTestOpen]);

  // Update canStart when isTestOpen changes
  useEffect(() => {
    if (testStatus === "ongoing") {
      setCanStart(isTestOpen);
    }
  }, [isTestOpen, testStatus]);

  // Calculate exam countdown
  useEffect(() => {
    if (!resultDetail || viewMode !== "exam") return;

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
        handleEndTest();
      }
    };

    calculateExamCountdown();
    const interval = setInterval(calculateExamCountdown, 1000);

    return () => clearInterval(interval);
  }, [resultDetail, viewMode]);

  const handleStartTest = async () => {
    setIsStarting(true);
    try {
      const result = await startTest(testData.id);

      if (result.success) {
        setResultId(result.resultId);
        setViewMode("exam");
        await loadInitialData(result.resultId);
      } else {
        alert(result.message || "Không thể bắt đầu bài thi");
      }
    } catch (error) {
      console.error("Error starting test:", error);
      alert("Đã xảy ra lỗi khi bắt đầu bài thi");
    } finally {
      setIsStarting(false);
    }
  };

  const loadInitialData = async (resId: number) => {
    try {
      setIsLoading(true);
      const detail = await getResultDetail(resId);
      setResultDetail(detail);
      setStudentAnswers(detail.studentAnswers);

      if (detail.detailTest.questions.length > 0) {
        await loadQuestion(resId, 0);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      alert("Không thể tải dữ liệu bài thi");
    } finally {
      setIsLoading(false);
    }
  };

  const loadQuestion = async (resId: number, index: number) => {
    try {
      const question = await getQuestion(resId, index);
      setCurrentQuestion(question);
      setCurrentIndex(index);
    } catch (error) {
      console.error("Error loading question:", error);
      alert("Không thể tải câu hỏi");
    }
  };

  const handleSelectAnswer = async (answerIndex: number) => {
    if (!currentQuestion || !resultId) return;

    try {
      const currentSelected = currentQuestion.selectedAnswers || [];
      let newSelected: number[];

      if (currentSelected.includes(answerIndex)) {
        newSelected = currentSelected.filter((idx) => idx !== answerIndex);
      } else {
        newSelected = [...currentSelected, answerIndex];
      }

      await selectAnswer(resultId, currentIndex, newSelected);

      setCurrentQuestion({
        ...currentQuestion,
        selectedAnswers: newSelected,
      });

      setStudentAnswers((prev) => ({
        ...prev,
        [currentIndex]: {
          ...prev[currentIndex],
          selectedAnswers: newSelected,
        },
      }));
    } catch (error) {
      console.error("Error selecting answer:", error);
      alert("Không thể chọn câu trả lời");
    }
  };

  const handleToggleFlag = async () => {
    if (!currentQuestion || !resultId) return;

    try {
      const newFlaggedState = !currentQuestion.flagged;
      await flagQuestion(resultId, currentIndex, newFlaggedState);

      setCurrentQuestion({
        ...currentQuestion,
        flagged: newFlaggedState,
      });

      setStudentAnswers((prev) => ({
        ...prev,
        [currentIndex]: {
          ...prev[currentIndex],
          flagged: newFlaggedState,
        },
      }));
    } catch (error) {
      console.error("Error flagging question:", error);
      alert("Không thể đánh dấu câu hỏi");
    }
  };

  const handleEndTest = async () => {
    if (!resultId) return;

    try {
      setIsEnding(true);
      const result = await endTest(resultId);

      if (result.success) {
        alert(`Nộp bài thành công! Điểm của bạn: ${result.score}`);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error ending test:", error);
      alert("Không thể nộp bài");
    } finally {
      setIsEnding(false);
    }
  };

  // Render waiting view
  if (viewMode === "waiting") {
    return (
      <div className="min-h-screen bg-background">
        <WaitingHeader user={user} />
        <StudentWaitingView
          testData={testData}
          countdown={countdown}
          testStatus={testStatus}
          isTestOpen={isTestOpen}
          canStart={canStart}
          isStarting={isStarting}
          waitingRoom={waitingRoom}
          onStartTest={handleStartTest}
        />
      </div>
    );
  }

  // Render exam view
  if (isLoading || !resultDetail || !currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải bài thi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background h-screen flex flex-col">
      <ExamHeader user={user} onEndTest={handleEndTest} isEnding={isEnding} />
      <StudentExamView
        resultDetail={resultDetail}
        currentQuestion={currentQuestion}
        currentIndex={currentIndex}
        studentAnswers={studentAnswers}
        examCountdown={examCountdown}
        onSelectAnswer={handleSelectAnswer}
        onToggleFlag={handleToggleFlag}
        onLoadQuestion={(index) => resultId && loadQuestion(resultId, index)}
      />
    </div>
  );
}
