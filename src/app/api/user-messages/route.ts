import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserMessages } from "@/lib/db";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  email: z.string().email("请输入正确的邮箱"),
});

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email") ?? "";
    const parsed = querySchema.safeParse({ email });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "参数校验失败" },
        { status: 400 }
      );
    }
    return NextResponse.json(getUserMessages(email.toLowerCase()));
  } catch {
    return NextResponse.json({ error: "查询失败" }, { status: 500 });
  }
}
