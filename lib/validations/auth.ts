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

export type LoginInput = z.infer<typeof loginSchema>;
