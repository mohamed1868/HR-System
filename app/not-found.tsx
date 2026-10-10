"use client";

import Link from "next/link";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  const t = useTranslations();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-6xl font-bold tracking-tight text-muted-foreground">404</p>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">{t("notFound.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("notFound.description")}</p>
      </div>
      <Button nativeButton={false} render={<Link href="/" />}>
        {t("notFound.home")}
      </Button>
    </main>
  );
};

export default NotFound;
