"use client";

import { useTransition } from "react";
import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { setLocale } from "@/i18n/actions";

export const LanguageToggle = () => {
  const t = useTranslations();
  const next = useLocale() === "ar" ? "en" : "ar";
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      disabled={isPending}
      onClick={() => startTransition(() => setLocale(next))}
      aria-label={t("language.toggle")}
    >
      <Languages data-icon="inline-start" />
      {t(`language.${next}`)}
    </Button>
  );
};
