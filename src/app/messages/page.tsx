"use client";

import { useState } from "react";
import { Search, Inbox, FileText, Mail } from "lucide-react";

const inputCls =
  "w-full px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition";

interface AppMessage {
  id: number;
  name: string;
  department: string | null;
  status: string;
  selfIntro: string | null;
  adminReply: string;
  repliedAt: string;
  createdAt: string;
}

interface MsgMessage {
  id: number;
  name: string;
  topic: string | null;
  content: string;
  adminReply: string;
  repliedAt: string;
  createdAt: string;
}

const statusText: Record<string, string> = {
  pending: "待处理",
  contacted: "已联系",
  approved: "已通过",
  rejected: "未通过",
};

export default function MessagesPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<{ applications: AppMessage[]; messages: MsgMessage[] } | null>(null);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearched(false);
    try {
      const res = await fetch(`/api/user-messages?email=${encodeURIComponent(email.trim())}`);
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "查询失败");
      } else {
        setData(result);
        setSearched(true);
      }
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const total = (data?.applications.length ?? 0) + (data?.messages.length ?? 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        {/* 标题 */}
        <div className="text-center mb-10">
          <div className="inline-flex w-12 h-12 rounded-xl bg-indigo-600 text-white items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900">我的消息</h1>
          <p className="mt-2 text-sm text-zinc-500">
            输入你报名或留言时填写的邮箱，查看工作室管理员给你的回复
          </p>
        </div>

        {/* 查询框 */}
        <form onSubmit={onSearch} className="flex gap-2.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className={inputCls}
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-6 text-sm font-medium text-white hover:bg-indigo-700 transition disabled:opacity-60"
          >
            <Search className="w-4 h-4" />
            {loading ? "查询中..." : "查询"}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {/* 结果 */}
        {searched && !error && (
          total === 0 ? (
            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-12 text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-zinc-600 font-medium">暂无消息</p>
              <p className="mt-1 text-sm text-zinc-400">
                该邮箱下还没有收到管理员回复。报名或留言后，管理员回复会显示在这里。
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-zinc-400">共 {total} 条消息</p>

              {data?.applications.map((a) => (
                <div key={`a-${a.id}`} className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">报名回复 · {a.department || "工作室"}</p>
                        <p className="text-xs text-zinc-400">{a.createdAt}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">
                      {statusText[a.status] || a.status}
                    </span>
                  </div>
                  <div className="rounded-lg bg-zinc-50 p-3 mb-3">
                    <p className="text-xs text-zinc-400 mb-1">我的报名</p>
                    <p className="text-sm text-zinc-700 leading-relaxed line-clamp-2">{a.selfIntro}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="text-xs text-emerald-500 mb-1">管理员回复 · {a.repliedAt}</p>
                    <p className="text-sm text-zinc-900 leading-relaxed whitespace-pre-wrap">{a.adminReply}</p>
                  </div>
                </div>
              ))}

              {data?.messages.map((m) => (
                <div key={`m-${m.id}`} className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">留言回复 · {m.topic || "留言"}</p>
                        <p className="text-xs text-zinc-400">{m.createdAt}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-zinc-50 p-3 mb-3">
                    <p className="text-xs text-zinc-400 mb-1">我的留言</p>
                    <p className="text-sm text-zinc-700 leading-relaxed line-clamp-2">{m.content}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="text-xs text-emerald-500 mb-1">管理员回复 · {m.repliedAt}</p>
                    <p className="text-sm text-zinc-900 leading-relaxed whitespace-pre-wrap">{m.adminReply}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
