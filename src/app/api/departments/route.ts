import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from "@/lib/db";

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
    return NextResponse.json(getDepartments());
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
    createDepartment(parsed.data);
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
    updateDepartment(id, parsed.data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });
    deleteDepartment(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
