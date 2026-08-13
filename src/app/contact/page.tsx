"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Code2,
  Sparkles,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      topic: String(formData.get("topic") || ""),
      content: String(formData.get("content") || ""),
    };

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "发送失败，请稍后重试");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("网络错误，请稍后重试");
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs text-zinc-500">
            Contact Us
          </p>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-zinc-900">
            联系<span className="text-indigo-600">我们</span>
          </h1>
          <p className="mt-4 text-zinc-500 max-w-2xl mx-auto">
            有任何问题、合作意向、内推机会？欢迎通过以下方式联系我们。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 联系信息 */}
          <div className="space-y-4">
            {[
              { icon: Mail, title: "邮箱", value: "hsdmwdzy@163.com" },
              { icon: MessageCircle, title: "QQ 群", value: "1049447556" },
              { icon: Code2, title: "GitHub", value: "None" },
              {
                icon: MapPin,
                title: "工作室地址",
                value: "喀什大学东城校区新工科楼",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-400">
                    {item.title}
                  </div>
                  <div className="text-base font-medium text-zinc-900 mt-0.5">
                    {item.value}
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-6 rounded-2xl bg-indigo-50 border border-indigo-100 p-6"
            >
              <div className="flex items-center gap-2 text-indigo-700 text-sm font-medium mb-2">
                <Sparkles className="w-4 h-4" />
                招新 & 交流
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed">
                招新相关问题请优先使用{" "}
                <a href="/join" className="text-indigo-600 hover:underline">
                  报名表
                </a>
                ， 技术交流请发邮件至{" "}
                <span className="text-indigo-600 font-medium">
                  hsdmwdzy@163.com
                </span>
                。
              </p>
            </motion.div>
          </div>

          {/* 联系表单 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-zinc-200 bg-white p-8"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="inline-flex w-16 h-16 rounded-full bg-indigo-600 items-center justify-center mb-4">
                  <Send className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">
                  消息已发送！
                </h3>
                <p className="text-sm text-zinc-500">我们会尽快回复你。</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm text-indigo-600 hover:underline"
                >
                  再发一条
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-zinc-900 mb-4">
                  给我们留言
                </h3>
                <input
                  required
                  name="name"
                  placeholder="你的姓名"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                />
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="你的邮箱"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                />
                <select
                  required
                  name="topic"
                  defaultValue=""
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                >
                  <option value="" disabled>
                    请选择话题
                  </option>
                  <option>招新咨询</option>
                  <option>技术交流</option>
                  <option>内推机会</option>
                  <option>其他</option>
                </select>
                <textarea
                  required
                  name="content"
                  rows={5}
                  placeholder="详细描述..."
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none transition"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "发送中..." : "发送消息"}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
