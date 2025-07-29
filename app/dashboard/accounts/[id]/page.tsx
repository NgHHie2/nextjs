// app/dashboard/accounts/[id]/page.tsx
import {
  fetchAccountById,
  fetchParticipationsByAccount,
} from "@/app/lib/data/learning-data";
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
import Breadcrumbs from "@/app/ui/breadcrumbs";

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
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Username:</strong> {account.username}
            </p>
            <p>
              <strong>Name:</strong> {account.firstName} {account.lastName}
            </p>
            <p>
              <strong>Email:</strong> {account.email}
            </p>
            <p>
              <strong>Phone:</strong> {account.phoneNumber}
            </p>
            <p>
              <strong>Birthday:</strong>{" "}
              {new Date(account.birthDay).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Total Subjects:</strong> {participations.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enrolled Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participations.map((participation) => (
                <TableRow key={participation.id}>
                  <TableCell>
                    {participation.subject?.title || "Unknown"}
                  </TableCell>
                  <TableCell>{participation.subject?.code || "N/A"}</TableCell>
                  <TableCell>
                    {participation.subject?.description || "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
