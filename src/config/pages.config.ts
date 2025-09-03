export type PageConfigItem = {
  href: string;
  label: string;
};

export const PagesConfigData = {
  // Auth area
  login: { href: "/login", label: "Вход в систему" },
  // Admin area
  dashboard: { href: "/dashboard", label: "Главная" },
  analytics: { href: "#", label: "Аналитика" },
  users: { href: "/dashboard/users", label: "Пользователи" },
  partners: { href: "/dashboard/partners", label: "Партнеры" },
  payments: { href: "/dashboard/payments", label: "Платежи" },
  stories: { href: "/dashboard/stories", label: "Истории" },
  withdrawals: { href: "/dashboard/withdrawals", label: "Выплаты" },
  // Partner area
  partnerHome: { href: "/profile", label: "Личный кабинет" },
  partnerPayments: { href: "/profile/payments", label: "Платежи" },
  partnerWithdrawals: { href: "/profile/withdrawals", label: "Мои выплаты" },
  partnerReferrals: { href: "/profile/referrals", label: "Рефералы" },
  partnerSettings: { href: "/profile/settings", label: "Настройки" },
};

export type PagesConfigType = typeof PagesConfigData;

export const PagesConfig: PagesConfigType = PagesConfigData;
