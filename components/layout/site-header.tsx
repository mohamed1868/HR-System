"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LanguageToggle } from "./language-toggle";

export const SiteHeader = () => {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b bg-sidebar px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />

      <div className="ms-auto flex items-center gap-1">
        <LanguageToggle />

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="h-10 gap-1 px-1.5" />}>
            <Avatar className="size-8">
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem render={<Link href="/profile" />}>{t("nav.profile")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
