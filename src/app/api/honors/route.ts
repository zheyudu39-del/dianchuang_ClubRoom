import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { honors } from "@/lib/mock-data";
import { getMockHonors } from "@/lib/mock-api";
import { writeMockData } from "@/lib/mock-store";

export const dynamic = "force-dynamic";

const honorSchema = z.object({
  title: z.string().min(2, "标题至少 2 个字符"),
  description: z.string().optional().default(""),
  image: z.string().min(1, "请上传获奖图片"),
  year: z.string().optional().default(""),
});

export async function GET() {
  try {
    return NextResponse.json(getMockHonors());
  } catch {
    return NextResponse.json({ error: "获取荣誉列表失败" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = honorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "参数校验失败" },
        { status: 400 }
      );
    }
    const id = crypto.randomUUID().slice(0, 8);
    const next = [
      ...honors,
      {
        ...parsed.data,
        id,
      },
    ];
    writeMockData({ honors: next as unknown[] });
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });
    const body = await req.json();
    const parsed = honorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "参数校验失败" },
        { status: 400 }
      );
    }
    const next = honors.map((h) => (h.id === id ? { ...h, ...parsed.data, id } : h));
    writeMockData({ honors: next as unknown[] });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });
    const next = honors.filter((h) => h.id !== id);
    writeMockData({ honors: next as unknown[] });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
