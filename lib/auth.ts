import jwt from "jsonwebtoken";
import { JwtPayload } from "@/lib/types";

export const verifyToken = (token?: string) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
  } catch {
    return null;
  }
};
