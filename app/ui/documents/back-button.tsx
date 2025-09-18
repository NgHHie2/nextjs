"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/dashboard/documents")
    ) {
      router.back();
    } else {
      router.push("/dashboard/documents");
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleBack}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Documents
    </Button>
  );
}
