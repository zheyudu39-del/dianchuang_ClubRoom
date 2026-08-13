import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { departments } from "@/lib/mock-data";
import { getMockDepartments } from "@/lib/mock-api";
import { writeMockData } from "@/lib/mock-store";

export const dynamic = "force-dynamic";

const deptSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "部门 id 只能是小写字母/数字/连字符"),
  name: z.string().min(2, "部门名称至少 2 个字符"),
  icon: z.string().default("Code2"),
  description: z.string().min(2, "描述至少 2 个字符"),
  skills: z.array(z.string()).min(1, "至少一个技能"),
});

export async function GET() {
  try {
    return NextResponse.json(getMockDepartments());
  } catch {
    return NextResponse.json({ error: "获取部门列表失败" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = deptSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "参数校验失败" },
        { status: 400 }
      );
    }
    const next = [
      ...departments,
      { id: parsed.data.id, name: parsed.data.name, icon: parsed.data.icon, color: "", desc: parsed.data.description, skills: parsed.data.skills },
    ];
    writeMockData({ departments: next as unknown[] });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "创建失败（可能 id 已存在）" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });
    const body = await req.json();
    const parsed = deptSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "参数校验失败" },
        { status: 400 }
      );
    }
    const next = departments.map((d) =>
      d.id === id
        ? { ...d, name: parsed.data.name, icon: parsed.data.icon, desc: parsed.data.description, skills: parsed.data.skills }
        : d
    );
    writeMockData({ departments: next as unknown[] });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });
    const next = departments.filter((d) => d.id !== id);
    writeMockData({ departments: next as unknown[] });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
