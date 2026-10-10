"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { ReceiptText, Search } from "lucide-react";
import { useTimeZone, useTranslations } from "next-intl";
import { toast } from "sonner";

import { PayslipCard } from "@/components/user/payslips/payslip-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { axiosInstance } from "@/lib/axios";
import type { TPayslipData } from "@/lib/types";

export const PayslipView = () => {
  const t = useTranslations();
  const timeZone = useTimeZone();
  const [month, setMonth] = useState(() => new Date().toLocaleDateString("en-CA", { timeZone }).slice(0, 7));
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [payslip, setPayslip] = useState<TPayslipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const getPayslip = async () => {
      const [year, monthNumber] = month.split("-");
      try {
        const res = await axiosInstance.get("user/payslips", { params: { month: monthNumber, year } });
        setPayslip(res.data);
        setErrorMessage("");
      } catch (error) {
        const message = isAxiosError(error) ? error.response?.data?.message : undefined;
        setPayslip(null);
        setErrorMessage(typeof message === "string" ? message : "");
      } finally {
        setLoading(false);
      }
    };
    getPayslip();
  }, [month, refresh]);

  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedMonth) {
      toast.error(t("common.errors.monthInvalid"));
      return;
    }
    setLoading(true);
    setMonth(selectedMonth);
    setRefresh((value) => value + 1);
  };

  return (
    <>
      <Card className="py-0">
        <form onSubmit={onSearch} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <Label htmlFor="month">{t("payslips.month")}</Label>
            <Input
              id="month"
              type="month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="h-10 w-auto rounded-xl dark:scheme-dark"
            />
          </div>
          <Button type="submit" className="h-10 rounded-xl px-4">
            <Search />
            {t("payslips.search")}
          </Button>
        </form>
      </Card>

      {loading ? (
        <Skeleton className="h-80 rounded-xl" />
      ) : payslip ? (
        <PayslipCard payslip={payslip} />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-muted">
              <ReceiptText className="size-6 text-muted-foreground" />
            </span>
            <p className="font-medium">
              {t(errorMessage && t.has(errorMessage) ? errorMessage : "payslips.loadFailed")}
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
};
