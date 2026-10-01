import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const token = verifyToken(cookieStore.get("jwt-cookie")?.value);
  if (!token) return null;

  return prisma.user.findUnique({
    where: { id: token.id },
    select: {
      id: true,
      email: true,
      name: true,
      isAdmin: true,
      age: true,
      hireDate: true,
    },
  });
};
