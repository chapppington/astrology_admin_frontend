"use client";

import { useState } from "react";
import {
  Withdrawal,
  WithdrawalEditableStatus,
  WithdrawalStatus,
} from "@/shared/types/withdrawals.types";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { toast } from "@/ui/shadcn/sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/ui/shadcn/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/select";
import { useWithdrawals } from "@/hooks/use-withdrawals";

export function ProcessWithdrawalDialog({
  withdrawal,
  onClose,
  onSaved,
}: {
  withdrawal: Withdrawal;
  onClose: () => void;
  onSaved: () => void;
}) {
  const coerceStatus = (s: WithdrawalStatus): WithdrawalEditableStatus =>
    s === "CANCELLED" ? "PROCESSING" : s;
  const [status, setStatus] = useState<WithdrawalEditableStatus>(
    coerceStatus(withdrawal.status)
  );
  const [txid, setTxid] = useState<string>(
    withdrawal.ton_transaction_hash || ""
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { updateWithdrawalStatusAsync, updateWithdrawalStatusLoading } =
    useWithdrawals();

  const onSubmit = async () => {
    try {
      if (status === "COMPLETED" && !txid.trim()) {
        toast.error("Укажите TXID для завершенного вывода");
        return;
      }
      await updateWithdrawalStatusAsync({
        withdrawalId: withdrawal.id,
        status,
        transactionHash: txid.trim() || undefined,
        errorMessage: errorMessage.trim() || undefined,
      });
      toast.success("Статус выплаты обновлен");
      onSaved();
    } catch {
      toast.error("Не удалось обновить статус выплаты");
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Обработка выплаты #{withdrawal.id}</DialogTitle>
          <DialogDescription>
            Измените статус и при необходимости укажите TXID транзакции TON.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Новый статус</Label>
            <Select
              value={status}
              onValueChange={(v) => {
                if (
                  v === "PENDING" ||
                  v === "PROCESSING" ||
                  v === "COMPLETED" ||
                  v === "FAILED"
                ) {
                  setStatus(v);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PROCESSING">Обрабатывается</SelectItem>
                <SelectItem value="COMPLETED">Завершено</SelectItem>
                <SelectItem value="FAILED">Ошибка</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>TXID (TON transaction hash)</Label>
            <Input
              placeholder="например, 1a2b3c..."
              value={txid}
              onChange={(e) => setTxid(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Сообщение об ошибке (если есть)</Label>
            <Input
              placeholder="Описание ошибки"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={updateWithdrawalStatusLoading}
          >
            Отмена
          </Button>
          <Button onClick={onSubmit} disabled={updateWithdrawalStatusLoading}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
