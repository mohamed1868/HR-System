import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PayslipView } from "@/components/user/payslips/payslip-view";

export const metadata: Metadata = { title: "Payslips" };

const PayslipsPage = async () => {
  const t = await getTranslations();

  return (
    <>
      <h1 className="text-2xl font-semibold">{t("nav.payslips")}</h1>
      <PayslipView />
    </>
  );
};

export default PayslipsPage;
