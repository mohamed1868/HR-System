import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const user = verifyToken(request.cookies.get("jwt-cookie")?.value);
    const isApi = pathname.startsWith("/api/");
    const dashboardUrl = new URL(user?.isAdmin ? "/admin/dashboard" : "/user/dashboard", request.url);

    if (pathname === "/api/login") {
        return NextResponse.next();
    }

    if (pathname === "/login") {
        if (user) return NextResponse.redirect(dashboardUrl);
        return NextResponse.next();
    }

    if (!user) {
        if (isApi) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname === "/") {
        return NextResponse.redirect(dashboardUrl);
    }

    const isAdminPage = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
    const isUserPage = pathname.startsWith("/user") || pathname.startsWith("/api/user");

    if ((isAdminPage && !user.isAdmin) || (isUserPage && user.isAdmin)) {
        if (isApi) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
