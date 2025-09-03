"use client";

import { Button } from "@/ui/shadcn/button";
import { Info } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/shadcn/sheet";

export const FinanceRatesInfo = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-muted-foreground hover:text-foreground"
        >
          <Info className="h-4 w-4 mr-2" />
          О курсах
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 sm:w-96">
        <SheetHeader className="px-6">
          <SheetTitle>Откуда берутся курсы?</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-6 px-6">
          <div className="space-y-3">
            <div>
              <h5 className="font-semibold text-sm text-foreground mb-2">
                TON/USDT
              </h5>
              <p className="text-sm text-muted-foreground">
                Прямые котировки с Binance - крупнейшей в мире криптобиржи.
                Данные обновляются в реальном времени каждые 2 минуты.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-sm text-foreground mb-2">
                USDT/RUB
              </h5>
              <p className="text-sm text-muted-foreground">
                Официальный курс Binance для фиатных валют. Используется для
                расчета курсов в рублях.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-sm text-foreground mb-2">
                TON/RUB
              </h5>
              <p className="text-sm text-muted-foreground">
                Реальный курс TON к рублю, рассчитанный на основе TON/USDT и
                USDT/RUB с Binance. Автоматически пересчитывается при изменении
                базовых курсов.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-sm text-foreground mb-2">
                STARS/USDT
              </h5>
              <p className="text-sm text-muted-foreground">
                Фиксированный курс токена STARS к USDT.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-sm text-foreground mb-2">
                STARS/RUB
              </h5>
              <p className="text-sm text-muted-foreground">
                Расчетный курс STARS к рублю на основе STARS/USDT и USDT/RUB.
                Обновляется автоматически при изменении курсов.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t px-0">
            <p className="text-xs text-muted-foreground">
              💡 Все курсы обновляются автоматически каждые 2 минуты
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
