"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-zinc-900 px-8 py-16 md:py-24 text-center"
      >
        {/* 极简装饰光晕 */}
        <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            准备好加入我们了吗？
          </h2>
          <p className="mt-6 text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            2026 秋季纳新正在火热进行中。无论你是技术大神还是新手小白，
            只要你有热情、有想法，我们都欢迎你加入 典创 大家庭。
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/join"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
            >
              立即报名
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/members"
              className="group inline-flex h-12 items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              先看看我们的团队
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
