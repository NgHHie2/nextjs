// app/ui/tests/result-detail-view.tsx

"use client";

import React, { useState } from "react";
import { Account } from "@/app/lib/definitions";
import { ResultDetailDTO } from "@/app/lib/data/test-data";
import { SemesterTest } from "@/app/lib/data/server-test-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Send,
  User,
  IdCard,
} from "lucide-react";
import WaitingHeader from "./waiting-header";

interface Props {
  testData: SemesterTest;
  user: Account | null;
  resultDetail: ResultDetailDTO;
}

export default function ResultDetailView({
  testData,
  user,
  resultDetail,
}: Props) {
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

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "Chưa trả lời";
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const isCorrectAnswer = (questionIndex: number): boolean => {
    const trueAnswers = resultDetail.trueAnswers?.[questionIndex] || [];
    const studentAnswers =
      resultDetail.studentAnswers[questionIndex]?.selectedAnswers || [];

    if (trueAnswers.length !== studentAnswers.length) return false;

    const sortedTrue = [...trueAnswers].sort();
    const sortedStudent = [...studentAnswers].sort();

    return sortedTrue.every((val, idx) => val === sortedStudent[idx]);
  };

  const getAnswerStatus = (
    questionIndex: number,
    answerIndex: number
  ): "correct" | "wrong" | "not-selected" => {
    const trueAnswers = resultDetail.trueAnswers?.[questionIndex] || [];
    const studentAnswers =
      resultDetail.studentAnswers[questionIndex]?.selectedAnswers || [];

    const isTrue = trueAnswers.includes(answerIndex);
    const isSelected = studentAnswers.includes(answerIndex);

    if (isSelected && isTrue) return "correct";
    if (isSelected && !isTrue) return "wrong";
    if (!isSelected && isTrue) return "correct"; // Đáp án đúng nhưng không chọn
    return "not-selected";
  };

  const totalQuestions = resultDetail.detailTest.questions.length;
  const correctAnswers = resultDetail.detailTest.questions.filter((_, idx) =>
    isCorrectAnswer(idx)
  ).length;

  return (
    <div>
      {/* <WaitingHeader user={user} /> */}

      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              {testData.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Thông tin học viên */}
            {user && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/40 text-center">
                  <p className="text-sm text-muted-foreground">Học viên</p>
                  <p className="text-lg font-medium">
                    {user.lastName} {user.firstName}
                  </p>
                  <p className="text-sm">{user.cccd}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/40 text-center">
                  <p className="text-sm text-muted-foreground">Số câu đúng</p>
                  <p className="text-4xl font-semibold">
                    {correctAnswers}/{totalQuestions}
                  </p>
                </div>
              </div>
            )}

            {/* Thông tin kết quả */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/40 text-center">
                <p className="text-sm text-muted-foreground">Bắt đầu</p>
                <p className="text-base font-medium">
                  {formatDate(resultDetail.startDateTime)}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 text-center">
                <p className="text-sm text-muted-foreground">Nộp bài</p>
                <p className="text-base font-medium">
                  {resultDetail.submitDateTime
                    ? formatDate(resultDetail.submitDateTime)
                    : "Chưa nộp"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <div className="space-y-4">
          {resultDetail.detailTest.questions.map((question, qIdx) => {
            const isCorrect = isCorrectAnswer(qIdx);
            const studentAnswer = resultDetail.studentAnswers[qIdx];

            return (
              <Card key={qIdx} className="overflow-hidden">
                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">Câu {qIdx + 1}</Badge>
                          {studentAnswer?.answeredAt && (
                            <span className="text-xs text-muted-foreground">
                              Trả lời lúc:{" "}
                              {formatTime(studentAnswer.answeredAt)}
                            </span>
                          )}
                        </div>
                        <p className="font-medium">{question.questionText}</p>
                      </div>
                    </div>
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {question.answers.map((answer) => {
                      const status = getAnswerStatus(qIdx, answer.answerIndex);
                      const isSelected = resultDetail.studentAnswers[
                        qIdx
                      ]?.selectedAnswers?.includes(answer.answerIndex);
                      const isTrue = resultDetail.trueAnswers?.[qIdx]?.includes(
                        answer.answerIndex
                      );

                      return (
                        <div
                          key={answer.answerIndex}
                          className={`p-3 rounded-lg border-2 ${
                            status === "correct" && isSelected
                              ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                              : status === "wrong"
                              ? "bg-red-50 dark:bg-red-900/20 border-red-500"
                              : isTrue
                              ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                              : "bg-background border-border"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {isTrue ? (
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            ) : isSelected ? (
                              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            ) : (
                              <div className="w-5 h-5 flex-shrink-0" />
                            )}
                            <span className="flex-1">{answer.answerText}</span>
                            <div className="flex gap-2">
                              {isSelected && (
                                <Badge variant="outline" className="text-xs">
                                  Đã chọn
                                </Badge>
                              )}
                              {isTrue && (
                                <Badge variant="outline" className="text-xs">
                                  Đáp án đúng
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
