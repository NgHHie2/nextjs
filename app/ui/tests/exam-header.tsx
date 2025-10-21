// app/ui/tests/exam-header.tsx
import { Account } from "@/app/lib/definitions";
import { SimpleThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ExamHeaderProps {
  user: Account;
  onEndTest: () => void;
  isEnding: boolean;
}

export default function ExamHeader({
  user,
  onEndTest,
  isEnding,
}: ExamHeaderProps) {
  const initials = `${user.firstName?.[0] || ""}${
    user.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="flex flex-row items-center justify-between p-4 bg-background shadow-sm border-b border-border">
      {/* BÊN TRÁI: thông tin user */}
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-3 border-2">
            <AvatarFallback className="font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="text-left">
            <p className="font-semibold text-foreground">
              {user.lastName} {user.firstName}
            </p>
            <p className="text-sm text-muted-foreground">{user.cccd}</p>
          </div>
        </div>
      </div>

      {/* BÊN PHẢI: theme toggle và nút kết thúc */}
      <div className="flex items-center gap-3">
        <SimpleThemeToggle />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isEnding} className="font-semibold">
              {isEnding ? "Đang nộp bài..." : "Kết thúc"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận nộp bài</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn nộp bài không? Sau khi nộp bài, bạn sẽ
                không thể thay đổi câu trả lời.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={onEndTest}>Nộp bài</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
