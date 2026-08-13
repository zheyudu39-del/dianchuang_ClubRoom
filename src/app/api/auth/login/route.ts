import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { loginUser, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().email("请输入正确的邮箱"),
  password: z.string().min(1, "请输入密码"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "参数校验失败" },
        { status: 400 }
      );
    }
    const { email, password } = parsed.data;
    const result = loginUser(email.toLowerCase(), password);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    // 后台仅允许管理员账号登录
    if (result.user.role !== "admin") {
      return NextResponse.json(
        { error: "该账号没有后台管理权限" },
        { status: 403 }
      );
    }
    const res = NextResponse.json({ success: true, user: result.user });
    res.cookies.set(SESSION_COOKIE, result.token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
