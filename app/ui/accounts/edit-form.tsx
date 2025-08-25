"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Account } from "@/app/lib/definitions";
import { updateAccount } from "@/app/lib/data/account-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, X } from "lucide-react";

export default function EditAccountForm({ account }: { account: Account }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState<Account>({
    id: account.id,
    username: account.username,
    firstName: account.firstName,
    lastName: account.lastName,
    birthDay: account.birthDay ? account.birthDay.split("T")[0] : "", // Convert to date format
    phoneNumber: account.phoneNumber || "",
    email: account.email || "",
    cccd: account.cccd || "",
    role: account.role || "STUDENT",
  });

  const handleInputChange = (field: keyof Account, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(""); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.firstName?.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.lastName?.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!formData.cccd?.trim()) {
      setError("CCCD is required");
      return false;
    }
    if (
      formData.cccd &&
      (formData.cccd.length < 9 || formData.cccd.length > 12)
    ) {
      setError("CCCD must be between 9 and 12 characters");
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await updateAccount(account.id, formData);
      router.push("/dashboard/accounts");
      router.refresh();
    } catch (error) {
      console.error("Error updating account:", error);
      setError("Failed to update account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Account</CardTitle>
          <CardDescription>
            Update account information. Fields marked with * are required.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Username cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="TEACHER">Teacher</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDay">Date of Birth</Label>
              <Input
                id="birthDay"
                type="date"
                value={formData.birthDay}
                onChange={(e) => handleInputChange("birthDay", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cccd">CCCD *</Label>
              <Input
                id="cccd"
                value={formData.cccd}
                onChange={(e) => handleInputChange("cccd", e.target.value)}
                placeholder="Enter CCCD (9-12 digits)"
                minLength={9}
                maxLength={12}
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/accounts">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Link>
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Account
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
