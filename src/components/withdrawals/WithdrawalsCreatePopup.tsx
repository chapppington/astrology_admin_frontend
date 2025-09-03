"use client";

import * as React from "react";
import { Button } from "@/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/shadcn/dialog";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { Textarea } from "@/ui/shadcn/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/select";
import { useState, useEffect, useMemo } from "react";
import { toast } from "@/ui/shadcn/sonner";
import { WithdrawalRequest } from "@/shared/types/withdrawals.types";
import { IPartner } from "@/shared/types/partners.types";
import adminsService from "@/services/admins.service";

interface WithdrawalsCreatePopupProps {
  onClose: () => void;
  onSuccess: (withdrawalData: WithdrawalRequest) => void;
}

export function WithdrawalsCreatePopup({
  onClose,
  onSuccess,
}: WithdrawalsCreatePopupProps) {
  const [formData, setFormData] = useState({
    partner_id: "",
    stars_amount: "",
    ton_wallet_address: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partners, setPartners] = useState<IPartner[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(true);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        setLoadingPartners(true);
        const response = await adminsService.listPartners(1, 100); // Получаем всех партнеров
        setPartners(response.data.partners || []);
      } catch {
        toast.error("Ошибка при загрузке партнеров");
      } finally {
        setLoadingPartners(false);
      }
    };

    loadPartners();
  }, []);

  const selectedPartner = useMemo(
    () => partners.find((p) => p.id.toString() === formData.partner_id) || null,
    [partners, formData.partner_id]
  );
  const availableStars = Number(selectedPartner?.referral_balance || 0);
  const requestedStars = Number(formData.stars_amount || 0);
  const isInsufficient = requestedStars > availableStars;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.partner_id ||
      !formData.stars_amount ||
      !formData.ton_wallet_address
    ) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    if (parseInt(formData.stars_amount) <= 0) {
      toast.error("Сумма должна быть больше 0");
      return;
    }

    if (isInsufficient) {
      toast.error(
        `Недостаточно средств. Доступно: ${availableStars.toLocaleString(
          "ru-RU"
        )} зв.`
      );
      return;
    }

    // Простая валидация TON адреса
    if (
      !formData.ton_wallet_address.startsWith("UQ") &&
      !formData.ton_wallet_address.startsWith("EQ")
    ) {
      toast.error("Неверный формат TON адреса");
      return;
    }

    setIsSubmitting(true);

    try {
      const withdrawalData: WithdrawalRequest = {
        partner_id: parseInt(formData.partner_id),
        stars_amount: parseInt(formData.stars_amount),
        ton_wallet_address: formData.ton_wallet_address,
        description: formData.description || undefined,
      };

      onSuccess(withdrawalData);
    } catch {
      toast.error("Ошибка при создании выплаты");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать выплату</DialogTitle>
          <DialogDescription>
            Создайте заявку на вывод средств для партнера
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partner">Партнер *</Label>
            <Select
              value={formData.partner_id}
              onValueChange={(value) => {
                handleInputChange("partner_id", value);
                const p = partners.find((x) => x.id.toString() === value);
                if (p && p.ton_wallet_address) {
                  handleInputChange("ton_wallet_address", p.ton_wallet_address);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите партнера" />
              </SelectTrigger>
              <SelectContent>
                {loadingPartners ? (
                  <SelectItem value="loading" disabled>
                    Загрузка партнеров...
                  </SelectItem>
                ) : partners.length === 0 ? (
                  <SelectItem value="no-partners" disabled>
                    Партнеры не найдены
                  </SelectItem>
                ) : (
                  partners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id.toString()}>
                      {partner.first_name} {partner.last_name || ""} (
                      {partner.partner_code})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stars_amount">Сумма в звездах *</Label>
            <Input
              id="stars_amount"
              type="number"
              placeholder="1000"
              value={formData.stars_amount}
              onChange={(e) =>
                handleInputChange("stars_amount", e.target.value)
              }
              min="1"
            />
            <p
              className={`text-xs ${
                isInsufficient ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              Доступно: {availableStars.toLocaleString("ru-RU")} зв.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ton_wallet_address">TON Кошелек *</Label>
            <Input
              id="ton_wallet_address"
              placeholder="EQD... или UQD..."
              value={formData.ton_wallet_address}
              onChange={(e) =>
                handleInputChange("ton_wallet_address", e.target.value)
              }
            />
            <p className="text-sm text-muted-foreground">
              Адрес должен начинаться с EQ или UQ
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Описание выплаты (необязательно)"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting || isInsufficient}>
              {isSubmitting
                ? "Создание..."
                : isInsufficient
                ? "Недостаточно средств"
                : "Создать выплату"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
