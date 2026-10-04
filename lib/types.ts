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
  hireDate: Date  | null;
};

export type TEmployee = {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  age: number;
  job: string;
  hireDate: string | null;
};
