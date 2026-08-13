import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { members } from "@/lib/mock-data";
import { getMockMembers } from "@/lib/mock-api";
import { writeMockData } from "@/lib/mock-store";

export const dynamic = "force-dynamic";

const memberSchema = z.object({
  name: z.string().min(2, "姓名至少 2 个字符"),
  role: z.enum(["LEADER", "MEMBER"]).default("MEMBER"),
  department: z.string().min(1, "请选择部门"),
  position: z.string().min(1, "请填写职位"),
  bio: z.string().min(2, "简介至少 2 个字符"),
  skills: z.array(z.string()).min(1, "至少一个技能"),
  github: z.string().default(""),
});

export async function GET(req: NextRequest) {
  try {
    const department = req.nextUrl.searchParams.get("department");
    const list = getMockMembers();
    const filtered = department ? list.filter((m) => m.department === department) : list;
    return NextResponse.json(filtered);
  } catch {
    return NextResponse.json({ error: "获取成员列表失败" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = memberSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "参数校验失败" },
        { status: 400 }
      );
    }
    const id = crypto.randomUUID().slice(0, 8);
    const next = [
      ...members,
      {
        ...parsed.data,
        id,
        avatar: null,
        joinedAt: new Date().toISOString().slice(0, 7),
        isActive: true,
        order: members.length + 1,
      },
    ];
    writeMockData({ members: next as unknown[] });
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
    const parsed = memberSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "参数校验失败" },
        { status: 400 }
      );
    }
    const next = members.map((m) => (m.id === id ? { ...m, ...parsed.data, id } : m));
    writeMockData({ members: next as unknown[] });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });
    const next = members.filter((m) => m.id !== id);
    writeMockData({ members: next as unknown[] });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
