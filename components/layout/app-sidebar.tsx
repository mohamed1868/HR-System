"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { accountNav, adminNav, userNav } from "@/config/nav";
import { ThemeToggle } from "./theme-toggle";

export const AppSidebar = () => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const t = useTranslations();
  const locale = useLocale();
  const { state, toggleSidebar } = useSidebar();
  const items = [...(isAdmin ? adminNav : userNav), ...accountNav];
  const isRtl = locale === "ar";
  const CollapseIcon = (state === "collapsed") !== isRtl ? ChevronsRight : ChevronsLeft;

  return (
    <Sidebar collapsible="icon" side={isRtl ? "right" : "left"}>
      <SidebarHeader className="h-16 flex-row items-center justify-between px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
        <Link
          href={isAdmin ? "/admin/dashboard" : "/user/dashboard"}
          className="flex items-center gap-2 font-semibold group-data-[collapsible=icon]:hidden"
        >
          <span className="text-2xl font-bold text-brand">H</span>
          <span className="text-lg">{t("app.name")}</span>
        </Link>
        <Button variant="ghost" size="icon-sm" onClick={toggleSidebar} className="text-muted-foreground">
          <CollapseIcon />
          <span className="sr-only">{t("nav.collapse")}</span>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={t(item.titleKey)}
                    render={<Link href={item.href} />}
                    className="h-11 px-3 text-muted-foreground data-active:bg-brand data-active:text-brand-foreground data-active:shadow-lg data-active:shadow-brand/25 hover:data-active:bg-brand hover:data-active:text-brand-foreground"
                  >
                    <item.icon />
                    <span>{t(item.titleKey)}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
        <ThemeToggle />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
