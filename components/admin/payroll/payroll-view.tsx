"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useFormatter, useTimeZone, useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import { FieldError } from "@/components/shared/field-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/shared/table-pagination";
import { PAGE_SIZE } from "@/lib/pagination";
import { axiosInstance } from "@/lib/axios";
import type { TAdminPayrollData, TUserData } from "@/lib/types";
import { payrollSchema } from "@/lib/validations/payroll";

export const PayrollView = () => {
  const t = useTranslations();
  const format = useFormatter();
  const timeZone = useTimeZone();
  const [employees, setEmployees] = useState<TUserData[]>([]);
  const [userId, setUserId] = useState("");
  const [month, setMonth] = useState(() => new Date().toLocaleDateString("en-CA", { timeZone }).slice(0, 7));
  const [data, setData] = useState<TAdminPayrollData | null>(null);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const res = await axiosInstance.get("admin/employee/search");
        setEmployees(res.data);
      } catch {
        toast.error(t("payroll.loadFailed"));
      }
    };
    getEmployees();
  }, [t]);

  const getPayroll = async (userId: string | number, year: string | number, month: string | number) => {
    try {
      const res = await axiosInstance.get("admin/payroll", { params: { userId, year, month } });
      setData(res.data);
      setErrors({});
    } catch {
      toast.error(t("payroll.loadFailed"));
    }
  };

  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) {
      toast.error(t("payroll.errors.employeeRequired"));
      return;
    }
    if (!month) {
      toast.error(t("common.errors.monthInvalid"));
      return;
    }
    const [year, monthNumber] = month.split("-");
    setPage(1);
    getPayroll(userId, year, monthNumber);
  };

  const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!data) return;
    const form = new FormData(event.currentTarget);
    const result = payrollSchema.safeParse({
      userId: data.employee.id,
      month: data.month,
      year: data.year,
      basicSalary: form.get("basicSalary"),
      bonuses: form.get("bonuses"),
      deductions: form.get("deductions"),
      isPaid: form.get("isPaid") === "on",
      isPublished: form.get("isPublished") === "on",
    });

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }
    setErrors({});

    try {
      await axiosInstance.put("admin/payroll", result.data);
      toast.success(t("payroll.saved"));
      getPayroll(data.employee.id, data.year, data.month);
    } catch {
      toast.error(t("payroll.saveFailed"));
    }
  };

  const formatTime = (value: Date | string | null) =>
    value ? format.dateTime(new Date(value), { timeStyle: "short" }) : "—";

  const formatHours = (checkIn: Date | string | null, checkOut: Date | string | null) => {
    if (!checkIn || !checkOut) return "—";
    const minutes = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 60000);
    return t("attendance.duration", { hours: Math.floor(minutes / 60), minutes: minutes % 60 });
  };

  const formatDayRequest = (date: Date | string) => {
    const dayRequest = data?.employee.request.find((item) => item.date === date);
    return dayRequest ? t(`requests.type.${dayRequest.type}`) : "—";
  };

  const payroll = data?.employee.payrolls[0];
  const attendances = data?.employee.attendances ?? [];
  const pageAttendances = attendances.slice((page - 1) * limit, page * limit);

  return (
    <>
      <Card className="py-0">
        <form onSubmit={onSearch} className="flex flex-wrap items-center gap-3 p-4">
          <Select
            value={userId}
            onValueChange={(value) => setUserId(value ?? "")}
            items={employees.map((employee) => ({ value: String(employee.id), label: employee.name }))}
          >
            <SelectTrigger className="w-56 rounded-xl data-[size=default]:h-10">
              <SelectValue placeholder={t("payroll.selectEmployee")} />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={String(employee.id)}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className="h-10 w-auto rounded-xl dark:scheme-dark"
          />
          <Button type="submit" className="h-10 rounded-xl px-4">
            <Search />
            {t("payroll.search")}
          </Button>
        </form>
      </Card>

      {data && (
        <>
          <Card className="gap-0 py-0">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="font-semibold">
                {t("payroll.attendance")} - {data.employee.name}
              </h2>
              <span className="text-sm text-muted-foreground">
                {t("payroll.attendanceDays", { count: data.employee.attendances.length })}
              </span>
            </div>
            {data.employee.attendances.length === 0 ? (
              <p className="p-10 text-center text-sm text-muted-foreground">{t("payroll.noAttendance")}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="ps-4">{t("attendance.columns.day")}</TableHead>
                    <TableHead>{t("attendance.columns.status")}</TableHead>
                    <TableHead>{t("attendance.columns.checkIn")}</TableHead>
                    <TableHead>{t("attendance.columns.checkOut")}</TableHead>
                    <TableHead>{t("attendance.columns.hours")}</TableHead>
                    <TableHead className="pe-4">{t("payroll.request")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageAttendances.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="ps-4">
                        {format.dateTime(new Date(record.date), {
                          weekday: "long",
                          day: "numeric",
                          month: "short",
                          timeZone: "UTC",
                        })}
                      </TableCell>
                      <TableCell>{t(`attendance.status.${record.status}`)}</TableCell>
                      <TableCell>{formatTime(record.checkIn)}</TableCell>
                      <TableCell>{formatTime(record.checkOut)}</TableCell>
                      <TableCell>{formatHours(record.checkIn, record.checkOut)}</TableCell>
                      <TableCell className="pe-4">{formatDayRequest(record.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <TablePagination page={page} limit={limit} total={attendances.length} onPageChange={setPage} onLimitChange={setLimit} />
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{t("payroll.salary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                key={`${data.employee.id}-${data.year}-${data.month}`}
                noValidate
                onSubmit={onSave}
                className="grid gap-5 sm:grid-cols-3"
              >
                <div className="space-y-2">
                  <Label htmlFor="basicSalary">{t("payroll.basicSalary")}</Label>
                  <Input
                    id="basicSalary"
                    name="basicSalary"
                    type="number"
                    defaultValue={payroll?.basicSalary ?? data.employee.salary}
                    aria-invalid={!!errors.basicSalary}
                    className="h-11 rounded-xl"
                  />
                  <FieldError message={errors.basicSalary?.[0] && t(errors.basicSalary[0])} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bonuses">{t("payroll.bonuses")}</Label>
                  <Input
                    id="bonuses"
                    name="bonuses"
                    type="number"
                    defaultValue={payroll?.bonuses ?? 0}
                    aria-invalid={!!errors.bonuses}
                    className="h-11 rounded-xl"
                  />
                  <FieldError message={errors.bonuses?.[0] && t(errors.bonuses[0])} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deductions">{t("payroll.deductions")}</Label>
                  <Input
                    id="deductions"
                    name="deductions"
                    type="number"
                    defaultValue={payroll?.deductions ?? 0}
                    aria-invalid={!!errors.deductions}
                    className="h-11 rounded-xl"
                  />
                  <FieldError message={errors.deductions?.[0] && t(errors.deductions[0])} />
                </div>

                <div className="flex flex-wrap gap-6 sm:col-span-3">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      name="isPaid"
                      defaultChecked={payroll?.isPaid}
                      className="size-4 accent-brand"
                    />
                    {t("payroll.isPaid")}
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      name="isPublished"
                      defaultChecked={payroll?.isPublished}
                      className="size-4 accent-brand"
                    />
                    {t("payroll.isPublished")}
                  </label>
                </div>

                <div className="flex items-center justify-between gap-4 sm:col-span-3">
                  <p className="text-sm">
                    {t("payroll.netSalary")}:{" "}
                    <span className="text-lg font-bold">
                      {payroll ? format.number(payroll.netSalary) : "—"}
                    </span>
                  </p>
                  <Button type="submit">{t("payroll.save")}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};
