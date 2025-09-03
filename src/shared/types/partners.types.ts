export interface IPartner {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name?: string;
  bio?: string;
  role: string; // 'PARTNER'
  partner_code?: string;
  commission_rate?: number;
  is_active?: boolean;
  ton_wallet_address?: string | null;
  // Реферальная статистика
  total_referrals?: number | null;
  total_earnings?: number | null; // в звездах
  referral_balance?: number | null; // в звездах
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface IPartnerListResponse {
  partners: IPartner[];
  total: number;
  page: number;
  page_size: number;
}

export interface ICreatePartnerForm {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name?: string;
  bio?: string;
  partner_code: string;
  commission_rate?: number;
  ton_wallet_address?: string; // optional
}

export interface IUpdatePartnerForm {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  partner_code?: string;
  commission_rate?: number;
  is_active?: boolean;
  ton_wallet_address?: string;
}
