"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Search, Trash2 } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/shared/table-pagination";
import { axiosInstance } from "@/lib/axios";
import { PAGE_SIZE } from "@/lib/pagination";
import type { TUserData } from "@/lib/types";
import { cn, getInitials } from "@/lib/utils";

export const EmployeesList = () => {
  const t = useTranslations();
  const format = useFormatter();
  const [employees, setEmployees] = useState<TUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [toDelete, setToDelete] = useState<TUserData | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        if (search) {
          const res = await axiosInstance.get("admin/employee/search", { params: { search } });
          setEmployees(res.data);
          setTotal(res.data.length);
        } else {
          const res = (await axiosInstance.get("admin/employee", { params: { page, limit } })) as {
            data: TUserData[];
            total: number;
          };
          setEmployees(res.data);
          setTotal(res.total);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getEmployees();
  }, [page, limit, search, refresh]);

  const onDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`admin/employee/${toDelete.id}`);
      toast.success(t("employees.deleted"));
      setToDelete(null);
      setPage(1);
      setRefresh(refresh + 1);
    } catch {
      toast.error(t("employees.deleteFailed"));
    } finally {
      setDeleting(false);
    }
  };

  const rows = search ? employees.slice((page - 1) * limit, page * limit) : employees;

  return (
    <Card className="gap-0 py-0">
      <div className="border-b p-4">
        <div className="relative sm:max-w-xs">
          <Search className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder={t("employees.search")}
            className="h-10 rounded-xl ps-9"
          />
        </div>
      </div>

      {loading || employees.length === 0 ? (
        <p className="p-10 text-center text-sm text-muted-foreground">
          {loading ? t("auth.loading") : error ? t("employees.loadFailed") : t("employees.empty")}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-4">{t("employees.columns.employee")}</TableHead>
              <TableHead>{t("employees.columns.job")}</TableHead>
              <TableHead>{t("employees.columns.age")}</TableHead>
              <TableHead>{t("employees.columns.salary")}</TableHead>
              <TableHead>{t("employees.columns.hireDate")}</TableHead>
              <TableHead>{t("employees.columns.role")}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="ps-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-brand/10 text-xs text-brand">
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{employee.job}</TableCell>
                <TableCell>{employee.age}</TableCell>
                <TableCell>{format.number(employee.salary)}</TableCell>
                <TableCell>
                  {employee.hireDate
                    ? format.dateTime(new Date(employee.hireDate), { dateStyle: "medium", timeZone: "UTC" })
                    : "—"}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      employee.isAdmin ? "bg-brand/15 text-brand" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {t(employee.isAdmin ? "employees.role.admin" : "employees.role.employee")}
                  </span>
                </TableCell>
                <TableCell className="pe-4 text-end">
                  <Link
                    href={`/admin/employees/${employee.id}`}
                    aria-label={t("employees.actions.edit")}
                    className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                  >
                    <Pencil />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("employees.actions.delete")}
                    className="text-destructive"
                    onClick={() => setToDelete(employee)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <TablePagination page={page} limit={limit} total={total} onPageChange={setPage} onLimitChange={setLimit} />

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && !deleting && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("employees.delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("employees.delete.description", { name: toDelete?.name ?? "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{t("employees.form.cancel")}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onDelete} disabled={deleting}>
              {t("employees.actions.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
