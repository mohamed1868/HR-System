import type { RequestStatus, RequestType } from "@/lib/generated/prisma/enums";

export type JwtPayload = {
  id: number;
  email: string;
  isAdmin: boolean;
};

export type TUserData = {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  age: number;
  job: string;
  salary: number;
  hireDate: Date | string | null;
};

export type TRequestData = {
  id: number;
  type: RequestType;
  note: string;
  date: Date | string;
  fromTime: Date | string | null;
  toTime: Date | string | null;
  status: RequestStatus;
};
