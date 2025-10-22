"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Account } from "@/app/lib/definitions";
import ExamHeader from "./exam-header";
import {
  getQuestion,
  selectAnswer,
  flagQuestion,
  endTest,
  getResultDetail,
  QuestionResponse,
  ResultDetailDTO,
  StudentAnswer,
} from "@/app/lib/data/test-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Flag, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { start } from "repl";

interface Props {
  resultId: number;
  user: Account;
}

export default function ExamClient({ resultId, user }: Props) {
  const router = useRouter();
  const [resultDetail, setResultDetail] = useState<ResultDetailDTO | null>(
    null
  );
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnding, setIsEnding] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState<
    Record<string, StudentAnswer>
  >({});
  const [countdown, setCountdown] = useState<{
    minutes: number;
    seconds: number;
  } | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, [resultId]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const detail = await getResultDetail(resultId);
      setResultDetail(detail);
      setStudentAnswers(detail.studentAnswers);

      // Load first question
      if (detail.detailTest.questions.length > 0) {
        await loadQuestion(0);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      alert("Không thể tải dữ liệu bài thi");
    } finally {
      setIsLoading(false);
    }
  };

  const loadQuestion = async (index: number) => {
    try {
      const question = await getQuestion(resultId, index);
      setCurrentQuestion(question);
      setCurrentIndex(index);
    } catch (error) {
      console.error("Error loading question:", error);
      alert("Không thể tải câu hỏi");
    }
  };

  const handleSelectAnswer = async (answerIndex: number) => {
    if (!currentQuestion) return;

    try {
      const currentSelected = currentQuestion.selectedAnswers || [];
      let newSelected: number[];

      if (currentSelected.includes(answerIndex)) {
        newSelected = currentSelected.filter((idx) => idx !== answerIndex);
      } else {
        newSelected = [...currentSelected, answerIndex];
      }

      await selectAnswer(resultId, currentIndex, newSelected);

      // Update local state
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
    if (!currentQuestion) return;

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

  const getQuestionStatus = (index: number) => {
    const answer = studentAnswers[index];
    if (!answer) {
      return { answered: false, flagged: false };
    }

    return {
      answered: answer.selectedAnswers?.length > 0,
      flagged: !!answer.flagged,
    };
  };

  // Tính toán countdown
  useEffect(() => {
    if (!resultDetail) return;
    const calculateCountdown = () => {
      const now = new Date();
      console.log(now);
      const startTime = new Date(resultDetail.startDateTime);
      console.log(startTime);
      const endTime = new Date(
        startTime.getTime() + resultDetail.minutes * 60 * 1000
      );
      console.log(resultDetail.minutes);
      console.log(endTime);
      // Kiểm tra trạng thái bài thi
      if (now <= endTime) {
        const diff = endTime.getTime() - now.getTime(); // thời gian còn lại (ms)

        const totalMinutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown({ minutes: totalMinutes, seconds });
        return;
      }

      if (now > endTime) {
        setCountdown(null);
        handleEndTest();
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [resultDetail]);

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

  const totalQuestions = resultDetail.detailTest.questions.length;

  return (
    <div className="bg-background h-screen flex flex-col">
      <ExamHeader user={user} onEndTest={handleEndTest} isEnding={isEnding} />

      <div className="flex-1 max-w-7xl mx-auto px-6 py-6  overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {/* Question Navigator - Bên trái */}
          <div className="sm:col-span-1 order-2 sm:order-1">
            <Card>
              <CardContent className="p-4">
                {countdown && (
                  <div className="bg-background rounded-lg p-4 mb-4">
                    <p className="text-sm mb-4 text-center">
                      Thời gian còn lại:
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Phút", value: countdown.minutes },
                        { label: "Giây", value: countdown.seconds },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="bg-background rounded-lg p-4 text-center"
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
                <h3 className="font-semibold mb-4">Danh sách câu hỏi</h3>

                <div className="grid grid-cols-10 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {resultDetail.detailTest.questions.map((_, index) => {
                    const status = getQuestionStatus(index);
                    const isCurrent = currentIndex === index;

                    return (
                      <Button
                        key={index}
                        onClick={() => loadQuestion(index)}
                        variant={"outline"}
                        className={cn(
                          "relative h-10",
                          "border-0",
                          status.answered &&
                            "bg-primary/40 hover:bg-primary/80",
                          currentIndex === index && "border-2 border-ring"
                        )}
                      >
                        {index + 1}

                        {status.flagged && (
                          <span className="absolute top-1 right-1 text-sm text-foreground">
                            ⚑
                          </span>
                        )}
                      </Button>
                    );
                  })}
                </div>

                {/* Chú thích trạng thái */}
                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary/40 rounded"></div>
                    <span>Đã trả lời / Đang chọn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center rounded w-4 h-4 bg-background text-foreground">
                      ⚑
                    </div>
                    <span>Đánh dấu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-background border rounded"></div>
                    <span>Chưa trả lời</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Content - Bên phải */}
          <div className="sm:col-span-3 order-1 sm:order-2">
            <Card>
              <CardContent className="p-6">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Câu {currentIndex + 1}/{totalQuestions}
                  </h2>
                  <Button
                    variant={currentQuestion.flagged ? "default" : "outline"}
                    size="sm"
                    onClick={handleToggleFlag}
                    className="flex items-center gap-2"
                  >
                    <Flag className="w-4 h-4" />
                    {currentQuestion.flagged ? "Đã đánh dấu" : "Đánh dấu"}
                  </Button>
                </div>

                {/* Question Text */}
                <div className="mb-6 p-4 bg-background rounded-lg">
                  <p className="text-lg">{currentQuestion.questionText}</p>
                </div>

                {/* Answers */}
                <div className="space-y-3">
                  {currentQuestion.answers.map((answer) => (
                    <div
                      key={answer.answerIndex}
                      className={cn(
                        "flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors",
                        currentQuestion.selectedAnswers.includes(
                          answer.answerIndex
                        )
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => handleSelectAnswer(answer.answerIndex)}
                    >
                      <Checkbox
                        checked={currentQuestion.selectedAnswers.includes(
                          answer.answerIndex
                        )}
                        onCheckedChange={() =>
                          handleSelectAnswer(answer.answerIndex)
                        }
                        className="mt-1"
                      />
                      <label className="flex-1 cursor-pointer">
                        {answer.answerText}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={() => loadQuestion(currentIndex - 1)}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Câu trước
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => loadQuestion(currentIndex + 1)}
                    disabled={currentIndex === totalQuestions - 1}
                  >
                    Câu sau
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
