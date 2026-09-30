"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

const themes = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
];

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
      {themes.map(({ value, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={cn(
            "flex h-9 items-center justify-center gap-2 rounded-lg text-sm text-muted-foreground transition-colors",
            resolvedTheme === value && "bg-card text-foreground shadow-sm"
          )}
        >
          <Icon className="size-4" />
          {t(`theme.${value}`)}
        </button>
      ))}
    </div>
  );
};
