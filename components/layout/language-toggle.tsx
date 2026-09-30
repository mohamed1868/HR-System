"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

export const LanguageToggle = () => {
  const { t, i18n } = useTranslation();
  const next = i18n.resolvedLanguage === "ar" ? "en" : "ar";

  return (
    <Button variant="ghost" onClick={() => i18n.changeLanguage(next)} aria-label={t("language.toggle")}>
      <Languages data-icon="inline-start" />
      {t(`language.${next}`)}
    </Button>
  );
};
