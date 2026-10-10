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

export type TAdminRequestData = TRequestData & {
  user: { name: string; email: string };
};

export type TAttendanceData = {
  id: number;
  date: Date | string;
  checkIn: Date | string | null;
  checkOut: Date | string | null;
  status: string;
  user: { name: string };
};

export type TPayrollData = {
  id: number;
  month: number;
  year: number;
  basicSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  isPaid: boolean;
  isPublished: boolean;
};

export type TAdminPayrollData = {
  employee: {
    id: number;
    name: string;
    salary: number;
    attendances: Omit<TAttendanceData, "user">[];
    request: TRequestData[];
    payrolls: TPayrollData[];
  };
  month: number;
  year: number;
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
