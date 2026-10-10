"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { LogIn, LogOut } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";

export const AttendanceCard = ({ onChange }: { onChange: () => void }) => {
  const t = useTranslations();
  const format = useFormatter();
  const [saving, setSaving] = useState(false);

  const onAttendance = async (method: "post" | "patch") => {
    setSaving(true);
    try {
      const res = (await axiosInstance[method]("user/attendance")) as { message: string };
      toast.success(t(res.message));
      onChange();
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(t(message && t.has(message) ? message : "attendance.actionFailed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{t("attendance.today")}</p>
          <p className="text-lg font-semibold">{format.dateTime(new Date(), { dateStyle: "full" })}</p>
        </div>
        <div className="flex gap-3">
          <Button size="lg" className="h-12 flex-1 rounded-xl px-6" disabled={saving} onClick={() => onAttendance("post")}>
            <LogIn />
            {t("attendance.checkIn")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 flex-1 rounded-xl px-6"
            disabled={saving}
            onClick={() => onAttendance("patch")}
          >
            <LogOut />
            {t("attendance.checkOut")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
