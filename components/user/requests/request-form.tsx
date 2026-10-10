"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import { FieldError } from "@/components/shared/field-error";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { RequestStatus, RequestType } from "@/lib/generated/prisma/enums";
import type { TRequestData } from "@/lib/types";
import { editRequestSchema, requestSchema } from "@/lib/validations/request";

const toTimeValue = (value?: Date | string | null) =>
  value ? new Date(value).toTimeString().slice(0, 5) : undefined;

export const RequestForm = ({ id }: { id?: string }) => {
  const t = useTranslations();
  const router = useRouter();
  const [request, setRequest] = useState<TRequestData | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  useEffect(() => {
    if (!id) return;
    const getRequest = async () => {
      try {
        const res = await axiosInstance.get(`user/requests/${id}`);
        setRequest(res.data);
      } catch {
        setRequest(null);
      } finally {
        setLoading(false);
      }
    };
    getRequest();
  }, [id]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const date = form.get("date");
    const fromTime = form.get("fromTime");
    const toTime = form.get("toTime");
    const result = (id ? editRequestSchema : requestSchema).safeParse({
      type: form.get("type"),
      note: form.get("note"),
      date,
      fromTime: fromTime ? `${date}T${fromTime}` : undefined,
      toTime: toTime ? `${date}T${toTime}` : undefined,
    });

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    const { fromTime: from, toTime: to } = result.data;
    if (from && to && to <= from) {
      setErrors({ toTime: ["requests.errors.timeRange"] });
      return;
    }
    setErrors({});
    setSaving(true);

    try {
      if (id) await axiosInstance.put(`user/requests/${id}`, result.data);
      else await axiosInstance.post("user/requests", result.data);
      toast.success(t(id ? "requests.updated" : "requests.created"));
      router.push("/user/requests");
    } catch {
      toast.error(t("requests.saveFailed"));
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">{t("auth.loading")}</p>;
  if (id && !request) return <p className="text-sm text-muted-foreground">{t("requests.notFound")}</p>;
  if (request && request.status !== RequestStatus.PENDING) {
    return <p className="text-sm text-muted-foreground">{t("requests.locked")}</p>;
  }

  const typeItems = Object.values(RequestType).map((type) => ({ value: type, label: t(`requests.type.${type}`) }));

  const fields = [
    { name: "date", type: "date", value: request ? new Date(request.date).toISOString().slice(0, 10) : undefined },
    { name: "fromTime", type: "time", value: toTimeValue(request?.fromTime) },
    { name: "toTime", type: "time", value: toTimeValue(request?.toTime) },
    { name: "note", type: "text", value: request?.note, className: "sm:col-span-2" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t(id ? "requests.edit" : "requests.add")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="type">{t("requests.form.type")}</Label>
            <Select name="type" items={typeItems} defaultValue={request?.type ?? RequestType.LEAVE}>
              <SelectTrigger
                id="type"
                aria-invalid={!!errors.type}
                className="w-full rounded-xl data-[size=default]:h-11"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.type?.[0] && t(errors.type[0])} />
          </div>

          {fields.map((field) => {
            const error = errors[field.name]?.[0];
            return (
              <div key={field.name} className={`space-y-2 ${field.className ?? ""}`}>
                <Label htmlFor={field.name}>{t(`requests.form.${field.name}`)}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  defaultValue={field.value}
                  aria-invalid={!!error}
                  className="h-11 rounded-xl dark:scheme-dark"
                />
                <FieldError message={error && t(error)} />
              </div>
            );
          })}

          <div className="flex justify-end gap-2 sm:col-span-2">
            <Link href="/user/requests" className={buttonVariants({ variant: "outline" })}>
              {t("requests.form.cancel")}
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? t("requests.form.saving") : t("requests.form.save")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
