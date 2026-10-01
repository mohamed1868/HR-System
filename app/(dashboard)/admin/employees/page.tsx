import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Employees" };

const EmployeesPage = async () => {
  const t = await getTranslations();

  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold">{t("nav.employees")}</h1>
      <Link href="/admin/employees/new" className={buttonVariants()}>
        <UserPlus />
        {t("employees.add")}
      </Link>
    </div>
  );
};

export default EmployeesPage;
