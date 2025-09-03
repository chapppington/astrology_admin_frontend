export interface Payment {
  id: number;
  telegram_user_id: number;
  telegram_payment_id: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  used_for_subscription: boolean;
  // Реферальная система
  partner_id?: number | null;
  partner_commission_amount?: number | null;
}

export interface PaymentsListResponse {
  items: Payment[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}
