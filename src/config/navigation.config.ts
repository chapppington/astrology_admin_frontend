import { ADMIN_PAGES } from "./pages/admin.config";
import { PARTNER_PAGES } from "./pages/partner.config";

export type NavigationItem = {
  title: string;
  url: string;
  iconName: string;
};

export const buildAdminNavigation = () => ({
  brand: "Navika",
  navMain: [
    {
      title: "Главная",
      url: ADMIN_PAGES.HOME,
      iconName: "IconDashboard",
    },
    // { title: "Аналитика", url: "#", iconName: "IconChartBar" },
    { title: "Пользователи", url: ADMIN_PAGES.USERS, iconName: "IconUsers" },
    { title: "Партнеры", url: ADMIN_PAGES.PARTNERS, iconName: "IconStar" },
    { title: "Платежи", url: ADMIN_PAGES.PAYMENTS, iconName: "IconCreditCard" },
    { title: "Истории", url: ADMIN_PAGES.STORIES, iconName: "IconBook" },
    { title: "Выплаты", url: ADMIN_PAGES.WITHDRAWALS, iconName: "IconWallet" },
  ],
  navSecondary: [{ title: "Настройки", url: "#", iconName: "IconSettings" }],
});

export const buildPartnerNavigation = () => ({
  brand: "Navika Partners",
  navMain: [
    { title: "Профиль", url: PARTNER_PAGES.HOME, iconName: "IconDashboard" },
    {
      title: "Платежи",
      url: PARTNER_PAGES.PAYMENTS,
      iconName: "IconCreditCard",
    },
    {
      title: "Выплаты",
      url: PARTNER_PAGES.WITHDRAWALS,
      iconName: "IconWallet",
    },
    { title: "Рефералы", url: PARTNER_PAGES.REFERRALS, iconName: "IconUsers" },
  ],
  navSecondary: [
    {
      title: "Настройки",
      url: PARTNER_PAGES.SETTINGS,
      iconName: "IconSettings",
    },
  ],
});
