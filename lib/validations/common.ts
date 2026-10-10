import { z } from "zod";

export const monthYearSchema = z.object({
  month: z.coerce.number("common.errors.monthInvalid").int("common.errors.monthInvalid").min(1, "common.errors.monthInvalid").max(12, "common.errors.monthInvalid"),
  year: z.coerce.number("common.errors.yearInvalid").int("common.errors.yearInvalid").min(2000, "common.errors.yearInvalid"),
});

export type TMonthYearData = z.infer<typeof monthYearSchema>;
