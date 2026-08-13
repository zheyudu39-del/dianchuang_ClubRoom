"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import type { Honor } from "@/lib/mock-api";

export default function HonorsPage() {
  const [honors, setHonors] = useState<Honor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/honors")
      .then((r) => r.json())
      .then((data) => setHonors(Array.isArray(data) ? data : []))
      .catch(() => setHonors([]))
      .finally(() => setLoading(false));
  }, []);

  // 无缝滚动:内容复制两份,translateX(-50%) 循环
  const marqueeItems = [...honors, ...honors];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex w-12 h-12 rounded-xl bg-indigo-600 text-white items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">荣誉奖项</h1>
          <p className="mt-3 text-zinc-500 max-w-2xl mx-auto">
            每一份荣誉都是典创成员共同努力的见证，我们会继续前行。
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-zinc-400">加载中...</div>
        ) : honors.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-16 text-center">
            <p className="text-4xl mb-3">🏆</p>
            <p className="text-zinc-600 font-medium">荣誉墙建设中</p>
            <p className="mt-1 text-sm text-zinc-400">工作室的获奖荣誉将陆续展示在这里</p>
          </div>
        ) : (
          <div className="marquee-paused relative">
            {/* 左右渐变遮罩 */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

            <div className="overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
              <div className="animate-marquee flex w-max gap-6 py-2 pl-4 sm:pl-6 lg:pl-8">
                {marqueeItems.map((h, i) => (
                  <div
                    key={`${h.id}-${i}`}
                    className="group w-64 sm:w-72 shrink-0 rounded-2xl border border-zinc-200 bg-white overflow-hidden hover:shadow-[0_16px_40px_-16px_rgba(24,24,27,0.18)] transition-shadow"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-zinc-50">
                      {h.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={h.image}
                          alt={h.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-200">
                          <Trophy className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-zinc-900 truncate">{h.title}</h3>
                        {h.year && (
                          <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                            {h.year}
                          </span>
                        )}
                      </div>
                      {h.description && (
                        <p className="mt-2 text-sm text-zinc-500 leading-relaxed line-clamp-2">
                          {h.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
