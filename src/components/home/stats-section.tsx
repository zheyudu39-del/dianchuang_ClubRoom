"use client";

import { motion } from "framer-motion";
import type { Stat } from "@/lib/db";

export function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 text-center">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-white tabular-nums" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
              {stat.value.toLocaleString()}
              <span className="text-amber-300">{stat.suffix}</span>
            </div>
            <div className="mt-2.5 text-sm text-zinc-300">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
