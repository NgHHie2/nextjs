// app/ui/tests/student-test-client.tsx

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
import {
  SemesterTest,
  TestStatusResponse,
} from "@/app/lib/data/server-test-data";
import WaitingHeader from "./waiting-header";
import ExamHeader from "./exam-header";
import StudentWaitingView from "./student-waiting-view";
import StudentExamView from "./student-exam-view";
import StudentCompletedView from "./student-completed-view";
import useTestWebSocket from "./hooks/use-test-websocket";
import useWaitingCountdown from "./hooks/use-waiting-countdown";
import useExamCountdown from "./hooks/use-exam-countdown";

interface Props {
  testData: SemesterTest;
  user: Account;
  initialTestStatus: TestStatusResponse;
}

type ViewMode = "waiting" | "exam" | "completed";

export default function StudentTestClient({
  testData,
  user,
  initialTestStatus,
}: Props) {
  const router = useRouter();

  // Luôn bắt đầu từ waiting view, trừ khi đã completed
  const [viewMode, setViewMode] = useState<ViewMode>(
    initialTestStatus.status === "COMPLETED" ? "completed" : "waiting"
  );

  const [resultId, setResultId] = useState<number | null>(
    initialTestStatus.resultId
  );

  // Waiting state
  const [isStarting, setIsStarting] = useState(false);
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

  // Completed state
  const [completedScore, setCompletedScore] = useState<number | null>(
    initialTestStatus.score
  );

  // Custom hooks
  const { waitingRoom } = useTestWebSocket({
    testData,
    user,
    isCompleted: viewMode === "completed",
    onTestOpened: (opened) => setIsTestOpen(opened),
  });

  const { countdown, testStatus, canStart } = useWaitingCountdown({
    testData,
    isTestOpen,
    enabled: viewMode === "waiting",
  });

  const { examCountdown } = useExamCountdown({
    resultDetail,
    enabled: viewMode === "exam",
    onTimeout: handleEndTest,
  });

  // Determine button text based on test status
  const getStartButtonText = () => {
    if (isStarting) return "ĐANG TẢI...";
    if (!isTestOpen) return "BÀI THI CHƯA MỞ";

    // Nếu đã có result và chưa submit -> đang thi -> hiện "TIẾP TỤC THI"
    if (initialTestStatus.status === "IN_PROGRESS") {
      return "TIẾP TỤC THI";
    }

    // Chưa có result -> hiện "BẮT ĐẦU THI"
    return "BẮT ĐẦU THI";
  };

  // Hàm start/continue test - dùng chung
  const handleStartOrContinueTest = async () => {
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
    } catch (error: any) {
      console.error("Error starting test:", error);
      alert(error.message || "Đã xảy ra lỗi khi bắt đầu bài thi");
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

  async function handleEndTest() {
    if (!resultId) return;

    try {
      setIsEnding(true);
      const result = await endTest(resultId);

      if (result.success) {
        setCompletedScore(result.score);
        setViewMode("completed");
        // alert(`Nộp bài thành công! Điểm của bạn: ${result.score}`);
      }
    } catch (error) {
      console.error("Error ending test:", error);
      alert("Không thể nộp bài");
    } finally {
      setIsEnding(false);
    }
  }

  // Render views
  if (viewMode === "completed") {
    return (
      <StudentCompletedView
        testData={testData}
        user={user}
        score={completedScore}
        resultId={resultId}
      />
    );
  }

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
          onStartTest={handleStartOrContinueTest}
          buttonText={getStartButtonText()}
        />
      </div>
    );
  }

  // Exam view - loading state
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

  // Exam view
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
