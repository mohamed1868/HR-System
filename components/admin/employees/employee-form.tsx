"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import { FieldError } from "@/components/shared/field-error";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/axios";
import type { TUserData } from "@/lib/types";
import { editUserSchema, userSchema } from "@/lib/validations/user";

export const EmployeeForm = ({ id }: { id?: string }) => {
  const t = useTranslations();
  const router = useRouter();
  const [employee, setEmployee] = useState<TUserData | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  useEffect(() => {
    if (!id) return;
    const getEmployee = async () => {
      try {
        const res = await axiosInstance.get(`admin/employee/${id}`);
        setEmployee(res.data);
      } catch {
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };
    getEmployee();
  }, [id]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = (id ? editUserSchema : userSchema).safeParse({
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password") || undefined,
      job: form.get("job"),
      age: Number(form.get("age")),
      salary: Number(form.get("salary")),
      isAdmin: form.get("isAdmin") === "on",
      hireDate: form.get("hireDate") || undefined,
    });

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }
    setErrors({});
    setSaving(true);

    try {
      if (id) await axiosInstance.put(`admin/employee/${id}`, result.data);
      else await axiosInstance.post("admin/employee", result.data);
      toast.success(t(id ? "employees.updated" : "employees.created"));
      router.push("/admin/employees");
    } catch (error) {
      const emailExists = isAxiosError(error) && error.response?.data?.message === "Email already exists";
      toast.error(t(emailExists ? "employees.errors.emailExists" : "employees.saveFailed"));
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">{t("auth.loading")}</p>;
  if (id && !employee) return <p className="text-sm text-muted-foreground">{t("employees.notFound")}</p>;

  const fields = [
    { name: "name", type: "text", value: employee?.name },
    { name: "email", type: "email", value: employee?.email },
    { name: "password", type: "password", value: undefined, placeholder: id ? t("employees.form.passwordHint") : undefined },
    { name: "job", type: "text", value: employee?.job },
    { name: "age", type: "number", value: employee?.age },
    { name: "salary", type: "number", value: employee?.salary },
    { name: "hireDate", type: "date", value: employee?.hireDate ? new Date(employee.hireDate).toISOString().slice(0, 10) : undefined },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t(id ? "employees.edit" : "employees.add")}
        </CardTitle>
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
                  aria-invalid={!!error}
                  className="h-11 rounded-xl dark:scheme-dark"
                />
                <FieldError message={error && t(error)} />
              </div>
            );
          })}

          <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
            <input type="checkbox" name="isAdmin" defaultChecked={employee?.isAdmin} className="size-4 accent-brand" />
            {t("employees.form.isAdmin")}
          </label>

          <div className="flex justify-end gap-2 sm:col-span-2">
            <Link href="/admin/employees" className={buttonVariants({ variant: "outline" })}>
              {t("employees.form.cancel")}
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? t("employees.form.saving") : t("employees.form.save")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
