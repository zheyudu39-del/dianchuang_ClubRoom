import { NextRequest, NextResponse } from "next/server";
import { recordVisit, getVisitStats } from "@/lib/db";

export const dynamic = "force-dynamic";

const visitSchema = {
  path: (v: unknown) => typeof v === "string" && v.startsWith("/") && v.length <= 200,
  visitorId: (v: unknown) => typeof v === "string" && v.length <= 64,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!visitSchema.path(body.path) || !visitSchema.visitorId(body.visitorId)) {
      return NextResponse.json({ error: "参数不合法" }, { status: 400 });
    }
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    recordVisit(dateStr, body.path as string, body.visitorId as string);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const days = Number(req.nextUrl.searchParams.get("days") ?? 14);
    return NextResponse.json(getVisitStats(Math.min(Math.max(days, 7), 90)));
  } catch {
    return NextResponse.json({ error: "获取访问统计失败" }, { status: 500 });
  }
}
