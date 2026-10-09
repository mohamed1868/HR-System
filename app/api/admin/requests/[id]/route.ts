import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { requestStatusSchema } from "@/lib/validations/request";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const requestId = parseInt((await params).id);

        if (Number.isNaN(requestId)) {
            return NextResponse.json({ message: "requests.notFound" }, { status: 404 });
        }
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        if (!user.isAdmin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const requestData = await prisma.request.findUnique({
            where: {
                id: requestId
            }
        })

        if (!requestData) {
            return NextResponse.json({ message: "requests.notFound" }, { status: 404 });

        }

        await prisma.request.delete({
            where: {
                id: requestId
            }
        })

        return NextResponse.json({ message: "requests.deleted" }, { status: 200 });


    } catch (error) {
        console.error("Request error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export const PATCH = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const requestId = parseInt((await params).id);

        if (Number.isNaN(requestId)) {
            return NextResponse.json({ message: "requests.notFound" }, { status: 404 });
        }
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        if (!user.isAdmin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const body = await request.json().catch(() => null)
        const checkValidtionData = requestStatusSchema.safeParse(body)

        if (!checkValidtionData.success) {
            return NextResponse.json({ message: checkValidtionData.error.issues.map((issue) => issue.message) }, { status: 400 });
        }

        const requestData = await prisma.request.findUnique({
            where: {
                id: requestId
            }
        })

        if (!requestData) {
            return NextResponse.json({ message: "requests.notFound" }, { status: 404 });

        }

        const requestUpdate = await prisma.request.update({
            where: {
                id: requestId
            },
            data: {
                status: checkValidtionData.data.status,
            }
        })

        return NextResponse.json({ message: "requests.statusUpdated", data: requestUpdate }, { status: 200 });


    } catch (error) {
        console.error("Request error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
