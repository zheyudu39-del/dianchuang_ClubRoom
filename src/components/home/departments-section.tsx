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
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-600">
            Our Departments
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">
            {departments.length} 大核心方向
          </h2>
          <p className="mt-4 text-zinc-500 max-w-2xl mx-auto">
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
                className="group rounded-2xl border border-zinc-200 bg-white p-8 transition-all duration-300 hover:border-zinc-300 hover:shadow-[0_20px_48px_-24px_rgba(24,24,27,0.18)]"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-900">{dept.name}</h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{dept.description}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {dept.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600"
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
