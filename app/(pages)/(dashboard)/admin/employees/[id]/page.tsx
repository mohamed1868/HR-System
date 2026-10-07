import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EmployeeForm } from "@/components/admin/employees/employee-form";

export const metadata: Metadata = { title: "Edit Employee" };

const EditEmployeePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  return <EmployeeForm id={id} />;
};

export default EditEmployeePage;
