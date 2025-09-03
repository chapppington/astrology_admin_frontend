"use client";

import { Button } from "@/ui/shadcn/button";
import { Coins } from "lucide-react";

interface FinanceRatesButtonProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

export const FinanceRatesButton = ({
  disabled,
  children,
}: FinanceRatesButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
      disabled={disabled}
    >
      {children || <Coins className="h-4 w-4" />}
    </Button>
  );
};
