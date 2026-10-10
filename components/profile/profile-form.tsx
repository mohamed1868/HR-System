"use client";

import { useContext, useState } from "react";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import { FieldError } from "@/components/shared/field-error";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/context/AuthContext";
import { axiosInstance } from "@/lib/axios";
import { getInitials } from "@/lib/utils";
import { editUserSchema } from "@/lib/validations/user";

export const ProfileForm = () => {
  const t = useTranslations();
  const { userData, setUserData } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const result = editUserSchema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password") || undefined,
      age: Number(form.get("age")),
      ...(userData?.isAdmin && {
        job: form.get("job"),
        salary: Number(form.get("salary")),
        isAdmin: form.get("isAdmin") === "on",
        hireDate: form.get("hireDate") || undefined,
      }),
    });

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }
    setErrors({});
    setSaving(true);

    try {
      const res = await axiosInstance.put("profile", result.data);
      setUserData({ ...userData, ...res.data });
      formElement.password.value = "";
      toast.success(t("profile.updated"));
    } catch (error) {
      const emailExists = isAxiosError(error) && error.response?.data?.message === "Email already exists";
      toast.error(t(emailExists ? "employees.errors.emailExists" : "profile.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  if (!userData) return null;

  const fields = [
    { name: "name", type: "text", value: userData.name },
    { name: "email", type: "email", value: userData.email },
    { name: "password", type: "password", value: undefined, placeholder: t("employees.form.passwordHint") },
    { name: "age", type: "number", value: userData.age },
    { name: "job", type: "text", value: userData.job, adminOnly: true },
    { name: "salary", type: "number", value: userData.salary, adminOnly: true },
    {
      name: "hireDate",
      type: "date",
      value: userData.hireDate ? new Date(userData.hireDate).toISOString().slice(0, 10) : undefined,
      adminOnly: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="bg-brand/10 text-xl font-semibold text-brand">
              {getInitials(userData.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold">{userData.name}</h1>
            <p className="truncate text-sm text-muted-foreground">{userData.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t("profile.edit")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form noValidate onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => {
              const error = errors[field.name]?.[0];
              return (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{t(`employees.form.${field.name}`)}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    defaultValue={field.value}
                    placeholder={field.placeholder}
                    disabled={field.adminOnly && !userData.isAdmin}
                    aria-invalid={!!error}
                    className="h-11 rounded-xl dark:scheme-dark"
                  />
                  <FieldError message={error && t(error)} />
                </div>
              );
            })}
            
            {userData.isAdmin && (
              <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
                <input type="checkbox" name="isAdmin" defaultChecked={userData.isAdmin} className="size-4 accent-brand" />
                {t("employees.form.isAdmin")}
              </label>
            )}

            <div className="flex justify-end sm:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? t("employees.form.saving") : t("employees.form.save")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
