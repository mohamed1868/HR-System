"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface IErrorPage {
  error: Error & { digest?: string };
  retry: () => void;
}

const ErrorPage = ({ error, retry }: IErrorPage) => {
  const t = useTranslations();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">{t("error.title")}</CardTitle>
          <CardDescription>{t("error.description")}</CardDescription>
        </CardHeader>

        {(error.message || error.digest) && (
          <CardContent>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs text-muted-foreground">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </CardContent>
        )}

        <CardFooter className="justify-center gap-2">
          <Button onClick={() => retry()}>
            <RotateCcw data-icon="inline-start" />
            {t("error.retry")}
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
            <Home data-icon="inline-start" />
            {t("error.home")}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default ErrorPage;
