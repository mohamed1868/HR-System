import { User } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getCurrentUser } from "@/lib/session";

export const POST = async (request: NextRequest) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "user not found" }, { status: 401 });
    }

    if (!currentUser.isAdmin) {
      return NextResponse.json({ message: "this not admin " }, { status: 403 });
    }

    const body = (await request.json()) as User;
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues.map((el) => el.message) },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "email already exists" },
        { status: 400 },
      );
    }
    const hassPassword = await bcrypt.hash(parsed.data.password, 10);

    await prisma.user.create({
      data: { ...parsed.data, password: hassPassword },
    });

    return NextResponse.json({ message: "create use done" }, { status: 201 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
