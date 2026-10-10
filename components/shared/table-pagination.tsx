import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PAGE_SIZES } from "@/lib/pagination";

export const TablePagination = ({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}) => {
  const t = useTranslations();
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  if (total === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{t("common.rowsPerPage")}</span>
        <Select
          value={String(limit)}
          onValueChange={(value) => {
            onLimitChange(Number(value));
            onPageChange(1);
          }}
        >
          <SelectTrigger size="sm" className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZES.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <span className="text-muted-foreground">{t("common.total", { total })}</span>

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{t("common.page", { page, totalPages })}</span>
        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          {t("common.previous")}
        </Button>
        <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
          {t("common.next")}
        </Button>
      </div>
    </div>
  );
};
