import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    if (pathname === "/login" || pathname === "/api/login") {
        const jwtCookie = request.cookies.get("jwt-cookie")?.value;
        
        if (jwtCookie && pathname === "/login") {
            try {
                const jwtVerify = jwt.verify(jwtCookie, process.env.SECRET_KEY!) as User;
                const checkuser = await prisma.user.findUnique({
                    where: { email: jwtVerify.email },
                });
                if (checkuser) {
                    return NextResponse.redirect(
                        new URL(checkuser.isAdmin ? "/admin/dashboard" : "/user/dashboard", request.url)
                    );
                }
            } catch {
                const res = NextResponse.next();
                res.cookies.delete("jwt-cookie");
                return res;
            }
        }
        return NextResponse.next();
    }

    const jwtCookie = request.cookies.get("jwt-cookie")?.value;

    if (!jwtCookie) {
        if (pathname.startsWith("/api/")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const jwtVerify = jwt.verify(jwtCookie, process.env.SECRET_KEY!) as User;
        const checkuser = await prisma.user.findUnique({
            where: { email: jwtVerify.email }
        });

        if (!checkuser) {
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }

        if ((pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) && !checkuser.isAdmin) {
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }
            return NextResponse.redirect(new URL('/user/dashboard', request.url));
        }

        if ((pathname.startsWith("/user") || pathname.startsWith("/api/user")) && checkuser.isAdmin) {
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ message: "Forbidden for admin" }, { status: 403 });
            }
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }

        return NextResponse.next();

    } catch (error) {
        if (pathname.startsWith("/api/")) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};