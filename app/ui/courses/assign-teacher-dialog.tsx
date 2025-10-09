// app/ui/courses/assign-account-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Loader2, X, UserCheck } from "lucide-react";
import { fetchAllPositions } from "@/app/lib/data/document-data";
import {
  searchTeacherByCccd,
  assignTeachersToCourse,
} from "@/app/lib/data/course-data";
import { Position, Account } from "@/app/lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/app/lib/auth/auth-context";

interface AssignTeacherDialogProps {
  semesterId: number;
  existingTeacherIds: number[];
  onTeacherAssigned?: () => void;
}

interface PendingAssignment {
  account: Account;
}

export default function AssignTeacherDialog({
  semesterId,
  existingTeacherIds,
  onTeacherAssigned,
}: AssignTeacherDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [foundAccounts, setFoundAccounts] = useState<Account[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<
    PendingAssignment[]
  >([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError("Please enter a search query");
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setFoundAccounts([]);

    try {
      const accounts = await searchTeacherByCccd(searchQuery.trim());
      setFoundAccounts(Array.isArray(accounts) ? accounts : [accounts]);
    } catch (error) {
      console.error("Search error:", error);
      if (error instanceof Error) {
        setSearchError(error.message);
      } else {
        setSearchError("No accounts found");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToPending = (account: Account) => {
    // Check if this account is already in the course
    const isAlreadyInCourse = existingTeacherIds.includes(account.id);
    if (isAlreadyInCourse) {
      setSearchError("This account is already in the course");
      return;
    }

    // Check if this account is already in pending assignments
    const isAlreadyPending = pendingAssignments.some(
      (assignment) => assignment.account.id === account.id
    );

    if (isAlreadyPending) {
      setSearchError("This account is already added to the assignment list");
      return;
    }

    const newAssignment: PendingAssignment = {
      account,
    };

    setPendingAssignments((prev) => [...prev, newAssignment]);
    setSearchError(null);
  };

  const handleRemoveFromPending = (accountId: number) => {
    setPendingAssignments((prev) =>
      prev.filter((assignment) => assignment.account.id !== accountId)
    );
  };

  const handleConfirmAssignment = async () => {
    if (pendingAssignments.length === 0) {
      setSearchError("No accounts to assign");
      return;
    }

    setIsAssigning(true);
    setSearchError(null);

    try {
      const teacherIds: number[] = pendingAssignments.map(
        (assignment) => assignment.account.id
      );
      await assignTeachersToCourse(semesterId, teacherIds);

      // Reset form and close dialog
      handleClose();

      // Notify parent component
      onTeacherAssigned?.();
    } catch (error) {
      console.error("Assign error:", error);
      if (error instanceof Error) {
        setSearchError(error.message);
      } else {
        setSearchError("Failed to assign teachers");
      }
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSearchQuery("");
    setFoundAccounts([]);
    setPendingAssignments([]);
    setSearchError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    isAdmin && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="w-[140px]">
            <Plus className="h-4 w-4" />
            Assign Teacher
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Teachers To This Course</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Section */}
            <div className="space-y-2">
              <Label htmlFor="searchQuery">Search Teachers</Label>
              <div className="flex gap-2">
                <Input
                  id="searchQuery"
                  placeholder="Enter CCCD"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSearching}
                />
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Found Teachers */}
            <div className="space-y-2">
              <Label>Found Teachers</Label>
              <div className="border rounded-lg bg-accent/50 h-24 overflow-y-auto">
                {searchError ? (
                  <span className="text-sm text-red-500">No teacher found</span>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>CCCD</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {foundAccounts.map((account) => {
                        const isAlreadyInCourse = existingTeacherIds.includes(
                          account.id
                        );
                        const isAlreadyAdded = pendingAssignments.some(
                          (assignment) => assignment.account.id === account.id
                        );

                        return (
                          <TableRow key={account.id}>
                            <TableCell className="w-1/2">
                              {account.lastName} {account.firstName}
                            </TableCell>
                            <TableCell className="w-[30%]">
                              {account.cccd}
                            </TableCell>
                            <TableCell className="w-[20%] text-center">
                              {isAlreadyInCourse ? (
                                <Badge
                                  variant="secondary"
                                  className="px-2 py-0.5"
                                >
                                  In Course
                                </Badge>
                              ) : isAlreadyAdded ? (
                                <Badge
                                  variant="secondary"
                                  className="px-2 py-0.5"
                                >
                                  Pending
                                </Badge>
                              ) : (
                                <Button
                                  onClick={() => handleAddToPending(account)}
                                  size="sm"
                                  variant="outline"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>

            {/* Pending Assignments */}

            <div className="space-y-2">
              <Label>
                Teachers to be Assigned ({pendingAssignments.length})
              </Label>
              <div className="border rounded-lg bg-accent/50 h-48 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>CCCD</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingAssignments.map((assignment) => (
                      <TableRow key={assignment.account.id}>
                        <TableCell className="w-[50%]">
                          {assignment.account.lastName}{" "}
                          {assignment.account.firstName}
                        </TableCell>
                        <TableCell className="w-[30%]">
                          {assignment.account.cccd}
                        </TableCell>

                        <TableCell className="w-[20%] text-center">
                          <Button
                            onClick={() =>
                              handleRemoveFromPending(assignment.account.id)
                            }
                            size="sm"
                            variant="ghost"
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAssignment}
              disabled={isAssigning || pendingAssignments.length === 0}
            >
              {isAssigning ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <UserCheck className="h-4 w-4 mr-2" />
              )}
              Assign {pendingAssignments.length} Teacher
              {pendingAssignments.length > 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  );
}
