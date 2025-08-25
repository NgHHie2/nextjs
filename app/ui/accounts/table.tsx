// app/ui/accounts/table.tsx
import Link from "next/link";
import { Eye, Pencil, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Account } from "@/app/lib/definitions";
import { fetchAllAccounts } from "@/app/lib/data/server-account-data";
import { DeleteAccountButton } from "@/app/ui/accounts/buttons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SortableHeader from "@/app/ui/accounts/sortable-header";

interface AccountsTableProps {
  query: string;
  currentPage?: number;
  role?: string;
  sortBy?: string;
  sortDir?: string;
}

export default async function AccountsTable({
  query,
  currentPage = 1,
  role,
  sortBy,
  sortDir,
}: AccountsTableProps) {
  const data = await fetchAllAccounts(
    query,
    role,
    currentPage,
    10,
    sortBy,
    sortDir
  );

  if (data.content.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No accounts found.</p>
        </CardContent>
      </Card>
    );
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
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/50">
              <TableHead className="font-semibold text-foreground">
                <SortableHeader
                  field="id"
                  currentSort={sortBy}
                  currentDir={sortDir}
                >
                  ID
                </SortableHeader>
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                <SortableHeader
                  field="firstName"
                  currentSort={sortBy}
                  currentDir={sortDir}
                >
                  Full Name
                </SortableHeader>
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                <SortableHeader
                  field="username"
                  currentSort={sortBy}
                  currentDir={sortDir}
                >
                  Username
                </SortableHeader>
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                <SortableHeader
                  field="email"
                  currentSort={sortBy}
                  currentDir={sortDir}
                >
                  Contact
                </SortableHeader>
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                <SortableHeader
                  field="role"
                  currentSort={sortBy}
                  currentDir={sortDir}
                >
                  Role
                </SortableHeader>
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                <SortableHeader
                  field="birthDay"
                  currentSort={sortBy}
                  currentDir={sortDir}
                >
                  Birthday
                </SortableHeader>
              </TableHead>
              <TableHead className="font-semibold text-foreground text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.content.map((account, index) => (
              <TableRow
                key={account.id}
                className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
              >
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      {account.id}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {account.firstName} {account.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                    {account.username}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{account.email || "-"}</span>
                    {account.phoneNumber && (
                      <span className="text-sm text-muted-foreground">
                        {account.phoneNumber}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(account.role)}>
                    {account.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {account.birthDay ? (
                    <span className="text-sm">
                      {new Date(account.birthDay).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-center">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/accounts/${account.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/accounts/${account.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteAccountButton id={account.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
