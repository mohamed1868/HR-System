import { z } from "zod";
import { RequestStatus, RequestType } from "@/lib/generated/prisma/enums";

export const requestSchema = z.object({
  type: z.enum(RequestType, "requests.errors.typeInvalid"),
  note: z.string("requests.errors.noteRequired").min(1, "requests.errors.noteRequired"),
  date: z.coerce.date("requests.errors.dateInvalid"),
  fromTime: z.coerce.date("requests.errors.timeInvalid").optional(),
  toTime: z.coerce.date("requests.errors.timeInvalid").optional(),
});

export const editRequestSchema = requestSchema.partial();

export const requestStatusSchema = z.object({
  status: z.enum(RequestStatus, "requests.errors.statusInvalid"),
});

export type TAddRequestData = z.infer<typeof requestSchema>;
export type TEditRequestData = z.infer<typeof editRequestSchema>;
export type TRequestStatusData = z.infer<typeof requestStatusSchema>;
