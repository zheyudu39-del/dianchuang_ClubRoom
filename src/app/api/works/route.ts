import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getWorks, createWork, updateWork, deleteWork } from "@/lib/db";

export const dynamic = "force-dynamic";

const workSchema = z.object({
  title: z.string().min(2, "标题至少 2 个字符"),
  description: z.string().min(2, "描述至少 2 个字符"),
  techStack: z.array(z.string()).min(1, "至少一个技术栈"),
  category: z.string().min(1, "请选择分类"),
  githubUrl: z.string().default("#"),
  demoUrl: z.string().default("#"),
});

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category");
    const works = getWorks();
    const filtered = category
      ? works.filter((w) => w.category === category)
      : works;
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
    const id = createWork(parsed.data);
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
    updateWork(id, parsed.data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });
    deleteWork(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
