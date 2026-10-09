"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useFormatter, useTimeZone, useTranslations } from "next-intl";
import { toast } from "sonner";

import { AttendanceCard } from "@/components/user/attendance/attendance-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { axiosInstance } from "@/lib/axios";
import type { TAttendanceData } from "@/lib/types";

export const AttendanceList = () => {
  const t = useTranslations();
  const format = useFormatter();
  const timeZone = useTimeZone();
  const [month, setMonth] = useState(() => new Date().toLocaleDateString("en-CA", { timeZone }).slice(0, 7));
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [attendance, setAttendance] = useState<TAttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const getAttendance = async () => {
      const [year, monthNumber] = month.split("-");
      try {
        const res = await axiosInstance.get("user/attendance", { params: { month: monthNumber, year } });
        setAttendance(res.data);
        setError(false);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getAttendance();
  }, [month, refresh]);

  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedMonth) {
      toast.error(t("attendance.errors.monthInvalid"));
      return;
    }
    setLoading(true);
    setMonth(selectedMonth);
  };

  const formatTime = (value: Date | string | null) =>
    value ? format.dateTime(new Date(value), { timeStyle: "short" }) : "—";

  const formatWorkedTime = (record: TAttendanceData) => {
    if (!record.checkIn || !record.checkOut) return "—";
    const minutes = Math.round((new Date(record.checkOut).getTime() - new Date(record.checkIn).getTime()) / 60000);
    return t("attendance.duration", { hours: Math.floor(minutes / 60), minutes: minutes % 60 });
  };

  return (
    <>
      <AttendanceCard onChange={() => setRefresh((value) => value + 1)} />

      <Card className="gap-0 py-0">
        <form onSubmit={onSearch} className="flex items-center justify-between gap-3 border-b p-4">
          <div className="flex items-center gap-3">
            <Label htmlFor="month">{t("attendance.month")}</Label>
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
            {t("attendance.search")}
          </Button>
        </form>

        {loading || attendance.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            {loading ? t("auth.loading") : error ? t("attendance.loadFailed") : t("attendance.empty")}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="ps-4">{t("attendance.columns.employee")}</TableHead>
                <TableHead>{t("attendance.columns.day")}</TableHead>
                <TableHead>{t("attendance.columns.checkIn")}</TableHead>
                <TableHead>{t("attendance.columns.checkOut")}</TableHead>
                <TableHead className="pe-4">{t("attendance.columns.hours")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="ps-4 font-medium">{record.user.name}</TableCell>
                  <TableCell>
                    {format.dateTime(new Date(record.date), {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                      timeZone: "UTC",
                    })}
                  </TableCell>
                  <TableCell>{formatTime(record.checkIn)}</TableCell>
                  <TableCell>{formatTime(record.checkOut)}</TableCell>
                  <TableCell className="pe-4">{formatWorkedTime(record)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </>
  );
};
