"use client";

import { type Icon } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/shadcn/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={(function () {
                  const normalize = (s: string) => s.replace(/\/+$/, "");
                  const current = normalize(pathname || "");
                  const target = normalize(item.url || "");
                  if (!target || target === "#") return false;
                  // Корневые страницы активны только по точному совпадению
                  if (target === "/dashboard" || target === "/profile") {
                    return current === target;
                  }
                  // Для остальных разрешаем точное совпадение или префикс
                  return current === target || current.startsWith(`${target}/`);
                })()}
                className="
                  data-[active=true]:!bg-black
                  data-[active=true]:!text-white
                  data-[active=true]:!border
                  data-[active=true]:!border-transparent
                  data-[active=true]:shadow-sm
                  dark:data-[active=true]:!bg-white
                  dark:data-[active=true]:!text-neutral-900
                  dark:data-[active=true]:!border-neutral-200
                  data-[active=true]:[&>svg]:!text-white
                  dark:data-[active=true]:[&>svg]:!text-neutral-900
                "
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
