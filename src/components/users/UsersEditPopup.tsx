"use client";

import * as React from "react";
import { Button } from "@/ui/shadcn/button";
import { Label } from "@/ui/shadcn/label";
import { Input } from "@/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/shadcn/sheet";
import { useUsers } from "@/hooks/use-users";
import { toast } from "@/ui/shadcn/sonner";
import { useState } from "react";

export interface UsersEditPopupProps {
  telegramUserId: number;
  firstName: string;
  username?: string;
  accountStatus: "BASIC" | "PREMIUM" | string;
  subscriptionEnd?: string | null;
}

export default function UsersEditPopup({
  telegramUserId,
  firstName,
  username,
  accountStatus,
  subscriptionEnd,
}: UsersEditPopupProps) {
  const { updateUserAsync, updateUserLoading } = useUsers();
  const [open, setOpen] = useState(false);

  const [status, setStatus] = useState<"BASIC" | "PREMIUM">(
    (accountStatus as "BASIC" | "PREMIUM") || "BASIC"
  );
  const [end, setEnd] = useState<string | "">(
    subscriptionEnd ? new Date(subscriptionEnd).toISOString().slice(0, 16) : ""
  );

  const onSave = async () => {
    const payload: {
      account_status: "BASIC" | "PREMIUM";
      subscription_end?: string | null;
    } = { account_status: status };
    if (end === "") {
      payload.subscription_end = null;
    } else {
      // convert local datetime to ISO string
      const local = new Date(end);
      payload.subscription_end = local.toISOString();
    }

    const ok = await updateUserAsync({ telegramUserId, data: payload });
    if (ok) {
      toast.success("Пользователь обновлён", {
        description: `Статус и дата подписки сохранены для ${firstName}${
          username ? ` (@${username})` : ""
        }`,
      });
      setOpen(false);
    } else {
      toast.error("Не удалось обновить пользователя");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Редактировать
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>
            Редактирование: {firstName}
            {username ? ` (@${username})` : ""}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-5 pb-20 px-4 sm:px-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="space-y-2">
            <Label>Статус аккаунта</Label>
            <Select
              value={status}
              onValueChange={(value: "BASIC" | "PREMIUM") => setStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BASIC">BASIC</SelectItem>
                <SelectItem value="PREMIUM">PREMIUM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Дата окончания подписки</Label>
            <Input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Оставьте пустым, чтобы сбросить подписку
            </p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={updateUserLoading}
            >
              Отмена
            </Button>
            <Button onClick={onSave} disabled={updateUserLoading}>
              {updateUserLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
