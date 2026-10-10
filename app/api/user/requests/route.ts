import { getPagination } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { requestSchema } from "@/lib/validations/request";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        const { skip, take } = getPagination(request.nextUrl.searchParams);

        const requests = await prisma.request.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take,
        })

        const total = await prisma.request.count({
            where: {
                userId: user.id
            }
        })

        return NextResponse.json({ data: requests, total }, { status: 200 });


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

        const { fromTime, toTime } = checkValidtionData.data;
        if (fromTime && toTime && toTime <= fromTime) {
            return NextResponse.json({ message: ["requests.errors.timeRange"] }, { status: 400 });
        }

        const newRequest = await prisma.request.create({
            data: {
                type: checkValidtionData.data.type,
                note: checkValidtionData.data.note,
                date: checkValidtionData.data.date,
                fromTime: checkValidtionData.data.fromTime,
                toTime: checkValidtionData.data.toTime,
                userId: user.id,
            }
        })

        return NextResponse.json({ data: newRequest }, { status: 201 });


    } catch (error) {
        console.error("Request error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}