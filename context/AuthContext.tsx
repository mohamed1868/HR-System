"use client";

import { createContext, useState } from "react";
import type { TUserData } from "@/lib/types";

type TAuthContext = {
  userData: TUserData | null;
  setUserData: (user: TUserData | null) => void;
};

type TAuthProvider = {
  initialUser: TUserData | null;
  children: React.ReactNode;
};

export const AuthContext = createContext<TAuthContext>({
  userData: null,
  setUserData: () => {},
});

export const AuthProvider = ({ initialUser, children }: TAuthProvider) => {
  const [userData, setUserData] = useState(initialUser);
  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
