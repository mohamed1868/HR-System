"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthContext } from "@/context/AuthContext";
import { axiosInstance } from "@/lib/axios";
import { LanguageToggle } from "./language-toggle";

const getInitials = (name?: string) =>
  name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";

export const SiteHeader = () => {
  const t = useTranslations();
  const router = useRouter();
  const { userData, setUserData } = useContext(AuthContext);

  const onLogout = async () => {
    try {
      await axiosInstance.post("logout");
    } catch {
      toast.error(t("auth.logoutFailed"));
      return;
    }
    setUserData(null);
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b bg-sidebar px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />

      <div className="ms-auto flex items-center gap-1">
        <LanguageToggle />

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="h-10 gap-1 px-1.5" />}>
            <Avatar className="size-8">
              <AvatarFallback>{getInitials(userData?.name)}</AvatarFallback>
            </Avatar>
            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-56">
            <div className="flex flex-col px-1.5 py-1">
              <span className="truncate text-sm font-medium">{userData?.name}</span>
              <span className="truncate text-xs text-muted-foreground">{userData?.email}</span>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onLogout}>
              <LogOut />
              {t("auth.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
