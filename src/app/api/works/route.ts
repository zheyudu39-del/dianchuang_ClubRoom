import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { works } from "@/lib/mock-data";
import { getMockWorks } from "@/lib/mock-api";
import { writeMockData } from "@/lib/mock-store";

export const dynamic = "force-dynamic";

const workSchema = z.object({
  title: z.string().min(2, "标题至少 2 个字符"),
  description: z.string().min(2, "描述至少 2 个字符"),
  techStack: z.array(z.string()).min(1, "至少一个技术栈"),
  category: z.string().min(1, "请选择分类"),
  githubUrl: z.string().default(""),
  demoUrl: z.string().default(""),
  order: z.number().int().default(0),
});

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category");
    const list = getMockWorks();
    const filtered = category ? list.filter((w) => w.category === category) : list;
    return NextResponse.json(filtered);
  } catch {
    return NextResponse.json({ error: "获取作品列表失败" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = workSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "参数校验失败" },
        { status: 400 }
      );
    }
    const id = crypto.randomUUID().slice(0, 8);
    const next = [
      ...works,
      {
        ...parsed.data,
        id,
        cover: null,
        teamMembers: [],
        isPublished: true,
      },
    ];
    writeMockData({ works: next as unknown[] });
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
    const parsed = workSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "参数校验失败" },
        { status: 400 }
      );
    }
    const next = works.map((w) => (w.id === id ? { ...w, ...parsed.data, id } : w));
    writeMockData({ works: next as unknown[] });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });
    const next = works.filter((w) => w.id !== id);
    writeMockData({ works: next as unknown[] });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
