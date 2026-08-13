"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Code2, Code2 as Github } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Work } from "@/lib/db";

const categories = ["全部", "Web 应用", "AI 产品", "移动应用", "开源项目"];

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [filter, setFilter] = useState("全部");
  const filtered =
    filter === "全部" ? works : works.filter((w) => w.category === filter);

  useEffect(() => {
    fetch("/api/works")
      .then((res) => res.json())
      .then((data: Work[]) => setWorks(data))
      .catch(() => setWorks([]));
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs text-zinc-500">
            Our Works
          </p>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-zinc-900">
            我们的<span className="text-indigo-600">作品</span>
          </h1>
          <p className="mt-4 text-zinc-500 max-w-2xl mx-auto">
            {works.length} 款上线产品，每一个作品都是团队的结晶
          </p>
        </motion.div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm transition-colors",
                filter === cat
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 作品网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((work, i) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group flex flex-col rounded-2xl border border-zinc-200 bg-white overflow-hidden transition-all duration-300 hover:border-zinc-300 hover:shadow-[0_20px_48px_-24px_rgba(24,24,27,0.18)]"
            >
              {/* 封面占位 */}
              <div className="relative h-44 bg-zinc-100 flex items-center justify-center overflow-hidden">
                <Code2 className="w-10 h-10 text-zinc-300" strokeWidth={1.5} />
                <div className="absolute top-3 left-3 rounded-full bg-white/95 border border-zinc-200 px-2.5 py-0.5 text-[10px] font-medium text-zinc-600">
                  {work.category}
                </div>
              </div>

              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-lg font-semibold text-zinc-900">{work.title}</h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed line-clamp-3 flex-1">
                  {work.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {work.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2 pt-5 border-t border-zinc-100">
                  <Link
                    href={work.githubUrl || "#"}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900"
                  >
                    <Github className="w-3.5 h-3.5" />
                    源码
                  </Link>
                  <Link
                    href={work.demoUrl || "#"}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-600 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    预览
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
