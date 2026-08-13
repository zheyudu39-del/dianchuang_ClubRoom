import { NextResponse } from "next/server";
import { getOverview } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(getOverview());
  } catch {
    return NextResponse.json({ error: "获取总览数据失败" }, { status: 500 });
  }
}
