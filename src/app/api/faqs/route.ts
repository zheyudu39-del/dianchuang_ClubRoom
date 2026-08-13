import { NextResponse } from "next/server";
import { getMockFaqs } from "@/lib/mock-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(getMockFaqs());
  } catch {
    return NextResponse.json({ error: "获取 FAQ 失败" }, { status: 500 });
  }
}
