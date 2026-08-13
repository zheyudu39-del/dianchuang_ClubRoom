import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getMockStats } from "@/lib/mock-api";
import { writeMockData } from "@/lib/mock-store";

export const dynamic = "force-dynamic";

const statItemSchema = z.object({
  label: z.string().min(1, "标签不能为空"),
  value: z.number().int().nonnegative("数值必须为非负整数"),
  suffix: z.string().default("+"),
});

const statsSchema = z.array(statItemSchema).min(1, "至少一项统计").max(8, "最多 8 项统计");

export async function GET() {
  try {
    return NextResponse.json(getMockStats());
  } catch {
    return NextResponse.json({ error: "获取统计数据失败" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = statsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "参数校验失败" },
        { status: 400 }
      );
    }
    writeMockData({ stats: parsed.data as unknown[] });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
