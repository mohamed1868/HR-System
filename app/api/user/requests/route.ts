import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { requestSchema } from "@/lib/validations/request";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        const requests = await prisma.request.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json({ data: requests }, { status: 200 });


    } catch (error) {
        console.error("Request error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export const POST = async (request: NextRequest) => {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        const body = await request.json().catch(() => null)
        const checkValidtionData = requestSchema.safeParse(body);

        if (!checkValidtionData.success) {
            return NextResponse.json({ message: checkValidtionData.error.issues.map((issue) => issue.message) }, { status: 400 });
        }

        const newRequest = await prisma.request.create({
            data: {
                ...checkValidtionData.data,
                userId: user.id
            }
        })

        return NextResponse.json({ data: newRequest }, { status: 201 });


    } catch (error) {
        console.error("Request error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}