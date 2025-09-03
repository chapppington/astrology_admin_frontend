"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/shadcn/sheet";
import { FinanceRatesInfo } from "./FinanceRatesInfo";
import { useFinanceRates } from "../../hooks/use-finance-rates";

interface FinanceRatesSheetProps {
  children: React.ReactNode;
}

export const FinanceRatesSheet = ({ children }: FinanceRatesSheetProps) => {
  const { data } = useFinanceRates();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div onClick={() => console.log("Button clicked!")}>{children}</div>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 sm:w-96">
        <SheetHeader className="px-6">
          <SheetTitle>Курсы валют</SheetTitle>
        </SheetHeader>

        <div className="px-6 mt-6">
          {/* Курсы валют */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">TON/USDT</span>
                <span className="text-lg font-semibold">
                  ${data?.ton?.current_price?.toFixed(4) || "--"}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">TON/RUB</span>
                <span className="text-lg font-semibold">
                  ₽{data?.tonRub?.toFixed(2) || "--"}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">USDT/RUB</span>
                <span className="text-lg font-semibold">
                  ₽{data?.usdtRub?.toFixed(2) || "--"}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">STARS/USDT</span>
                <span className="text-lg font-semibold">
                  ${data?.stars?.usd.toFixed(3) || "--"}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">STARS/RUB</span>
                <span className="text-lg font-semibold">
                  ₽{data?.stars?.rub.toFixed(3) || "--"}
                </span>
              </div>
            </div>
          </div>

          {/* Информация о курсах */}
          <FinanceRatesInfo />
        </div>
      </SheetContent>
    </Sheet>
  );
};
