"use client";

import { CircleCheck, Clock, TrendingDown, TrendingUp, Wallet, type LucideIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { TPayslipData } from "@/lib/types";
import { cn, getInitials } from "@/lib/utils";

const PayslipRow = ({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}) => (
  <div className="flex items-center justify-between gap-4 rounded-xl p-3 transition-colors hover:bg-muted/50">
    <div className="flex items-center gap-3 text-sm">
      <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </span>
      {label}
    </div>
    <span className={cn("font-medium tabular-nums", className)}>{value}</span>
  </div>
);

export const PayslipCard = ({ payslip }: { payslip: TPayslipData }) => {
  const t = useTranslations();
  const format = useFormatter();

  const period = format.dateTime(new Date(Date.UTC(payslip.year, payslip.month - 1, 1)), {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <Card>
      <CardContent className="grid gap-6 md:grid-cols-5">
        <div className="flex flex-col justify-between gap-8 rounded-2xl bg-brand/10 p-6 md:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">{t("payslips.period")}</p>
              <p className="text-lg font-semibold">{period}</p>
            </div>
            <span
              className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                payslip.isPaid
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400",
              )}
            >
              {payslip.isPaid ? <CircleCheck className="size-3.5" /> : <Clock className="size-3.5" />}
              {t(payslip.isPaid ? "payslips.paid" : "payslips.unpaid")}
            </span>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{t("payslips.netSalary")}</p>
            <p className="text-4xl font-bold tracking-tight text-brand tabular-nums">
              {format.number(payslip.netSalary)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-brand/15 text-sm font-semibold text-brand">
                {getInitials(payslip.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">{payslip.user.name}</p>
              <p className="truncate text-sm capitalize text-muted-foreground">{payslip.user.job}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <h2 className="mb-3 px-3 font-semibold">{t("payslips.breakdown")}</h2>
          <PayslipRow
            icon={Wallet}
            label={t("payslips.basicSalary")}
            value={format.number(payslip.basicSalary)}
          />
          <PayslipRow
            icon={TrendingUp}
            label={t("payslips.bonuses")}
            value={format.number(payslip.bonuses, { signDisplay: "exceptZero" })}
            className="text-emerald-600 dark:text-emerald-400"
          />
          <PayslipRow
            icon={TrendingDown}
            label={t("payslips.deductions")}
            value={format.number(-payslip.deductions, { signDisplay: "exceptZero" })}
            className="text-destructive"
          />
          <Separator className="my-2" />
          <div className="flex items-center justify-between gap-4 p-3">
            <span className="font-semibold">{t("payslips.netSalary")}</span>
            <span className="text-lg font-bold tabular-nums">{format.number(payslip.netSalary)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
