import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AttendanceList } from "@/components/user/attendance/attendance-list";

export const metadata: Metadata = { title: "Attendance" };

const AttendancePage = async () => {
  const t = await getTranslations();

  return (
    <>
      <h1 className="text-2xl font-semibold">{t("nav.attendance")}</h1>
      <AttendanceList />
    </>
  );
};

export default AttendancePage;
