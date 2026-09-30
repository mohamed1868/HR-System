"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

const themes = [
  { value: "light", icon: Sun, active: "not-dark:bg-card not-dark:text-foreground not-dark:shadow-sm" },
  { value: "dark", icon: Moon, active: "dark:bg-card dark:text-foreground dark:shadow-sm" },
];

export const ThemeToggle = () => {
  const { setTheme } = useTheme();
  const t = useTranslations();

  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
      {themes.map(({ value, icon: Icon, active }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={cn(
            "flex h-9 items-center justify-center gap-2 rounded-lg text-sm text-muted-foreground transition-colors",
            active
          )}
        >
          <Icon className="size-4" />
          {t(`theme.${value}`)}
        </button>
      ))}
    </div>
  );
};
