import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createMessage, getMessages, replyMessage } from "@/lib/db";

export const dynamic = "force-dynamic";

const messageSchema = z.object({
  name: z.string().min(2, "姓名至少 2 个字符"),
  email: z.string().email("请输入正确的邮箱"),
  topic: z.string().min(1, "请选择话题"),
  content: z.string().min(10, "内容至少 10 个字符"),
});

export async function GET() {
  try {
    return NextResponse.json(getMessages());
  } catch {
    return NextResponse.json({ error: "获取留言列表失败" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "参数校验失败";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const id = createMessage(parsed.data);
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
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
    replyMessage(parsed.data.id, parsed.data.reply);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "回复失败" }, { status: 500 });
  }
}
