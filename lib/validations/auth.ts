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
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  isAdmin: z.boolean().default(false),
  age: z.number().int().positive("Age must be a positive number").default(25),
  job: z.string().min(2, "Job title is required").default("sales"),
  hireDate: z.coerce.date().optional(),
});

export const editUserSchema = userSchema.partial();

export type TAddUserData = z.infer<typeof userSchema>;
export type TEditUserData = z.infer<typeof editUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
