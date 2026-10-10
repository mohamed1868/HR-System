import { RequestStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { payrollSchema, payrollSearchSchema } from "@/lib/validations/payroll";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        if (!user.isAdmin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const searchParams = request.nextUrl.searchParams;
        const checkValidtionData = payrollSearchSchema.safeParse({
            userId: searchParams.get("userId"),
            month: searchParams.get("month"),
            year: searchParams.get("year"),
        });

        if (!checkValidtionData.success) {
            return NextResponse.json({ message: checkValidtionData.error.issues.map((issue) => issue.message) }, { status: 400 });
        }

        const { userId, month, year } = checkValidtionData.data;
        const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
        const endOfMonth = new Date(Date.UTC(year, month, 1));

        const employee = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                salary: true,
                attendances: {
                    where: {
                        date: {
                            gte: startOfMonth,
                            lt: endOfMonth,
                        }
                    },
                    orderBy: {
                        date: "asc"
                    }
                },
                request: {
                    where: {
                        status: RequestStatus.APPROVED,
                        date: {
                            gte: startOfMonth,
                            lt: endOfMonth,
                        }
                    }
                },
                payrolls: {
                    where: {
                        year,
                        month
                    }
                }
            }
        });

        if (!employee) {
            return NextResponse.json({ message: "payroll.employeeNotFound" }, { status: 404 });
        }

        return NextResponse.json({ data: { employee, month, year } }, { status: 200 });

    } catch (error) {
        console.error("Payroll error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export const PUT = async (request: NextRequest) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        if (!user.isAdmin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const body = await request.json().catch(() => null);
        const checkValidtionData = payrollSchema.safeParse(body);

        if (!checkValidtionData.success) {
            return NextResponse.json({ message: checkValidtionData.error.issues.map((issue) => issue.message) }, { status: 400 });
        }

        const { userId, month, year, basicSalary, bonuses, deductions, isPaid, isPublished } = checkValidtionData.data;
        const netSalary = basicSalary + bonuses - deductions;

        const payroll = await prisma.payroll.upsert({
            where: {
                userId_year_month: {
                    userId,
                    year,
                    month,
                }
            },
            create: {
                userId,
                month,
                year,
                basicSalary,
                bonuses,
                deductions,
                netSalary,
                isPaid,
                isPublished,
            },
            update: {
                basicSalary,
                bonuses,
                deductions,
                netSalary,
                isPaid,
                isPublished,
            }
        });

        return NextResponse.json({ message: "payroll.saved", data: payroll }, { status: 200 });

    } catch (error) {
        console.error("Payroll error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
