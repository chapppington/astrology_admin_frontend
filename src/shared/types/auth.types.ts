export const AuthToken = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

export type AuthToken = (typeof AuthToken)[keyof typeof AuthToken];

export const UserRole = {
  ADMIN: "ADMIN",
  PARTNER: "PARTNER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface ITokenInside {
  id: number;
  aud: UserRole; // audience field from JWT
  iat: number;
  exp: number;
}

export type TProtectUserData = Omit<ITokenInside, "iat" | "exp">;

export interface IAdmin {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  role: UserRole;
}

// Профиль администратора/партнёра, возвращаемый бекендом на /admin/profile
export interface IAdminProfile extends IAdmin {
  // Поля партнёра (могут отсутствовать для роли ADMIN)
  partner_code?: string | null;
  commission_rate?: number | null;
  is_active?: boolean | null;
  ton_wallet_address?: string | null;
  // Динамические метрики для партнёра
  total_referrals?: number | null;
  total_earnings?: number | null;
  referral_balance?: number | null;
}

export interface IFormData {
  username: string;
  password: string;
}
