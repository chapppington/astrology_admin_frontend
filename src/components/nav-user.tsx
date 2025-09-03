"use client";

import { useAdmin } from "@/hooks/use-admin";

import { Avatar, AvatarFallback } from "@/ui/shadcn/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/shadcn/sidebar";

export function NavUser() {
  const { data: profile, isLoading: isProfileLoading, error } = useAdmin();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="w-full justify-start">
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarFallback className="rounded-lg">
              {profile?.username?.slice(0, 2).toUpperCase() || "AD"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {isProfileLoading
                ? "Loading..."
                : error
                ? "Error"
                : profile?.username || "Admin"}
            </span>
            <span className="text-muted-foreground truncate text-xs">
              {profile?.email || "admin@example.com"}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
