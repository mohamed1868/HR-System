import { getCompanyToday } from "@/lib/company-time";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { attendanceMonthSchema } from "@/lib/validations/attendance";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const checkValidtionData = attendanceMonthSchema.safeParse({
            month: searchParams.get("month"),
            year: searchParams.get("year"),
        });

        if (!checkValidtionData.success) {
            return NextResponse.json({ message: checkValidtionData.error.issues.map((issue) => issue.message) }, { status: 400 });
        }

        const { month, year } = checkValidtionData.data;

        const startOfMonth = new Date(Date.UTC(year, month - 1, 1));

        const endOfMonth = new Date(Date.UTC(year, month, 1));

        const attendanceList = await prisma.attendance.findMany({
            where: {
                userId: user.id,
                date: {
                    gte: startOfMonth,
                    lt: endOfMonth,
                }
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                date: "asc"
            }
        });

        return NextResponse.json({ data: attendanceList }, { status: 200 });

    } catch (error) {
        console.error("Attendance error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}


export const POST = async () => {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        await prisma.attendance.create({
            data: {
                userId: user.id,
                date: getCompanyToday(),
                checkIn: new Date(),
            }
        })

        return NextResponse.json({ message: "attendance.checkedIn" }, { status: 201 });

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return NextResponse.json({ message: "attendance.alreadyCheckedIn" }, { status: 409 });
        }
        console.error("Attendance error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export const PATCH = async () => {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        const attendance = await prisma.attendance.findUnique({
            where: {
                userId_date: {
                    userId: user.id,
                    date: getCompanyToday(),
                }
            }
        })

        if (!attendance) {
            return NextResponse.json({ message: "attendance.checkInFirst" }, { status: 400 });
        }

        if (attendance.checkOut) {
            return NextResponse.json({ message: "attendance.alreadyCheckedOut" }, { status: 409 });
        }

        await prisma.attendance.update({
            where: {
                id: attendance.id,
            },
            data: {
                checkOut: new Date(),
            }
        })

        return NextResponse.json({ message: "attendance.checkedOut" }, { status: 200 });

    } catch (error) {
        console.error("Attendance error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
