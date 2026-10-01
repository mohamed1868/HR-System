"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { LanguageToggle } from "@/components/layout/language-toggle";
import { FieldError } from "@/components/shared/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { axiosInstance } from "@/lib/axios";
import type { TUserData } from "@/lib/types";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

type LoginErrors = Partial<Record<keyof LoginInput, string[]>>;

export const LoginForm = () => {
  const t = useTranslations();
  const router = useRouter();
  const { setUserData } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;
    const result = loginSchema.safeParse({
      email: email,
      password: password,
    });

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const loginRes = (await axiosInstance.post("login", result.data)) as TUserData;
      setUserData(loginRes);
      router.replace(loginRes.isAdmin ? "/admin/dashboard" : "/user/dashboard");
    } catch {
      toast.error(t("auth.invalidCredentials"));
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col p-6 md:p-10">
      <div className="flex justify-end">
        <LanguageToggle />
      </div>

      <div className="flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-sm space-y-6">
          <h1 className="text-center text-2xl font-semibold">
            {t("auth.title")}
          </h1>

          <form noValidate onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">
                {t("auth.email")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t("auth.emailPlaceholder")}
                aria-invalid={!!errors.email}
                className="h-11 rounded-xl"
              />
              <FieldError message={errors.email && t(errors.email[0])} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {t("auth.password")} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder={t("auth.passwordPlaceholder")}
                  aria-invalid={!!errors.password}
                  className="h-11 rounded-xl pe-11"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={t(showPassword ? "auth.hidePassword" : "auth.showPassword")}
                  className="absolute inset-e-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              <FieldError message={errors.password && t(errors.password[0])} />
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-11 w-full rounded-xl"
              disabled={loading}
            >
              {!loading ? t("auth.login") : t("auth.loading")}
            </Button>
          </form>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          © {new Date().getFullYear()} {t("app.name")}. {t("auth.rights")}
        </span>
        <div className="flex gap-4 text-foreground">
          <Link href="#">{t("auth.terms")}</Link>
          <Link href="#">{t("auth.privacy")}</Link>
        </div>
      </footer>
    </section>
  );
};
