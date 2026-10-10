import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
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

        const search = request.nextUrl.searchParams.get("search") ?? "";

        const employees = await prisma.user.findMany({
            where: {
                id: { not: user.id },
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ]
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
            }
        })

        return NextResponse.json({ data: employees }, { status: 200 });

    } catch (error) {
        console.error("Employee API error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
