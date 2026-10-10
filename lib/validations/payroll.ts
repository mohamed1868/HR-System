import { z } from "zod";
import { monthYearSchema } from "@/lib/validations/common";

export const payrollSearchSchema = monthYearSchema.extend({
  userId: z.coerce.number("payroll.errors.employeeRequired").int("payroll.errors.employeeRequired").positive("payroll.errors.employeeRequired"),
});

export const payrollSchema = payrollSearchSchema.extend({
  basicSalary: z.coerce.number("payroll.errors.amountInvalid").int("payroll.errors.amountInvalid").positive("payroll.errors.amountInvalid"),
  bonuses: z.coerce.number("payroll.errors.amountInvalid").int("payroll.errors.amountInvalid").min(0, "payroll.errors.amountInvalid"),
  deductions: z.coerce.number("payroll.errors.amountInvalid").int("payroll.errors.amountInvalid").min(0, "payroll.errors.amountInvalid"),
  isPaid: z.boolean(),
  isPublished: z.boolean(),
});

export type TPayrollFormData = z.infer<typeof payrollSchema>;
