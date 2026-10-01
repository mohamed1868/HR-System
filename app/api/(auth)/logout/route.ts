import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const jwtCookie = request.cookies.get("jwt-cookie")?.value;
    if (!jwtCookie) {
      return NextResponse.json(
        { message: "please login first" },
        { status: 401 },
      );
    }

    const logoutRes = NextResponse.json(
      { message: "successful logout" },
      { status: 200 },
    );
    logoutRes.cookies.delete("jwt-cookie");
    return logoutRes;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
