import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { editUserSchema, TEditUserData } from "@/lib/validations/auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { JwtPayload } from "@/lib/types";


export const PUT = async (request: NextRequest) => {
      try {
            const user = await getCurrentUser();
            if (!user) {
                  return NextResponse.json({ message: "user not found" }, { status: 401 });
            }

            const body: TEditUserData = await request.json()

            const validtionBody = editUserSchema.safeParse(body)

            if (!validtionBody.success) {
                  return NextResponse.json({ message: validtionBody.error.issues.map((issue) => issue.message) }, { status: 400 });
            }


            if (validtionBody.data.email) {
                  const checkMail = await prisma.user.findUnique({
                        where: { email: validtionBody.data.email }
                  });
                  if (checkMail && checkMail.id !== user.id) {
                        return NextResponse.json({ message: "Email already exists" }, { status: 400 });
                  }
            }

            const { isAdmin, job, salary, hireDate } = validtionBody.data;
            if (!user.isAdmin && [isAdmin, job, salary, hireDate].some((value) => value !== undefined)) {
                  return NextResponse.json({ message: "Access denied: Only admins can change role, job, salary or hire date" }, { status: 403 });
            }

            const updateData = await prisma.user.update({
                  where: {
                        id: user.id
                  },
                  data: {
                        ...validtionBody.data,
                        ...(validtionBody.data.password && {
                              password: await bcrypt.hash(validtionBody.data.password, 10)
                        })

                  }, select: {
                        email: true,
                        name: true,
                        isAdmin: true,
                        age: true,
                        job: true,
                        salary: true,
                        hireDate: true,
                        id: true,
                  }
            })

            const jwtNew = jwt.sign({ id: updateData.id, email: updateData.email, isAdmin: updateData.isAdmin } as JwtPayload, process.env.SECRET_KEY!,
                  { expiresIn: "7d" },)

            const res = NextResponse.json({ message: "updated successfully", data: updateData }, { status: 200 })

            res.cookies.set({
                  name: "jwt-cookie",
                  value: jwtNew,
                  maxAge: 60 * 60 * 24 * 7,
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "lax",
                  path: "/",
            })

            return res


      } catch (error) {
            console.error("Profile error:", error);
            return NextResponse.json({ message: "Server error" }, { status: 500 });
      }


}