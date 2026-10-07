"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { axiosInstance } from "@/lib/axios";
import { RequestStatus } from "@/lib/generated/prisma/enums";
import type { TRequestData } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles = {
  PENDING: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  APPROVED: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  REJECTED: "bg-destructive/10 text-destructive",
};

export const RequestsList = () => {
  const t = useTranslations();
  const format = useFormatter();
  const [requests, setRequests] = useState<TRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toDelete, setToDelete] = useState<TRequestData | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const getRequests = async () => {
      try {
        const res = await axiosInstance.get("user/requests");
        setRequests(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getRequests();
  }, []);

  const onDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`user/requests/${toDelete.id}`);
      setRequests((list) => list.filter((request) => request.id !== toDelete.id));
      toast.success(t("requests.deleted"));
      setToDelete(null);
    } catch {
      toast.error(t("requests.deleteFailed"));
    } finally {
      setDeleting(false);
    }
  };

  const formatTime = (value: Date | string | null) =>
    value ? format.dateTime(new Date(value), { timeStyle: "short" }) : null;

  return (
    <Card className="gap-0 py-0">
      {loading || requests.length === 0 ? (
        <p className="p-10 text-center text-sm text-muted-foreground">
          {loading ? t("auth.loading") : error ? t("requests.loadFailed") : t("requests.empty")}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-4">{t("requests.columns.type")}</TableHead>
              <TableHead>{t("requests.columns.date")}</TableHead>
              <TableHead>{t("requests.columns.time")}</TableHead>
              <TableHead>{t("requests.columns.note")}</TableHead>
              <TableHead>{t("requests.columns.status")}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => {
              const isPending = request.status === RequestStatus.PENDING;
              const fromTime = formatTime(request.fromTime);
              const toTime = formatTime(request.toTime);
              return (
                <TableRow key={request.id}>
                  <TableCell className="ps-4 font-medium">{t(`requests.type.${request.type}`)}</TableCell>
                  <TableCell>
                    {format.dateTime(new Date(request.date), { dateStyle: "medium", timeZone: "UTC" })}
                  </TableCell>
                  <TableCell>{fromTime || toTime ? `${fromTime ?? "—"} - ${toTime ?? "—"}` : "—"}</TableCell>
                  <TableCell className="max-w-xs truncate">{request.note}</TableCell>
                  <TableCell>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusStyles[request.status])}>
                      {t(`requests.status.${request.status}`)}
                    </span>
                  </TableCell>
                  <TableCell className="pe-4 text-end">
                    <Link
                      href={`/user/requests/${request.id}`}
                      aria-label={t("requests.actions.edit")}
                      aria-disabled={!isPending}
                      tabIndex={isPending ? undefined : -1}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon-sm" }),
                        !isPending && "pointer-events-none opacity-50",
                      )}
                    >
                      <Pencil />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t("requests.actions.delete")}
                      className="text-destructive"
                      disabled={!isPending}
                      onClick={() => setToDelete(request)}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && !deleting && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("requests.delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("requests.delete.description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{t("requests.form.cancel")}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onDelete} disabled={deleting}>
              {t("requests.actions.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
