// app/dashboard/profile/page.tsx
import { fetchCurrentUser } from "@/app/lib/data/server-auth-data";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await fetchCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Lấy chữ cái đầu của tên để làm avatar fallback
  const initials = `${user.firstName?.[0] || ""}${
    user.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          {
            label: "My Profile",
            href: "/dashboard/profile",
            active: true,
          },
        ]}
      />

      <Card className="mt-4 border-none max-w-2xl mx-auto">
        <CardHeader></CardHeader>
        <CardContent>
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-3 pb-6 border-b">
            <Avatar className="h-24 w-24 mb-3 border-4 ">
              <AvatarFallback className="text-3xl font-bold ">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl">
              {user.lastName} {user.firstName}
            </h2>
            <Badge variant="outline" className="mt-2">
              {user.role}
            </Badge>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <div className="rounded-md border border-none bg-muted px-3 py-2 text-sm">
                {user.username}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <div className="rounded-md border border-none bg-muted px-3 py-2 text-sm">
                  {user.firstName}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <div className="rounded-md border border-none bg-muted px-3 py-2 text-sm">
                  {user.lastName}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">CCCD</label>
              <div className="rounded-md border border-none bg-muted px-3 py-2 text-sm">
                {user.cccd || "-"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="rounded-md border border-none bg-muted px-3 py-2 text-sm">
                {user.email || "-"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <div className="rounded-md border border-none bg-muted px-3 py-2 text-sm">
                {user.phoneNumber || "-"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Birthday</label>
              <div className="rounded-md border border-none bg-muted px-3 py-2 text-sm">
                {user.birthDay
                  ? new Date(user.birthDay).toLocaleDateString()
                  : "-"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
