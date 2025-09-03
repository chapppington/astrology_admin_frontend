export type WithdrawalStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type WithdrawalEditableStatus = Exclude<WithdrawalStatus, "CANCELLED">;

export type WithdrawalFilterStatus = "ALL" | WithdrawalStatus;

export interface Withdrawal {
  id: number;
  partner_id: number;
  partner_name?: string;
  partner_code?: string;
  stars_amount: number;
  ton_stars_rate: number;
  ton_amount: number;
  ton_wallet_address: string;
  status: WithdrawalStatus;
  description?: string;
  error_message?: string;
  ton_transaction_hash?: string;
  created_at: string;
  updated_at: string;
  processed_at?: string;
  completed_at?: string;
}

export interface WithdrawalRequest {
  partner_id: number;
  stars_amount: number;
  ton_wallet_address: string;
  description?: string;
}

export interface WithdrawalsListResponse {
  items: Withdrawal[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}
