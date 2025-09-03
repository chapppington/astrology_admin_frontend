"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconInnerShadowTop,
  IconLogout,
  IconUsers,
  IconStar,
  IconCreditCard,
  IconBook,
  IconSettings,
  IconWallet,
} from "@tabler/icons-react";
import { type Icon } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/shadcn/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { type NavigationItem } from "@/config/navigation.config";
import Link from "next/link";

// Icon mapping
const iconMap: Record<string, Icon> = {
  IconDashboard,
  IconChartBar,
  IconUsers,
  IconStar,
  IconCreditCard,
  IconBook,
  IconSettings,
  IconWallet,
};

export function AppSidebar({
  navMainItems,
  navSecondaryItems,
  homeHref,
  brand = "Navika",
  ...props
}: {
  navMainItems?: NavigationItem[];
  navSecondaryItems?: NavigationItem[];
  homeHref?: string;
  brand?: string;
} & React.ComponentProps<typeof Sidebar>) {
  const { logout, isLogoutLoading } = useAuth();

  // Convert navigation items to include actual icon components
  const processNavItems = (items: NavigationItem[]) =>
    items.map((item) => ({
      ...item,
      icon: iconMap[item.iconName],
    }));

  const mainItems = processNavItems(navMainItems ?? []);
  const secondaryItems = processNavItems(navSecondaryItems ?? []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={homeHref ?? "/"}>
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">{brand}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mainItems} />
        <NavSecondary items={secondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => logout()}
              disabled={isLogoutLoading}
              className="w-full justify-start"
            >
              <IconLogout className="mr-2" />
              {isLogoutLoading ? "Выход..." : "Выйти"}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
