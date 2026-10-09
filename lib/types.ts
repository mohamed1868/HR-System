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

export type TAttendanceData = {
  id: number;
  date: Date | string;
  checkIn: Date | string | null;
  checkOut: Date | string | null;
  user: { name: string };
};

export type TPayslipData = {
  id: number;
  month: number;
  year: number;
  basicSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  isPaid: boolean;
  user: { name: string; job: string };
};
