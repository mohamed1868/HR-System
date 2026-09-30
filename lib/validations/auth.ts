import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "auth.emailRequired").pipe(z.email("auth.emailInvalid")),
  password: z.string().min(1, "auth.passwordRequired"),
});

export type LoginInput = z.infer<typeof loginSchema>;
