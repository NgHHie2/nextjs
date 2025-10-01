// app/dashboard/accounts/[id]/page.tsx
import {
  fetchAccountById,
  fetchParticipationsByAccount,
} from "@/app/lib/data/server-account-data";
import { lusitana } from "@/app/ui/fonts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { Pencil, ArrowLeft, Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const [account, participations] = await Promise.all([
    fetchAccountById(id),
    fetchParticipationsByAccount(id),
  ]);

  if (!account) {
    notFound();
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "TEACHER":
        return "default";
      case "STUDENT":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <main className="space-y-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Accounts", href: "/dashboard/accounts/" },
          {
            label: "Account Details",
            href: `/dashboard/accounts/${id}`,
          },
          {
            label: account.username,
            href: `/dashboard/accounts/${id}#username`,
            active: true,
          },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 bg-sidebar   shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <Button asChild size="sm">
              <Link href={`/dashboard/accounts/${id}/edit`}>
                <Edit className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          </CardHeader>

          <CardContent>
            <div className="divide-y divide-border">
              <div className="grid grid-cols-2 gap-4 py-3">
                <span className="text-muted-foreground font-medium">
                  Username
                </span>
                <span className="font-semibold">{account.username}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 py-3">
                <span className="text-muted-foreground font-medium">Name</span>
                <span className="font-semibold">
                  {account.firstName} {account.lastName}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 py-3">
                <span className="text-muted-foreground font-medium">CCCD</span>
                <span className="font-semibold">{account.cccd || "-"}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 py-3">
                <span className="text-muted-foreground font-medium">Email</span>
                <span className="font-semibold">{account.email || "-"}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 py-3">
                <span className="text-muted-foreground font-medium">Phone</span>
                <span className="font-semibold">
                  {account.phoneNumber || "-"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 py-3">
                <span className="text-muted-foreground font-medium">
                  Birthday
                </span>
                <span className="font-semibold">
                  {account.birthDay
                    ? new Date(account.birthDay).toLocaleDateString()
                    : "-"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 py-3">
                <span className="text-muted-foreground font-medium">Role</span>
                <div>
                  <Badge variant={getRoleBadgeVariant(account.role)}>
                    {account.role}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-sidebar   shadow-sm">
          <CardHeader>
            <CardTitle>Learning Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              <div className="grid grid-cols-2 gap-4 py-3">
                <span className="text-muted-foreground font-medium">
                  Total Subjects
                </span>
                <span className="font-semibold text-2xl">
                  {participations.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-sidebar   shadow-sm">
        <CardHeader>
          <CardTitle>Enrolled Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          {participations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No enrolled subjects yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-muted/50">
                  <TableHead className="font-semibold text-foreground">
                    Subject
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Code
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Description
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participations.map((participation, index) => (
                  <TableRow
                    key={participation.id}
                    className={
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }
                  >
                    <TableCell className="font-medium">
                      {participation.subject?.title || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                        {participation.subject?.code || "N/A"}
                      </code>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {participation.subject?.description || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
