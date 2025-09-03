export interface User {
  id: number;
  telegram_chat_id: number;
  telegram_user_id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  account_status: string;
  birth_date: string;
  birth_time: string;
  birth_city: string;
  birth_country: string;
  zodiac_sign?: string;
  matrix_of_cosmic_angles?: string;
  created_at: string;
  updated_at: string;
  subscription_start?: string;
  subscription_end?: string;
  // Реферальная система
  partner_id?: number | null;
}

export interface UsersListResponse {
  items: User[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}
