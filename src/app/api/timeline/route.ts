import { NextResponse } from "next/server";
import { getMockTimeline } from "@/lib/mock-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(getMockTimeline());
  } catch {
    return NextResponse.json({ error: "获取时间线失败" }, { status: 500 });
  }
}
