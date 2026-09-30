"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";

import i18n, { initI18n } from "@/lib/i18n";

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onLanguageChanged = (lng: string) => {
      document.documentElement.lang = lng;
      document.documentElement.dir = i18n.dir(lng);
    };

    i18n.on("languageChanged", onLanguageChanged);
    initI18n().then(() => {
      onLanguageChanged(i18n.language);
      setReady(true);
    });

    return () => i18n.off("languageChanged", onLanguageChanged);
  }, []);

  if (!ready) return null;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
