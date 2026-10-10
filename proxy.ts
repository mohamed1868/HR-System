import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const user = verifyToken(request.cookies.get("jwt-cookie")?.value);
    const isApi = pathname.startsWith("/api/");
    const homeUrl = new URL(user?.isAdmin ? "/admin/employees" : "/user/attendance", request.url);

    if (pathname === "/api/login") {
        return NextResponse.next();
    }

    if (pathname === "/login") {
        if (user) return NextResponse.redirect(homeUrl);
        return NextResponse.next();
    }

    if (!user) {
        if (isApi){
           return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); 
        } 
         const res = NextResponse.redirect(new URL("/login", request.url));
         res.cookies.delete("jwt-cookie")
         return res
    }

    if (pathname === "/") {
        return NextResponse.redirect(homeUrl);
    }

    const isAdminPage = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
    const isUserPage = pathname.startsWith("/user") || pathname.startsWith("/api/user");

    if ((isAdminPage && !user.isAdmin) || (isUserPage && user.isAdmin)) {
        if (isApi) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
