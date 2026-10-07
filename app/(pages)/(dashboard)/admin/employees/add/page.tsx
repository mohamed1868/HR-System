import type { Metadata } from "next";

import { EmployeeForm } from "@/components/admin/employees/employee-form";

export const metadata: Metadata = { title: "Add Employee" };

const NewEmployeePage = () => {
  return <EmployeeForm />;
};

export default NewEmployeePage;
