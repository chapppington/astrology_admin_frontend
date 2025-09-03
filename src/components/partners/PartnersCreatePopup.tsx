"use client";

import * as React from "react";
import { Button } from "@/ui/shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/shadcn/sheet";
import { Label } from "@/ui/shadcn/label";
import { Input } from "@/ui/shadcn/input";
import { useAdmin } from "@/hooks/use-admin";
import { useState } from "react";

interface PartnersCreatePopupProps {
  onCreated?: () => void;
}

export default function PartnersCreatePopup({
  onCreated,
}: PartnersCreatePopupProps) {
  const { partners } = useAdmin();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    bio: "",
    partner_code: "",
    commission_rate: "",
    ton_wallet_address: "",
  });

  const onSubmit = async () => {
    await partners.create({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      first_name: form.first_name.trim(),
      last_name: form.last_name ? form.last_name.trim() : undefined,
      bio: form.bio ? form.bio.trim() : undefined,
      partner_code: form.partner_code.trim(),
      commission_rate: form.commission_rate
        ? Number(form.commission_rate)
        : undefined,
      ton_wallet_address: form.ton_wallet_address.trim() || undefined,
    });
    onCreated?.();
    setOpen(false);
    setForm({
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      bio: "",
      partner_code: "",
      commission_rate: "",
      ton_wallet_address: "",
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Создать партнера</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-3xl">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Новый партнер</SheetTitle>
        </SheetHeader>
        <div className="mt-6 grid gap-4 px-4 sm:px-6 pb-24 overflow-y-auto max-h-[calc(100vh-200px)]">
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
          <div className="grid gap-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
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
              <Label htmlFor="partner_code">Код партнера</Label>
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
            <Label htmlFor="ton_wallet_address">
              TON кошелёк (опционально)
            </Label>
            <Input
              id="ton_wallet_address"
              placeholder="EQ... или UQ..."
              value={form.ton_wallet_address}
              onChange={(e) =>
                setForm((f) => ({ ...f, ton_wallet_address: e.target.value }))
              }
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4">
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button onClick={onSubmit}>Создать</Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
