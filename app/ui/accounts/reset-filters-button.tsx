"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function ResetFiltersButton() {
  const router = useRouter();
  const pathname = usePathname();

  const handleReset = () => {
    router.replace(pathname);
  };

  return (
    <Button
      variant="secondary"
      onClick={handleReset}
      className="whitespace-nowrap"
    >
      Reset filter
    </Button>
  );
}
