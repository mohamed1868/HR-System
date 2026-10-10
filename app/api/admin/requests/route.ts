import { getPagination } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 401 });
        }

        if (!user.isAdmin) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        const { skip, take } = getPagination(request.nextUrl.searchParams);

        const requests = await prisma.request.findMany({
            where: {
                userId: {
                    not: user.id
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: [
                { status: "asc" },
                { date: "desc" }
            ],
            skip,
            take,
        })

        const total = await prisma.request.count({
            where: {
                userId: {
                    not: user.id
                }
            }
        })

        return NextResponse.json({ data: requests, total }, { status: 200 });


    } catch (error) {
        console.error("Request error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
