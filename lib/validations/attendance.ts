import { z } from "zod";

export const attendanceMonthSchema = z.object({
  month: z.coerce.number("attendance.errors.monthInvalid").int("attendance.errors.monthInvalid").min(1, "attendance.errors.monthInvalid").max(12, "attendance.errors.monthInvalid"),
  year: z.coerce.number("attendance.errors.yearInvalid").int("attendance.errors.yearInvalid").min(2000, "attendance.errors.yearInvalid"),
});

export type TAttendanceMonthData = z.infer<typeof attendanceMonthSchema>;
