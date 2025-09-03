"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/ui/shadcn/card";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { Badge } from "@/ui/shadcn/badge";
import { toast } from "@/ui/shadcn/sonner";
import { Copy } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/shadcn/sheet";
import { useAdmin } from "@/hooks/use-admin";
import { IAdminProfile, UserRole } from "@/shared/types/auth.types";

export function SettingsPageClient() {
  const { profileQuery, partners } = useAdmin();
  const data = profileQuery.data as IAdminProfile | undefined;
  const isLoading = profileQuery.isLoading;
  const error = profileQuery.error;

  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    ton_wallet_address: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        ton_wallet_address: data.ton_wallet_address || "",
      });
    }
  }, [data, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!data?.id) return;
    setIsUpdating(true);
    try {
      await partners.updateProfile(formData);
      toast.success("Профиль обновлён", { description: "Данные сохранены" });
      setOpen(false);
      profileQuery.refetch();
    } catch {
      toast.error("Ошибка", { description: "Не удалось сохранить" });
    } finally {
      setIsUpdating(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} скопирован`, { description: text });
    } catch {
      toast.error("Не удалось скопировать");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка настроек...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        <p>Ошибка загрузки настроек</p>
      </div>
    );
  }

  if (data?.role !== UserRole.PARTNER) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Доступ запрещен</p>
      </div>
    );
  }

  const fullName = [data?.first_name, data?.last_name]
    .filter(Boolean)
    .join(" ");
  const maskedWallet = data?.ton_wallet_address
    ? `${data.ton_wallet_address.slice(0, 6)}…${data.ton_wallet_address.slice(
        -4
      )}`
    : "—";

  return (
    <div className="px-4 lg:px-6 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Настройки</h1>
          <p className="text-sm text-muted-foreground">
            Компактный просмотр профиля.
          </p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>Редактировать профиль</Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-xl">
            <SheetHeader>
              <SheetTitle>Обновление профиля</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4 px-4 sm:px-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="first_name">Имя</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last_name">Фамилия</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ton_wallet_address">TON кошелёк</Label>
                <Input
                  id="ton_wallet_address"
                  placeholder="EQ... или UQ..."
                  value={formData.ton_wallet_address}
                  onChange={(e) =>
                    handleInputChange("ton_wallet_address", e.target.value)
                  }
                  className="font-mono"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  disabled={isUpdating}
                >
                  Отмена
                </Button>
                <Button onClick={handleSave} disabled={isUpdating}>
                  {isUpdating ? "Сохранение..." : "Сохранить"}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="mt-8">
        <CardContent className="py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Имя</div>
              <div className="font-medium">{fullName || "—"}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Логин</div>
              <div className="font-medium">@{data?.username}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Email</div>
              <div className="font-medium">{data?.email || "—"}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Реферальный код</div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">
                  {data?.partner_code || "—"}
                </span>
                {data?.partner_code && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      copyToClipboard(String(data?.partner_code), "Код")
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Комиссия</div>
              <div className="font-medium">{data?.commission_rate ?? 0}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Статус</div>
              <div>
                <Badge variant={data?.is_active ? "default" : "secondary"}>
                  {data?.is_active ? "Активен" : "Неактивен"}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">TON кошелёк</div>
              <div className="flex items-center gap-2">
                <span className="font-mono">{maskedWallet}</span>
                {data?.ton_wallet_address && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      copyToClipboard(
                        String(data?.ton_wallet_address),
                        "TON кошелёк"
                      )
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
