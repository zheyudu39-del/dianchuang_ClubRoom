"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-amber-50">
      {/* GIF 背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bg-hero.gif"
          alt=""
          className="w-full h-full object-cover object-top scale-150"
        />
        {/* 均匀淡遮罩:保证文字可读 */}
        <div className="absolute inset-0 bg-black/15" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-20 text-center">
        {/* 徽章 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-black/30 backdrop-blur-md px-4 py-1.5 text-xs text-white"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
          2026 秋季纳新进行中 · 限额 3 人
        </motion.div>

        {/* 主标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-white"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.7)" }}
        >
          CREATE
          <span className="block text-amber-300 my-1">THE FUTURE</span>
          WITH CODE
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-white"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
        >
          典创 是一支由大学生组成的技术工作室。
          <br className="hidden sm:block" />
          我们深耕
          <span className="font-semibold"> C++ </span>
          <span className="opacity-60">·</span>
          <span className="font-semibold"> Go </span>
          <span className="opacity-60">·</span>
          <span className="font-semibold"> Python </span>
          <span className="opacity-60">·</span>
          <span className="font-semibold"> Java </span>
          <span className="opacity-60">·</span>
          <span className="font-semibold"> TypeScript</span>
          <br className="hidden sm:block" />
          专注
          <span className="font-semibold"> 前端 </span>
          <span className="opacity-60">·</span>
          <span className="font-semibold"> 后端 </span>
          <span className="opacity-60">·</span>
          <span className="font-semibold"> 全栈 </span>
          <span className="opacity-60">·</span>
          <span className="font-semibold"> 网络安全</span>
          ，用代码创造未来。
        </motion.p>

        {/* CTA 按钮组 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/join"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-zinc-900 px-8 text-sm font-medium text-white shadow-lg transition-colors hover:bg-zinc-800"
          >
            立即报名纳新
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/about"
            className="group inline-flex h-12 items-center gap-2 rounded-full border border-white/60 bg-white/10 backdrop-blur-md px-8 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            了解我们
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* 技术栈 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-24 flex flex-col items-center gap-6"
        >
          <p className="text-xs text-white uppercase tracking-[0.2em]" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
            Tech Stack
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-medium text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
            <span>C++</span>
            <span>Go</span>
            <span>Python</span>
            <span>Java</span>
            <span>TypeScript</span>
            <span>React</span>
            <span>Vue</span>
            <span>Node.js</span>
          </div>
        </motion.div>

        {/* 向下滚动提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-20 flex justify-center"
        >
          <div className="flex flex-col items-center gap-2 text-white text-xs" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
            <span className="tracking-[0.2em]">SCROLL</span>
            <div className="w-px h-8 bg-white/60" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}