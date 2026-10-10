import { useTranslations } from "next-intl";

import type { RequestStatus } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils";

const statusStyles = {
  PENDING: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  APPROVED: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  REJECTED: "bg-destructive/10 text-destructive",
};

export const RequestStatusBadge = ({ status }: { status: RequestStatus }) => {
  const t = useTranslations();

  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusStyles[status])}>
      {t(`requests.status.${status}`)}
    </span>
  );
};
