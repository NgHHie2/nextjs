import { Account } from "@/app/lib/definitions";
import { SimpleThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WaitingHeader({ user }: { user: Account }) {
  const router = useRouter();
  const initials = `${user.firstName?.[0] || ""}${
    user.lastName?.[0] || ""
  }`.toUpperCase();
  return (
    <div className="flex flex-row items-center justify-between p-4 bg-background shadow-sm border-b border-border">
      {/* BÊN TRÁI: nút quay lại */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Quay lại</span>
        </button>

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

      {/* BÊN PHẢI: theme toggle */}
      <SimpleThemeToggle />
    </div>
  );
}
