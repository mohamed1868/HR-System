import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { monthYearSchema } from "@/lib/validations/common";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const checkValidtionData = monthYearSchema.safeParse({
            month: searchParams.get("month"),
            year: searchParams.get("year"),
        });

        if (!checkValidtionData.success) {
            return NextResponse.json({ message: checkValidtionData.error.issues.map((issue) => issue.message) }, { status: 400 });
        }

        const { month, year } = checkValidtionData.data;

        const payslip = await prisma.payroll.findUnique({
            where: {
                userId_year_month: {
                    userId: user.id,
                    year,
                    month,
                },
                isPublished: true,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        job: true
                    }
                }
            },
        });

        if (!payslip) {
            return NextResponse.json({ message: "payslips.notAvailable" }, { status: 404 });
        }

        return NextResponse.json({ data: payslip }, { status: 200 });

    } catch (error) {
        console.error("Payroll error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
