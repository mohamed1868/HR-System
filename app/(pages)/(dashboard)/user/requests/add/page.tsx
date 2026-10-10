import type { Metadata } from "next";

import { RequestForm } from "@/components/user/requests/request-form";

export const metadata: Metadata = { title: "New Request" };

const NewRequestPage = () => {
  return <RequestForm />;
};

export default NewRequestPage;
