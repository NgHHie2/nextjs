// lib/excel-utils.ts (Optional helper file)
import { AccountForm } from "@/app/lib/definitions";
import * as XLSX from "xlsx";

export type BulkAccount = AccountForm & {
  id?: number;
  status?: "pending" | "success" | "error";
  error?: string;
};

export const readExcelFile = (file: File): Promise<BulkAccount[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

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

        resolve(accounts);
      } catch (error) {
        reject(new Error("Error reading Excel file. Please check the format."));
      }
    };

    reader.onerror = () => reject(new Error("Error reading file."));
    reader.readAsBinaryString(file);
  });
};

export const downloadExcelTemplate = () => {
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
