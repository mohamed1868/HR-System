import { getPagination } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { userSchema, TAddUserData } from "@/lib/validations/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const GET = async (request: NextRequest) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        if (!user.isAdmin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const { skip, take } = getPagination(request.nextUrl.searchParams);

        const getUsers = await prisma.user.findMany({
            where: {
                id: { not: user.id }
            },
            select: {
                id: true,
                email: true,
                name: true,
                isAdmin: true,
                age: true,
                hireDate: true,
                salary: true,
                job: true
            },
            orderBy: {
                name: "asc"
            },
            skip,
            take,
        })

        const total = await prisma.user.count({
            where: {
                id: { not: user.id }
            }
        });

        return NextResponse.json({ message: "get users done", data: getUsers, total }, { status: 200 });

    } catch (error) {
        console.error("Employee API error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}


export const POST = async (request: NextRequest) => {
    try {
        const body: TAddUserData = await request.json();
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        if (!user.isAdmin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const checkValidtionData = userSchema.safeParse(body);

        if (!checkValidtionData.success) {
            return NextResponse.json({ message: checkValidtionData.error.issues.map((issue) => issue.message) }, { status: 400 });
        }

        const checkMail = await prisma.user.findUnique({
            where: { email: checkValidtionData.data.email }
        });
        if (checkMail) {
            return NextResponse.json({ message: "Email already exists" }, { status: 400 });
        }

        const hashPassword = await bcrypt.hash(checkValidtionData.data.password, 10);

        const getUsers = await prisma.user.create({
            data: {
                ...checkValidtionData.data,
                password: hashPassword
            },
            select: {
                email: true,
                name: true,
                isAdmin: true,
                age: true,
                salary: true,
                job: true,
                hireDate: true
            }
        })


        return NextResponse.json({ message: "User created successfully", data: getUsers }, { status: 201 });

    } catch (error) {
        console.error("Employee API error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
