import { TDataLogin } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const POST = async (request: NextRequest) => {
  try {
    const userData = (await request.json()) as TDataLogin;
    const checkUser = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    if (!checkUser) {
      return NextResponse.json(
        { message: "this user not found" },
        { status: 400 },
      );
    }

    const hashPassword = await bcrypt.compare(
      userData.password,
      checkUser.password,
    );

    if (!hashPassword) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 },
      );
    }

    const tokenPayload = {
      id: checkUser.id,
      email: checkUser.email,
      isAdmin: checkUser.isAdmin,
    };

    const jwtData = jwt.sign(tokenPayload, process.env.SECRET_KEY as string, {
      expiresIn: "7d",
    });

    const login = NextResponse.json(tokenPayload, { status: 200 });

    login.cookies.set({
      name: "jwt-cookie",
      value: jwtData,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return login;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
