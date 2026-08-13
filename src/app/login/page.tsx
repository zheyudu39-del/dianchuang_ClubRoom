"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, LogIn, ShieldCheck } from "lucide-react";

const inputCls =
  "w-full px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "登录失败");
        setLoading(false);
        return;
      }
      router.push(redirect);
      router.refresh();
    } catch {
      setError("网络错误，请稍后重试");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 md:p-10 shadow-[0_20px_48px_-24px_rgba(24,24,27,0.15)]">
          <div className="text-center mb-8">
            <div className="inline-flex w-12 h-12 rounded-xl bg-zinc-900 text-white items-center justify-center text-lg font-bold">
              典
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">管理员登录</h1>
            <p className="mt-1.5 text-sm text-zinc-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              典创 管理后台专用入口
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">管理员邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hsdmwdzy@163.com"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
                className={inputCls}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "登录中..." : "登录后台"}
              <LogIn className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 transition">
              返回首页 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
