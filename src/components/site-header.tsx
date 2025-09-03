"use client";

import { Separator } from "@/ui/shadcn/separator";
import { SidebarTrigger } from "@/ui/shadcn/sidebar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { FinanceRatesDisplay } from "@/components/Finance/FinanceRatesDisplay";
import { usePathname } from "next/navigation";
import { PagesConfig } from "@/config/pages.config";
import { useMemo } from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const currentLabel = useMemo(() => {
    const pages = Object.values(PagesConfig).filter(
      (p) => p.href && p.href !== "#"
    );
    // выбираем самое длинное совпадение пути, чтобы подстраивать заголовок под вложенные страницы
    const match = pages
      .filter((p) => pathname.startsWith(p.href))
      .sort((a, b) => b.href.length - a.href.length)[0];
    return match?.label || PagesConfig.dashboard.label;
  }, [pathname]);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{currentLabel}</h1>
        <div className="ml-auto flex items-center gap-2">
          <FinanceRatesDisplay />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
