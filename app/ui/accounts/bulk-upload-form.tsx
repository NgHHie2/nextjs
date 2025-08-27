// app/ui/accounts/bulk-upload-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Trash2 } from "lucide-react";
import { createAccount } from "@/app/lib/data/account-data";
import { AccountForm } from "@/app/lib/definitions";
import * as XLSX from "xlsx";

type BulkAccount = AccountForm & {
  id?: number;
  status?: "pending" | "success" | "error";
  error?: string;
};

export default function BulkUploadForm() {
  const router = useRouter();
  const [bulkAccounts, setBulkAccounts] = useState<BulkAccount[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Convert to BulkAccount format
        const accounts: BulkAccount[] = jsonData.map((row: any, index) => ({
          id: index + 1,
          cccd: row.cccd || row.CCCD || row.Cccd || "",
          username: row.username || row.Username || "",
          password: row.password || row.Password || "",
          firstName: row.firstName || row.FirstName || row["First Name"] || "",
          lastName: row.lastName || row.LastName || row["Last Name"] || "",
          email: row.email || row.Email || "",
          phoneNumber: row.phoneNumber || row.PhoneNumber || row.Phone || "",
          birthDay: row.birthDay || row.BirthDay || row.Birthday || "",
          status: "pending",
        }));

        setBulkAccounts(accounts);
      } catch (error) {
        alert("Error reading Excel file. Please check the format.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const processBulkAccounts = async () => {
    setIsProcessing(true);
    const updatedAccounts = [...bulkAccounts];

    for (let i = 0; i < updatedAccounts.length; i++) {
      try {
        const account = updatedAccounts[i];
        await createAccount({
          cccd: account.cccd,
          username: account.username,
          password: account.password,
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          phoneNumber: account.phoneNumber,
          birthDay: account.birthDay,
        });
        updatedAccounts[i].status = "success";
      } catch (error) {
        updatedAccounts[i].status = "error";
        updatedAccounts[i].error = "Failed to create";
      }
      setBulkAccounts([...updatedAccounts]);
    }

    setIsProcessing(false);

    // Check if all successful
    const allSuccess = updatedAccounts.every((acc) => acc.status === "success");
    if (allSuccess) {
      setTimeout(() => {
        router.push("/dashboard/accounts");
        router.refresh();
      }, 1000);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        username: "john_doe",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phoneNumber: "1234567890",
        birthDay: "1990-01-01",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Accounts");
    XLSX.writeFile(wb, "accounts_template.xlsx");
  };

  const clearBulkData = () => {
    setBulkAccounts([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          onClick={downloadTemplate}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Template
        </Button>

        <Button
          variant="outline"
          className="relative overflow-hidden cursor-pointer"
        >
          <Upload className="h-4 w-4 mr-2" />
          {selectedFileName || "Upload Excel"}
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </Button>

        {bulkAccounts.length > 0 && (
          <Button variant="destructive" size="sm" onClick={clearBulkData}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {bulkAccounts.length > 0 && (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bulkAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.username}</TableCell>
                    <TableCell>
                      {account.firstName} {account.lastName}
                    </TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.phoneNumber}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          account.status === "success"
                            ? "default"
                            : account.status === "error"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {account.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard/accounts">Cancel</Link>
            </Button>
            <Button onClick={processBulkAccounts} disabled={isProcessing}>
              {isProcessing
                ? "Processing..."
                : `Create ${bulkAccounts.length} Accounts`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
