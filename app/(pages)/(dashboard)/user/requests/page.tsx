import type { Metadata } from "next";
import Link from "next/link";
import { FilePlus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { RequestsList } from "@/components/user/requests/requests-list";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Requests" };

const RequestsPage = async () => {
  const t = await getTranslations();

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{t("nav.requests")}</h1>
        <Link href="/user/requests/add" className={buttonVariants()}>
          <FilePlus />
          {t("requests.add")}
        </Link>
      </div>
      <RequestsList />
    </>
  );
};

export default RequestsPage;
