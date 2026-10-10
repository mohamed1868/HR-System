import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PayrollView } from "@/components/admin/payroll/payroll-view";

export const metadata: Metadata = { title: "Payroll" };

const PayrollPage = async () => {
  const t = await getTranslations();

  return (
    <>
      <h1 className="text-2xl font-semibold">{t("nav.payroll")}</h1>
      <PayrollView />
    </>
  );
};

export default PayrollPage;
