import { RequestStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { editRequestSchema } from "@/lib/validations/request";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const requestId = parseInt((await params).id);

        if (Number.isNaN(requestId)) {
            return NextResponse.json({ message: "request not found" }, { status: 404 });
        }
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        const requestData = await prisma.request.findUnique({
            where: {
                id: requestId
            }
        })

        if (!requestData) {
            return NextResponse.json({ message: "request not found" }, { status: 404 });

        }

        if (requestData.userId !== user.id) {
            return NextResponse.json({ message: "You do not have access to this request" }, { status: 403 });
        }

        if (requestData.status !== RequestStatus.PENDING) {
            return NextResponse.json(
                { message: "You cannot modify this request because it is no longer pending. Please contact the admin." },
                { status: 400 }
            );
        }

        return NextResponse.json({ data: requestData }, { status: 200 });


    } catch (error) {
        console.error("Request error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const requestId = parseInt((await params).id);

        if (Number.isNaN(requestId)) {
            return NextResponse.json({ message: "request not found" }, { status: 404 });
        }
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        const requestData = await prisma.request.findUnique({
            where: {
                id: requestId
            }
        })

        if (!requestData) {
            return NextResponse.json({ message: "request not found" }, { status: 404 });

        }

        if (requestData.userId !== user.id) {
            return NextResponse.json({ message: "You do not have access to this request" }, { status: 403 });
        }

        if (requestData.status !== RequestStatus.PENDING) {
            return NextResponse.json(
                { message: "You cannot delete this request because it is no longer pending. Please contact the admin." },
                { status: 400 }
            );
        }

        await prisma.request.delete({
            where: {
                id: requestId
            }
        })

        return NextResponse.json({ message: "successfully deleted" }, { status: 200 });


    } catch (error) {
        console.error("Request error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export const PUT = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const requestId = parseInt((await params).id);

        if (Number.isNaN(requestId)) {
            return NextResponse.json({ message: "request not found" }, { status: 404 });
        }
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        const body = await request.json().catch(() => null)
        const checkValidtionData = editRequestSchema.safeParse(body)

        if (!checkValidtionData.success) {
            return NextResponse.json({ message: checkValidtionData.error.issues.map((issue) => issue.message) }, { status: 400 });
        }


        const requestData = await prisma.request.findUnique({
            where: {
                id: requestId
            }
        })

        if (!requestData) {
            return NextResponse.json({ message: "request not found" }, { status: 404 });

        }

        if (requestData.userId !== user.id) {
            return NextResponse.json({ message: "You do not have access to this request" }, { status: 403 });
        }

        if (requestData.status !== RequestStatus.PENDING) {
            return NextResponse.json(
                { message: "You cannot modify this request because it is no longer pending. Please contact the admin." },
                { status: 400 }
            );
        }

        const requestUpdate = await prisma.request.update({
            where: {
                id: requestId
            },
            data: checkValidtionData.data
        })

        return NextResponse.json({ data: requestUpdate }, { status: 200 });


    } catch (error) {
        console.error("Request error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}