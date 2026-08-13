"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { TimelineItem } from "@/lib/db";

export default function AboutPage() {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  useEffect(() => {
    fetch("/api/timeline")
      .then((res) => res.json())
      .then((data: TimelineItem[]) => setTimeline(data))
      .catch(() => setTimeline([]));
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <p className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs text-zinc-500">
            About 典创
          </p>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-zinc-900">
            关于 <span className="text-indigo-600">典创</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            一群热爱技术与创意的大学生，因为相信「代码可以改变世界」而聚在一起。
            11年时间，从 3 人小组到 20+ 人团队，我们用作品说话。
          </p>
        </motion.div>

        {/* 核心理念 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {[
            {
              title: "MISSION",
              zh: "我们的使命",
              desc: "用技术赋能创意，让每一位成员都能做出有影响力的作品。",
            },
            {
              title: "VISION",
              zh: "我们的愿景",
              desc: "成为中国最具影响力的高校技术工作室，培养下一代产品创造者。",
            },
            {
              title: "VALUES",
              zh: "我们的价值观",
              desc: "开放、协作、极致、创新。我们相信开源精神与极客文化。",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-zinc-200 bg-white p-8"
            >
              <div className="text-xs font-mono text-indigo-600 tracking-[0.2em]">
                {item.title}
              </div>
              <h3 className="mt-3 text-xl font-semibold text-zinc-900">
                {item.zh}
              </h3>
              <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 发展历程 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-600">
            Our Journey
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">
            发展历程
          </h2>
        </motion.div>

        <div className="relative">
          {/* 中线 */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-zinc-200" />

          <div className="space-y-12">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`flex items-center gap-8 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className="flex-1">
                  <div
                    className={`rounded-2xl border border-zinc-200 bg-white p-6 ${
                      i % 2 === 0 ? "text-right" : "text-left"
                    }`}
                  >
                    <div className="text-2xl font-bold tracking-tight text-indigo-600">
                      {item.year}
                    </div>
                    <h3 className="mt-1.5 text-lg font-semibold text-zinc-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                {/* 圆点 */}
                <div className="relative z-10 h-3 w-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
