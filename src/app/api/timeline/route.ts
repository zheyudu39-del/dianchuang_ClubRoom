import { NextResponse } from "next/server";
import { getTimeline } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(getTimeline());
  } catch {
    return NextResponse.json({ error: "获取发展历程失败" }, { status: 500 });
  }
}
