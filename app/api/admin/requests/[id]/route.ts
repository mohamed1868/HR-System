import { RequestStatus, RequestType } from "@/lib/generated/prisma/enums";
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

        const isAttendanceRequest = requestData.type === RequestType.LEAVE || requestData.type === RequestType.MISSION;

        if (requestData.status === RequestStatus.APPROVED && isAttendanceRequest) {
            await prisma.attendance.deleteMany({
                where: {
                    userId: requestData.userId,
                    date: requestData.date,
                    status: requestData.type,
                }
            })
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

        const isApproved = checkValidtionData.data.status === RequestStatus.APPROVED;
        const isAttendanceRequest = requestData.type === RequestType.LEAVE || requestData.type === RequestType.MISSION;

        if (!isApproved && isAttendanceRequest) {
            await prisma.attendance.deleteMany({
                where: {
                    userId: requestData.userId,
                    date: requestData.date,
                    status: requestData.type,
                }
            })
        }

        if (isApproved && isAttendanceRequest) {
            const attendance = await prisma.attendance.findUnique({
                where: {
                    userId_date: {
                        userId: requestData.userId,
                        date: requestData.date,
                    }
                }
            })

            let checkIn = requestData.fromTime;
            let checkOut = requestData.toTime;

            if (attendance?.checkIn && (!checkIn || attendance.checkIn < checkIn)) {
                checkIn = attendance.checkIn;
            }

            if (attendance?.checkOut && (!checkOut || attendance.checkOut > checkOut)) {
                checkOut = attendance.checkOut;
            }

            await prisma.attendance.upsert({
                where: {
                    userId_date: {
                        userId: requestData.userId,
                        date: requestData.date,
                    }
                },
                create: {
                    userId: requestData.userId,
                    date: requestData.date,
                    checkIn,
                    checkOut,
                    status: requestData.type,
                },
                update: {
                    checkIn,
                    checkOut,
                    status: requestData.type,
                }
            })
        }

        return NextResponse.json({ message: "requests.statusUpdated", data: requestUpdate }, { status: 200 });


    } catch (error) {
        console.error("Request error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
