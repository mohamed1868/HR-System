import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "auth.emailRequired")
    .pipe(z.email("auth.emailInvalid")),
  password: z.string().min(1, "auth.passwordRequired"),
});

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "auth.emailRequired")
    .email("auth.emailInvalid"),
  password: z
    .string()
    .min(1, "auth.passwordRequired")
    .min(6, "auth.passwordMin"),
  name: z.string().optional(),
  age: z.number().int().positive().optional(),
});

export const userSchema = z.object({
  email: z.string().email("auth.emailInvalid"),
  password: z.string("employees.errors.passwordMin").min(6, "employees.errors.passwordMin"),
  name: z.string().min(2, "employees.errors.nameMin"),
  isAdmin: z.boolean().optional(),
  age: z.number("employees.errors.ageInvalid").int("employees.errors.ageInvalid").positive("employees.errors.ageInvalid").optional(),
  job: z.string().min(2, "employees.errors.jobRequired").optional(),
  salary:z.number("employees.errors.salaryInvalid").int("employees.errors.salaryInvalid").positive("employees.errors.salaryInvalid").optional(),
  hireDate: z.coerce.date().optional(),
});

export const editUserSchema = userSchema.partial();

export type TAddUserData = z.infer<typeof userSchema>;
export type TEditUserData = z.infer<typeof editUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
