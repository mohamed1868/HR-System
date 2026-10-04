import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { editUserSchema, TEditUserData } from "@/lib/validations/auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const GET = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const userID = parseInt((await params).id);
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        if (!user.isAdmin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const getUsers = await prisma.user.findUnique({
            where: {
                id: userID
            },
            select: {
                id: true,
                email: true,
                name: true,
                isAdmin: true,
                age: true,
                hireDate: true,
                job: true
            },
        })

        if (!getUsers) {
            return NextResponse.json({ message: "user not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "get user done", data: getUsers }, { status: 200 });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export const PUT = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const userID = parseInt((await params).id);
        const body: TEditUserData = await request.json();
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        if (!user.isAdmin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const checkValidtionData = editUserSchema.safeParse(body);

        if (!checkValidtionData.success) {
            return NextResponse.json({ message: checkValidtionData.error.issues.map((issue) => issue.message) }, { status: 400 });
        }

        if (checkValidtionData.data.email) {
            const checkMail = await prisma.user.findUnique({
                where: { email: checkValidtionData.data.email }
            });
            if (checkMail && checkMail.id !== userID) {
                return NextResponse.json({ message: "Email already exists" }, { status: 400 });
            }
        }

        const getUsers = await prisma.user.findUnique({
            where: {
                id: userID
            },
        })

        if (!getUsers) {
            return NextResponse.json({ message: "user not found" }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userID
            },
            data: {
                ...checkValidtionData.data,
                password: checkValidtionData.data.password && await bcrypt.hash(checkValidtionData.data.password, 10)
            },
            select: {
                email: true,
                name: true,
                isAdmin: true,
                age: true,
                job: true,
                hireDate: true
            }
        });

        return NextResponse.json({ message: "User updated successfully", data: updatedUser }, { status: 200 });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const userID = parseInt((await params).id);
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        if (!user.isAdmin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const existingUser = await prisma.user.findUnique({ where: { id: userID } });
        if (!existingUser) {
            return NextResponse.json({ message: "user not found" }, { status: 404 });
        }

        await prisma.user.delete({ where: { id: userID } });

        return NextResponse.json({ message: "user deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}