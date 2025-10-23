"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Flag, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  QuestionResponse,
  ResultDetailDTO,
  StudentAnswer,
} from "@/app/lib/data/test-data";

interface StudentExamViewProps {
  resultDetail: ResultDetailDTO;
  currentQuestion: QuestionResponse;
  currentIndex: number;
  studentAnswers: Record<string, StudentAnswer>;
  examCountdown: {
    minutes: number;
    seconds: number;
  } | null;
  onSelectAnswer: (answerIndex: number) => void;
  onToggleFlag: () => void;
  onLoadQuestion: (index: number) => void;
}

export default function StudentExamView({
  resultDetail,
  currentQuestion,
  currentIndex,
  studentAnswers,
  examCountdown,
  onSelectAnswer,
  onToggleFlag,
  onLoadQuestion,
}: StudentExamViewProps) {
  const totalQuestions = resultDetail.detailTest.questions.length;

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

  return (
    <div className="flex-1 max-w-[1200px] mx-auto px-6 py-6 overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {/* Question Navigator - Left Side */}
        <div className="sm:col-span-1 order-2 sm:order-1">
          <Card>
            <CardContent className="p-4">
              {/* Timer */}
              {examCountdown && (
                <div className="bg-background rounded-lg p-4 mb-4">
                  <p className="text-sm mb-4 text-center">Thời gian còn lại:</p>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Phút", value: examCountdown.minutes },
                      { label: "Giây", value: examCountdown.seconds },
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

              <h3 className="font-semibold mb-4">Danh sách câu hỏi</h3>

              {/* Question Grid */}
              <div className="grid grid-cols-10 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {resultDetail.detailTest.questions.map((_, index) => {
                  const status = getQuestionStatus(index);

                  return (
                    <Button
                      key={index}
                      onClick={() => onLoadQuestion(index)}
                      variant={"outline"}
                      className={cn(
                        "relative h-10",
                        "border-0",
                        status.answered && "bg-primary/40 hover:bg-primary/80",
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

              {/* Legend */}
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

        {/* Question Content - Right Side */}
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
                  onClick={onToggleFlag}
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
                    onClick={() => onSelectAnswer(answer.answerIndex)}
                  >
                    <Checkbox
                      checked={currentQuestion.selectedAnswers.includes(
                        answer.answerIndex
                      )}
                      onCheckedChange={() => onSelectAnswer(answer.answerIndex)}
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
                  onClick={() => onLoadQuestion(currentIndex - 1)}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Câu trước
                </Button>

                <Button
                  variant="outline"
                  onClick={() => onLoadQuestion(currentIndex + 1)}
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
  );
}
