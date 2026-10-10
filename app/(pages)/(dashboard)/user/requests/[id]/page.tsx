import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RequestForm } from "@/components/user/requests/request-form";

export const metadata: Metadata = { title: "Edit Request" };

const EditRequestPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  return <RequestForm id={id} />;
};

export default EditRequestPage;
