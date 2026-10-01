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
  hireDate: Date | null;
};
