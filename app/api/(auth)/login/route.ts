import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { JwtPayload } from "@/lib/types";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    const checkUser = await prisma.user.findUnique({ where: { email } });

    if (!checkUser) {
      return NextResponse.json({ message: "user not found" }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, checkUser.password);

    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      { id: checkUser.id, email: checkUser.email, isAdmin: checkUser.isAdmin } as JwtPayload,
      process.env.SECRET_KEY!,
      { expiresIn: "7d" },
    );

    const login = NextResponse.json(
      {
        id: checkUser.id,
        email: checkUser.email,
        name: checkUser.name,
        isAdmin: checkUser.isAdmin,
        age:checkUser.age,
        job: checkUser.job,
        salary: checkUser.salary,
        hireDate:checkUser.hireDate
      },
      { status: 200 },
    );

    login.cookies.set({
      name: "jwt-cookie",
      value: token,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return login;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
