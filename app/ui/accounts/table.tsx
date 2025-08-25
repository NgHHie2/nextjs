import Link from "next/link";
import { PencilIcon, EyeIcon } from "@heroicons/react/24/outline";
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

export default async function AccountsTable({ query }: { query: string }) {
  // Gọi thẳng từ server
  console.log("query: ", query);
  const data = await fetchAllAccounts(query);

  const pageData: {
    content: Account[];
    totalPages: number;
    totalElements: number;
  } = {
    content: data.content ?? [],
    totalPages: data.totalPages ?? 0,
    totalElements: data.totalElements ?? 0,
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageData.content.map((account) => (
            <TableRow key={account.id}>
              <TableCell>
                {account.firstName} {account.lastName}
              </TableCell>
              <TableCell>{account.username}</TableCell>
              <TableCell>{account.email}</TableCell>
              <TableCell className="flex gap-2">
                <Link href={`/dashboard/accounts/${account.id}`} title="View">
                  <EyeIcon className="w-5" />
                </Link>
                <Link
                  href={`/dashboard/accounts/${account.id}/edit`}
                  title="Edit"
                >
                  <PencilIcon className="w-5" />
                </Link>
                <DeleteAccountButton id={account.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
