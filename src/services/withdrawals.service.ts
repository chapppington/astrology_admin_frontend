import { auth_axios } from "@/api/axios";
import {
  WithdrawalsListResponse,
  WithdrawalRequest,
  Withdrawal,
  WithdrawalEditableStatus,
  WithdrawalFilterStatus,
} from "../shared/types/withdrawals.types";

class WithdrawalsService {
  private readonly BASE_URL = "/withdrawals";

  async getWithdrawals(
    page = 1,
    pageSize = 20,
    search?: string,
    status?: WithdrawalFilterStatus
  ): Promise<WithdrawalsListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search && search.trim()) {
      params.append("search", search.trim());
    }
    if (status && status !== "ALL") {
      params.append("status", status);
    }

    const { data } = await auth_axios.get<WithdrawalsListResponse>(
      `${this.BASE_URL}?${params.toString()}`
    );
    return data;
  }

  async createWithdrawal(
    withdrawalData: WithdrawalRequest
  ): Promise<Withdrawal> {
    const { data } = await auth_axios.post<Withdrawal>(
      `${this.BASE_URL}`,
      withdrawalData
    );
    return data;
  }

  async updateWithdrawalStatus(
    withdrawalId: number,
    status: WithdrawalEditableStatus,
    transactionHash?: string,
    errorMessage?: string
  ): Promise<Withdrawal> {
    const updateData: Partial<
      Pick<Withdrawal, "status" | "ton_transaction_hash" | "error_message">
    > & {
      status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    } = { status };
    if (transactionHash) updateData.ton_transaction_hash = transactionHash;
    if (errorMessage) updateData.error_message = errorMessage;

    const { data } = await auth_axios.put<Withdrawal>(
      `${this.BASE_URL}/${withdrawalId}`,
      updateData
    );
    return data;
  }

  async cancelWithdrawal(withdrawalId: number): Promise<boolean> {
    try {
      await auth_axios.post(`${this.BASE_URL}/${withdrawalId}/cancel`);
      return true;
    } catch {
      return false;
    }
  }
}

export const withdrawalsService = new WithdrawalsService();
