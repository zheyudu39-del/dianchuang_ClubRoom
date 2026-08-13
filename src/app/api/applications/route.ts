import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getApplications, createApplication, updateApplicationStatus, replyApplication } from "@/lib/db";

export const dynamic = "force-dynamic";

const applicationSchema = z.object({
  name: z.string().min(2, "姓名至少 2 个字符"),
  studentId: z.string().min(8, "请输入正确的学号"),
  email: z.string().email("请输入正确的邮箱"),
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入正确的手机号"),
  grade: z.string().min(1, "请选择年级"),
  major: z.string().min(2, "请输入专业"),
  department: z.string().min(1, "请选择意向部门"),
  skills: z.string().min(2, "请填写技能"),
  selfIntro: z.string().min(20, "自我介绍至少 20 字"),
  portfolio: z.string().url("请输入正确的 URL").optional().or(z.literal("")),
  experience: z.string().optional(),
});

const statusSchema = z.enum(["pending", "contacted", "approved", "rejected"]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "参数校验失败";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const id = createApplication(parsed.data);
    return NextResponse.json(
      { success: true, id, code: `#NX${10000 + id}` },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json(getApplications());
  } catch {
    return NextResponse.json({ error: "获取报名列表失败" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "参数不合法" }, { status: 400 });
    }
    const body = await req.json();
    const parsed = statusSchema.safeParse(body.status);
    if (!parsed.success) {
      return NextResponse.json({ error: "状态值不合法" }, { status: 400 });
    }
    updateApplicationStatus(id, parsed.data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

const replySchema = z.object({
  id: z.number().int().positive(),
  reply: z.string().min(1, "回复内容不能为空").max(2000, "回复最多 2000 字"),
});

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = replySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "参数校验失败" },
        { status: 400 }
      );
    }
    replyApplication(parsed.data.id, parsed.data.reply);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "回复失败" }, { status: 500 });
  }
}
