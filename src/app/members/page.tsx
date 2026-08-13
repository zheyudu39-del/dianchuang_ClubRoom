"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Code2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Department, Member } from "@/lib/db";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((data: Member[]) => setMembers(data))
      .catch(() => setMembers([]));
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data: Department[]) => setDepartments(data))
      .catch(() => setDepartments([]));
  }, []);

  const deptNameMap = Object.fromEntries(departments.map((d) => [d.id, d.name]));
  const filtered = filter === "all" ? members : members.filter((m) => m.department === filter);

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
            Our Team
          </p>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-zinc-900">
            我们的<span className="text-indigo-600">团队</span>
          </h1>
          <p className="mt-4 text-zinc-500 max-w-2xl mx-auto">
            {members.length} 位成员，{departments.length} 大部门，每一位都是 典创 的核心力量
          </p>
        </motion.div>

        {/* 部门筛选 */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            全部
          </FilterChip>
          {departments.map((dept) => (
            <FilterChip
              key={dept.id}
              active={filter === dept.id}
              onClick={() => setFilter(dept.id)}
            >
              {dept.name}
            </FilterChip>
          ))}
        </div>

        {/* 成员卡片 */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filtered.map((member, i) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:border-zinc-300 hover:shadow-[0_20px_48px_-24px_rgba(24,24,27,0.18)]"
            >
              {/* 头像 */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center text-2xl font-bold text-zinc-900">
                  {member.name.charAt(0)}
                </div>
                {member.role === "LEADER" && (
                  <div className="absolute -top-1 -right-2 rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-white">
                    组长
                  </div>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold text-zinc-900">{member.name}</h3>
                <p className="mt-0.5 text-xs font-medium text-indigo-600">{member.position}</p>
                <p className="mt-1 text-xs text-zinc-400">
                  {member.department ? deptNameMap[member.department] ?? member.department : ""}
                </p>
                <p className="mt-3 text-sm text-zinc-500 leading-relaxed line-clamp-2 min-h-[40px]">
                  {member.bio}
                </p>

                <div className="mt-4 flex flex-wrap gap-1 justify-center min-h-[24px]">
                  {member.skills.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 pt-4 border-t border-zinc-100">
                  <a
                    href="#"
                    className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    aria-label="GitHub"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="#"
                    className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    aria-label="Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm transition-colors",
        active
          ? "bg-zinc-900 text-white"
          : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
      )}
    >
      {children}
    </button>
  );
}
