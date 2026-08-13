import { NextResponse } from "next/server";
import { getFaqs } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(getFaqs());
  } catch {
    return NextResponse.json({ error: "获取常见问题失败" }, { status: 500 });
  }
}
