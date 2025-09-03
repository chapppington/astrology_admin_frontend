"use client";

import * as React from "react";
import { Button } from "@/ui/shadcn/button";
import { Label } from "@/ui/shadcn/label";
import { toast } from "@/ui/shadcn/sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/shadcn/sheet";
import { Input } from "@/ui/shadcn/input";
import { Checkbox } from "@/ui/shadcn/checkbox";
import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/use-admin";

export interface PartnerEditPopupProps {
  partnerId: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string | null;
  bio?: string | null;
  partnerCode?: string | null;
  commissionRate?: number | null;
  isActive?: boolean | null;
  tonWalletAddress?: string | null;
  onSaved?: () => void;
}

export default function PartnersEditPopup({
  partnerId,
  username,
  email,
  firstName,
  lastName,
  bio,
  partnerCode,
  commissionRate,
  isActive,
  tonWalletAddress,
  onSaved,
}: PartnerEditPopupProps) {
  const [open, setOpen] = useState(false);
  const { partners } = useAdmin();
  const [form, setForm] = useState({
    username: username || "",
    email: email || "",
    first_name: firstName || "",
    last_name: lastName || "",
    bio: bio || "",
    partner_code: partnerCode || "",
    commission_rate:
      commissionRate === null || commissionRate === undefined
        ? ""
        : String(commissionRate),
    is_active: Boolean(isActive),
    ton_wallet_address: tonWalletAddress || "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        username: username || "",
        email: email || "",
        first_name: firstName || "",
        last_name: lastName || "",
        bio: bio || "",
        partner_code: partnerCode || "",
        commission_rate:
          commissionRate === null || commissionRate === undefined
            ? ""
            : String(commissionRate),
        is_active: Boolean(isActive),
        ton_wallet_address: tonWalletAddress || "",
      });
    }
  }, [
    open,
    username,
    email,
    firstName,
    lastName,
    bio,
    partnerCode,
    commissionRate,
    isActive,
    tonWalletAddress,
  ]);

  const handleSave = async () => {
    const payload = {
      username: form.username || undefined,
      email: form.email || undefined,
      first_name: form.first_name || undefined,
      last_name: form.last_name || undefined,
      bio: form.bio || undefined,
      partner_code: form.partner_code || undefined,
      commission_rate: form.commission_rate
        ? Number(form.commission_rate)
        : undefined,
      is_active: form.is_active,
      ton_wallet_address: form.ton_wallet_address || undefined,
    };

    const res = await partners.updateDirect({ partnerId, data: payload });
    if (res) {
      toast.success("Изменения сохранены", {
        description: `Партнёр #${partnerId} обновлён`,
      });
      setOpen(false);
      onSaved?.();
    } else {
      toast.error("Не удалось сохранить", {
        description: "Попробуйте ещё раз",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Редактировать
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-3xl">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Редактирование партнёра #{partnerId}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6 pb-24 px-4 sm:px-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="grid gap-2">
            <Label htmlFor="username">Логин</Label>
            <Input
              id="username"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="first_name">Имя</Label>
              <Input
                id="first_name"
                value={form.first_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, first_name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name">Фамилия</Label>
              <Input
                id="last_name"
                value={form.last_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, last_name: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Био</Label>
            <Input
              id="bio"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="partner_code">Код партнёра</Label>
              <Input
                id="partner_code"
                value={form.partner_code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, partner_code: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="commission_rate">Комиссия (%)</Label>
              <Input
                id="commission_rate"
                type="number"
                value={form.commission_rate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, commission_rate: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ton_wallet_address">TON кошелёк</Label>
            <Input
              id="ton_wallet_address"
              placeholder="EQ... или UQ..."
              value={form.ton_wallet_address}
              onChange={(e) =>
                setForm((f) => ({ ...f, ton_wallet_address: e.target.value }))
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="is_active"
              checked={form.is_active}
              onCheckedChange={(v) =>
                setForm((f) => ({ ...f, is_active: Boolean(v) }))
              }
            />
            <Label htmlFor="is_active">Активен</Label>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4">
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={partners.isUpdating}>
              {partners.isUpdating ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
