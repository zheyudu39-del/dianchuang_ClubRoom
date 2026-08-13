import { NextResponse } from "next/server";
import { logoutUser, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await logoutUser();
    const res = NextResponse.json({ success: true });
    res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
    return res;
  } catch {
    return NextResponse.json({ error: "退出失败" }, { status: 500 });
  }
}
