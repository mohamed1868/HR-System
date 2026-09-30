"use client";

import { useTranslations } from "next-intl";

export const LoginHero = () => {
  const t = useTranslations();

  return (
    <section className="relative hidden overflow-hidden bg-[#1f2a37] bg-[url('/images/login.jpg')] bg-cover bg-center p-10 text-white lg:flex lg:flex-col lg:justify-end">
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/10" />

      <div className="relative space-y-6">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-2xl font-bold text-brand">H</span>
          <span className="text-lg">{t("app.name")}</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-semibold">{t("auth.heroTitle")}</h2>
          <p className="max-w-lg text-lg leading-relaxed text-white/85">{t("auth.heroQuote")}</p>
        </div>
      </div>
    </section>
  );
};
