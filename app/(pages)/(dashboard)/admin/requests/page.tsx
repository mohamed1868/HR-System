import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminRequestsList } from "@/components/admin/requests/requests-list";

export const metadata: Metadata = { title: "Requests" };

const AdminRequestsPage = async () => {
  const t = await getTranslations();

  return (
    <>
      <h1 className="text-2xl font-semibold">{t("nav.requests")}</h1>
      <AdminRequestsList />
    </>
  );
};

export default AdminRequestsPage;
