"use client";

import { useEffect, useState } from "react";
import { Check, StickyNote, Trash2, X } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";

import { RequestStatusBadge } from "@/components/shared/request-status-badge";
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { RequestStatus } from "@/lib/generated/prisma/enums";
import type { TAdminRequestData } from "@/lib/types";

export const AdminRequestsList = () => {
  const t = useTranslations();
  const format = useFormatter();
  const [requests, setRequests] = useState<TAdminRequestData[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<TAdminRequestData | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getRequests = async () => {
      try {
        const res = (await axiosInstance.get("admin/requests", { params: { page, limit } })) as {
          data: TAdminRequestData[];
          total: number;
        };
        setRequests(res.data);
        setTotal(res.total);
      } catch {
        toast.error(t("requests.admin.loadFailed"));
      }
    };
    getRequests();
  }, [page, limit, refresh, t]);

  const onStatusChange = async (id: number, status: RequestStatus) => {
    try {
      await axiosInstance.patch(`admin/requests/${id}`, { status });
      toast.success(t("requests.statusUpdated"));
      setRefresh(refresh + 1);
    } catch {
      toast.error(t("requests.admin.actionFailed"));
    }
  };

  const onDelete = async () => {
    if (!toDelete) return;
    try {
      await axiosInstance.delete(`admin/requests/${toDelete.id}`);
      toast.success(t("requests.deleted"));
      setToDelete(null);
      setRefresh(refresh + 1);
      setPage(1);
    } catch {
      toast.error(t("requests.deleteFailed"));
    }
  };

  const formatTime = (value: Date | string | null) =>
    value ? format.dateTime(new Date(value), { timeStyle: "short" }) : "—";

  return (
    <Card className="gap-0 py-0">
      {requests.length === 0 ? (
        <p className="p-10 text-center text-sm text-muted-foreground">{t("requests.admin.empty")}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-4">{t("requests.columns.employee")}</TableHead>
              <TableHead>{t("requests.columns.type")}</TableHead>
              <TableHead>{t("requests.columns.date")}</TableHead>
              <TableHead>{t("requests.columns.time")}</TableHead>
              <TableHead>{t("requests.columns.status")}</TableHead>
              <TableHead>{t("requests.columns.note")}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="ps-4">
                  <p className="font-medium">{request.user.name}</p>
                  <p className="text-xs text-muted-foreground">{request.user.email}</p>
                </TableCell>
                <TableCell>{t(`requests.type.${request.type}`)}</TableCell>
                <TableCell>
                  {format.dateTime(new Date(request.date), { dateStyle: "medium", timeZone: "UTC" })}
                </TableCell>
                <TableCell>
                  {request.fromTime || request.toTime
                    ? `${formatTime(request.fromTime)} - ${formatTime(request.toTime)}`
                    : "—"}
                </TableCell>
                <TableCell>
                  <RequestStatusBadge status={request.status} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-sm" onClick={() => setNote(request.note)}>
                    <StickyNote />
                  </Button>
                </TableCell>
                <TableCell className="pe-4 text-end">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-emerald-600"
                    disabled={request.status === RequestStatus.APPROVED}
                    onClick={() => onStatusChange(request.id, RequestStatus.APPROVED)}
                  >
                    <Check />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    disabled={request.status === RequestStatus.REJECTED}
                    onClick={() => onStatusChange(request.id, RequestStatus.REJECTED)}
                  >
                    <X />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setToDelete(request)}>
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <TablePagination page={page} limit={limit} total={total} onPageChange={setPage} onLimitChange={setLimit} />

      <Dialog open={note !== null} onOpenChange={() => setNote(null)}>
        <DialogContent>
          <p className="pe-8 text-sm whitespace-pre-wrap">{note}</p>
        </DialogContent>
      </Dialog>

      <AlertDialog open={toDelete !== null} onOpenChange={() => setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("requests.delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("requests.delete.description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("requests.form.cancel")}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onDelete}>
              {t("requests.actions.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
