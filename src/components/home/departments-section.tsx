"use client";

import { motion } from "framer-motion";
import { Code2, Server, Layers, Shield, Cpu, Brain, Smartphone, Palette, type LucideIcon } from "lucide-react";
import type { Department } from "@/lib/db";

const iconMap: Record<string, LucideIcon> = {
  Code2, Server, Layers, Shield, Cpu, Brain, Smartphone, Palette,
};

export function DepartmentsSection({ departments }: { departments: Department[] }) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-300">
            Our Departments
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
            {departments.length} 大核心方向
          </h2>
          <p className="mt-4 text-zinc-300 max-w-2xl mx-auto">
            无论你擅长哪个方向，都能在这里找到属于你的位置
          </p>
        </motion.div>

        {/* 部门卡片网格 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, i) => {
            const Icon = iconMap[dept.icon] ?? Code2;
            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-8 transition-all duration-300 hover:border-white/30 hover:bg-white/15"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-amber-300 transition-colors group-hover:bg-amber-300 group-hover:text-zinc-900">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{dept.name}</h3>
                <p className="mt-2 text-sm text-zinc-300 leading-relaxed">{dept.description}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {dept.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-zinc-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
