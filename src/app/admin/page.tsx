/* eslint-disable @typescript-eslint/no-explicit-any -- 管理后台各模块 props 多为 API 数据透传 */
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Users, Code2, Briefcase, FileText, Mail, BarChart3, PieChart,
  Plus, Pencil, Trash2, X, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab =
  | "overview" | "applications" | "messages"
  | "members" | "works" | "departments" | "stats" | "visits";

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: "overview", label: "总览", icon: LayoutDashboard },
  { id: "applications", label: "报名管理", icon: FileText },
  { id: "messages", label: "留言管理", icon: Mail },
  { id: "members", label: "成员管理", icon: Users },
  { id: "works", label: "作品管理", icon: Briefcase },
  { id: "departments", label: "部门管理", icon: PieChart },
  { id: "stats", label: "首页统计数字", icon: BarChart3 },
  { id: "visits", label: "访问统计", icon: Code2 },
];

const statusMap: Record<string, { label: string; cls: string }> = {
  pending: { label: "待处理", cls: "bg-amber-50 text-amber-700" },
  contacted: { label: "已联系", cls: "bg-sky-50 text-sky-700" },
  approved: { label: "已通过", cls: "bg-emerald-50 text-emerald-700" },
  rejected: { label: "未通过", cls: "bg-zinc-100 text-zinc-500" },
};

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [overview, setOverview] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [works, setWorks] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const j = async (url: string) => {
      try {
        const res = await fetch(url);
        return res.ok ? res.json() : [];
      } catch {
        return [];
      }
    };
    if (tab === "overview") setOverview(await j("/api/admin/overview"));
    if (tab === "applications") setApplications(await j("/api/applications"));
    if (tab === "messages") setMessages(await j("/api/messages"));
    if (tab === "members") setMembers(await j("/api/members"));
    if (tab === "works") setWorks(await j("/api/works"));
    if (tab === "departments") setDepartments(await j("/api/departments"));
    if (tab === "stats") setStats(await j("/api/stats"));
    if (tab === "visits") setVisits(await j("/api/visits?days=14"));
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tab 数据加载的标准模式
    load();
  }, [load]);

  const act = async (url: string, method: string, body?: any) => {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    return res;
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        {/* 头部 */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-600">Admin</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">
              典创 管理后台
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              数据存储在 <code className="text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded">data/nexus.db</code>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-9 items-center rounded-full border border-zinc-300 px-4 text-sm text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 transition"
            >
              返回网站
            </Link>
            <button
              onClick={load}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-zinc-900 px-4 text-sm text-white hover:bg-zinc-800 transition"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
              刷新
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-8 border-b border-zinc-200 pb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-colors",
                tab === t.id
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && <Overview overview={overview} />}
        {tab === "applications" && (
          <ApplicationsTable rows={applications} onChange={async () => { await load(); }} act={act} />
        )}
        {tab === "messages" && <MessagesTable rows={messages} />}
        {tab === "members" && (
          <MembersManage rows={members} departments={departments} onChange={load} act={act} />
        )}
        {tab === "works" && <WorksManage rows={works} onChange={load} act={act} />}
        {tab === "departments" && (
          <DepartmentsManage rows={departments} onChange={load} act={act} />
        )}
        {tab === "stats" && <StatsManage rows={stats} onChange={load} act={act} />}
        {tab === "visits" && <VisitsView rows={visits} />}
      </div>
    </div>
  );
}

/* ============ 总览 ============ */
function Overview({ overview }: { overview: any }) {
  const cards = overview
    ? [
        { label: "成员", value: overview.members, sub: "在职成员" },
        { label: "作品", value: overview.works, sub: "已发布" },
        { label: "报名", value: overview.applications, sub: "累计" },
        { label: "留言", value: overview.messages, sub: "累计" },
        { label: "今日浏览", value: overview.todayViews, sub: "PV" },
        { label: "总浏览", value: overview.totalViews, sub: "PV" },
      ]
    : [];
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-zinc-200 bg-white p-6">
            <div className="text-sm text-zinc-500">{c.label}</div>
            <div className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 tabular-nums">
              {c.value}
            </div>
            <div className="mt-1 text-xs text-zinc-400">{c.sub}</div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-zinc-500">
        💡 管理入口：<span className="text-zinc-700">左侧 Tab 切换模块</span>，
        成员/作品/部门可直接增删改，首页统计数字可编辑，报名可标记处理状态。
      </p>
    </div>
  );
}

/* ============ 报名管理 ============ */
function ApplicationsTable({ rows, onChange, act }: any) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm min-w-[760px]">
        <thead className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-400">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">姓名</th>
            <th className="px-4 py-3">学号</th>
            <th className="px-4 py-3">邮箱</th>
            <th className="px-4 py-3">手机</th>
            <th className="px-4 py-3">年级/专业</th>
            <th className="px-4 py-3">意向部门</th>
            <th className="px-4 py-3">技能</th>
            <th className="px-4 py-3">提交时间</th>
            <th className="px-4 py-3">状态</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((r: any) => (
            <tr key={r.id} className="hover:bg-zinc-50/60">
              <td className="px-4 py-3 text-zinc-400 font-mono text-xs">{r.id}</td>
              <td className="px-4 py-3 font-medium text-zinc-900">{r.name}</td>
              <td className="px-4 py-3 font-mono text-xs">{r.studentId}</td>
              <td className="px-4 py-3 text-zinc-600">{r.email}</td>
              <td className="px-4 py-3 text-zinc-600">{r.phone}</td>
              <td className="px-4 py-3 text-zinc-600">{r.grade} {r.major}</td>
              <td className="px-4 py-3 text-zinc-600">{r.department}</td>
              <td className="px-4 py-3 text-zinc-500 text-xs max-w-[160px] truncate">{r.skills}</td>
              <td className="px-4 py-3 text-zinc-400 text-xs whitespace-nowrap">{r.createdAt}</td>
              <td className="px-4 py-3">
                <select
                  value={r.status}
                  onChange={async (e) => {
                    await act(`/api/applications?id=${r.id}`, "PATCH", { status: e.target.value });
                    onChange();
                  }}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs border-0 cursor-pointer",
                    statusMap[r.status]?.cls ?? "bg-zinc-100 text-zinc-600"
                  )}
                >
                  <option value="pending">待处理</option>
                  <option value="contacted">已联系</option>
                  <option value="approved">已通过</option>
                  <option value="rejected">未通过</option>
                </select>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={10} className="px-4 py-12 text-center text-zinc-400">暂无报名数据</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ============ 留言管理 ============ */
function MessagesTable({ rows }: { rows: any[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm min-w-[600px]">
        <thead className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-400">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">姓名</th>
            <th className="px-4 py-3">邮箱</th>
            <th className="px-4 py-3">话题</th>
            <th className="px-4 py-3">内容</th>
            <th className="px-4 py-3">时间</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((m: any) => (
            <tr key={m.id} className="hover:bg-zinc-50/60 align-top">
              <td className="px-4 py-3 text-zinc-400 font-mono text-xs">{m.id}</td>
              <td className="px-4 py-3 font-medium text-zinc-900 whitespace-nowrap">{m.name}</td>
              <td className="px-4 py-3 text-zinc-600">{m.email}</td>
              <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">{m.topic}</td>
              <td className="px-4 py-3 text-zinc-500 max-w-[320px]">{m.content}</td>
              <td className="px-4 py-3 text-zinc-400 text-xs whitespace-nowrap">{m.created_at}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-400">暂无留言</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ============ 成员管理 ============ */
function MembersManage({ rows, departments, onChange, act }: any) {
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ skills: "" });

  const openNew = () => {
    setForm({ name: "", role: "MEMBER", department: departments[0]?.id ?? "", position: "", bio: "", skills: "", github: "" });
    setEditing({ id: null });
  };
  const openEdit = (m: any) => {
    setForm({ ...m, skills: m.skills.join(", ") });
    setEditing({ id: m.id });
  };
  const save = async () => {
    const payload = { ...form, skills: form.skills.split(",").map((s: string) => s.trim()).filter(Boolean) };
    const url = editing.id ? `/api/members?id=${editing.id}` : "/api/members";
    const res = await act(url, editing.id ? "PUT" : "POST", payload);
    if (res.ok) { setEditing(null); onChange(); }
  };
  const remove = async (id: string) => {
    if (!confirm("确认删除该成员？")) return;
    await act(`/api/members?id=${id}`, "DELETE");
    onChange();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-500">共 {rows.length} 位成员</p>
        <button onClick={openNew} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-indigo-600 px-4 text-sm text-white hover:bg-indigo-700 transition">
          <Plus className="w-3.5 h-3.5" /> 新增成员
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((m: any) => (
          <div key={m.id} className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-lg font-bold text-zinc-900">
                {m.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-zinc-900 truncate">{m.name}</span>
                  {m.role === "LEADER" && (
                    <span className="rounded-full bg-zinc-900 px-1.5 py-0.5 text-[10px] text-white">组长</span>
                  )}
                </div>
                <div className="text-xs text-indigo-600 truncate">{m.position}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 transition" aria-label="编辑">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => remove(m.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition" aria-label="删除">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="mt-3 text-xs text-zinc-500 line-clamp-2">{m.bio}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {m.skills.map((s: string) => (
                <span key={s} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={editing.id ? "编辑成员" : "新增成员"} onClose={() => setEditing(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="姓名"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="角色">
              <select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="MEMBER">成员</option>
                <option value="LEADER">组长</option>
              </select>
            </Field>
            <Field label="部门">
              <select className={inputCls} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                {departments.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </Field>
            <Field label="职位"><input className={inputCls} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></Field>
            <Field label="技能(逗号分隔)" span><input className={inputCls} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} /></Field>
            <Field label="简介" span><textarea rows={3} className={inputCls} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></Field>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-full border border-zinc-300 text-sm text-zinc-700 hover:border-zinc-900">取消</button>
            <button onClick={save} className="px-5 py-2 rounded-full bg-indigo-600 text-sm text-white hover:bg-indigo-700">保存</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============ 作品管理 ============ */
const workCategories = ["Web 应用", "AI 产品", "移动应用", "开源项目"];

function WorksManage({ rows, onChange, act }: any) {
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ techStack: "" });

  const openNew = () => {
    setForm({ title: "", category: workCategories[0], description: "", techStack: "", githubUrl: "#", demoUrl: "#" });
    setEditing({ id: null });
  };
  const openEdit = (w: any) => {
    setForm({ ...w, techStack: w.techStack.join(", ") });
    setEditing({ id: w.id });
  };
  const save = async () => {
    const payload = { ...form, techStack: form.techStack.split(",").map((s: string) => s.trim()).filter(Boolean) };
    const url = editing.id ? `/api/works?id=${editing.id}` : "/api/works";
    const res = await act(url, editing.id ? "PUT" : "POST", payload);
    if (res.ok) { setEditing(null); onChange(); }
  };
  const remove = async (id: string) => {
    if (!confirm("确认删除该作品？")) return;
    await act(`/api/works?id=${id}`, "DELETE");
    onChange();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-500">共 {rows.length} 个作品</p>
        <button onClick={openNew} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-indigo-600 px-4 text-sm text-white hover:bg-indigo-700 transition">
          <Plus className="w-3.5 h-3.5" /> 新增作品
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm min-w-[720px]">
          <thead className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="px-4 py-3">标题</th>
              <th className="px-4 py-3">分类</th>
              <th className="px-4 py-3">技术栈</th>
              <th className="px-4 py-3">描述</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((w: any) => (
              <tr key={w.id} className="hover:bg-zinc-50/60 align-top">
                <td className="px-4 py-3 font-medium text-zinc-900 whitespace-nowrap">{w.title}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{w.category}</span></td>
                <td className="px-4 py-3 text-zinc-500 text-xs">{w.techStack.join(" / ")}</td>
                <td className="px-4 py-3 text-zinc-500 max-w-[300px] line-clamp-2">{w.description}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(w)} className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 transition" aria-label="编辑"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => remove(w.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition" aria-label="删除"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-zinc-400">暂无作品</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing.id ? "编辑作品" : "新增作品"} onClose={() => setEditing(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="标题"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="分类">
              <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {workCategories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="技术栈(逗号分隔)" span><input className={inputCls} value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} /></Field>
            <Field label="源码链接"><input className={inputCls} value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} /></Field>
            <Field label="预览链接"><input className={inputCls} value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} /></Field>
            <Field label="描述" span><textarea rows={3} className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-full border border-zinc-300 text-sm text-zinc-700 hover:border-zinc-900">取消</button>
            <button onClick={save} className="px-5 py-2 rounded-full bg-indigo-600 text-sm text-white hover:bg-indigo-700">保存</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============ 部门管理 ============ */
const iconOptions = ["Code2", "Server", "Brain", "Palette", "Smartphone", "Lightbulb"];

function DepartmentsManage({ rows, onChange, act }: any) {
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ skills: "" });

  const openNew = () => {
    setForm({ id: "", name: "", icon: "Code2", description: "", skills: "" });
    setEditing({ id: null });
  };
  const openEdit = (d: any) => {
    setForm({ ...d, skills: d.skills.join(", ") });
    setEditing({ id: d.id });
  };
  const save = async () => {
    const payload = { ...form, skills: form.skills.split(",").map((s: string) => s.trim()).filter(Boolean) };
    const url = editing.id ? `/api/departments?id=${editing.id}` : "/api/departments";
    const res = await act(url, editing.id ? "PUT" : "POST", payload);
    if (res.ok) { setEditing(null); onChange(); }
  };
  const remove = async (id: string) => {
    if (!confirm("确认删除该部门？")) return;
    await act(`/api/departments?id=${id}`, "DELETE");
    onChange();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-500">共 {rows.length} 个部门</p>
        <button onClick={openNew} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-indigo-600 px-4 text-sm text-white hover:bg-indigo-700 transition">
          <Plus className="w-3.5 h-3.5" /> 新增部门
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm min-w-[640px]">
          <thead className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="px-4 py-3">id</th>
              <th className="px-4 py-3">名称</th>
              <th className="px-4 py-3">图标</th>
              <th className="px-4 py-3">描述</th>
              <th className="px-4 py-3">技能</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((d: any) => (
              <tr key={d.id} className="hover:bg-zinc-50/60 align-top">
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">{d.id}</td>
                <td className="px-4 py-3 font-medium text-zinc-900 whitespace-nowrap">{d.name}</td>
                <td className="px-4 py-3 text-zinc-500 font-mono text-xs">{d.icon}</td>
                <td className="px-4 py-3 text-zinc-500 max-w-[260px]">{d.description}</td>
                <td className="px-4 py-3 text-zinc-500 text-xs">{d.skills.slice(0, 3).join(" / ")}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 transition" aria-label="编辑"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => remove(d.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition" aria-label="删除"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing.id ? "编辑部门" : "新增部门"} onClose={() => setEditing(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!editing.id && (
              <Field label="id(小写字母/数字/连字符)"><input className={inputCls} value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} /></Field>
            )}
            <Field label="名称"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="图标">
              <select className={inputCls} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                {iconOptions.map((i) => <option key={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="技能(逗号分隔)" span><input className={inputCls} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} /></Field>
            <Field label="描述" span><textarea rows={3} className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-full border border-zinc-300 text-sm text-zinc-700 hover:border-zinc-900">取消</button>
            <button onClick={save} className="px-5 py-2 rounded-full bg-indigo-600 text-sm text-white hover:bg-indigo-700">保存</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============ 首页统计数字管理 ============ */
function StatsManage({ rows, onChange, act }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [prevRows, setPrevRows] = useState<any[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  // 渲染期间同步外部数据(React 官方推荐模式,避免 effect 内 setState)
  if (rows !== prevRows) {
    setPrevRows(rows);
    setItems(rows.length ? rows : [
      { label: "活跃成员", value: 48, suffix: "+" },
      { label: "代码提交", value: 12500, suffix: "+" },
      { label: "获奖项目", value: 12, suffix: " 项" },
      { label: "上线产品", value: 8, suffix: " 款" },
    ]);
  }

  const save = async () => {
    setSaving(true);
    setFeedback(null);
    const payload = items.map((s) => ({
      label: s.label,
      // 数字输入防呆:去千分位逗号/空格,非法则回退原值
      value: Number(String(s.value ?? 0).replace(/[,，\s]/g, "")) || Number(s.value) || 0,
      suffix: s.suffix || "+",
    }));
    try {
      const res = await act("/api/stats", "PUT", payload);
      if (res.ok) {
        setFeedback({ type: "ok", msg: "已保存到首页，请刷新首页查看" });
        onChange();
      } else {
        const data = await res.json().catch(() => ({}));
        setFeedback({ type: "err", msg: data.error || "保存失败，请重试" });
      }
    } catch {
      setFeedback({ type: "err", msg: "网络错误，保存失败" });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  return (
    <div>
      <p className="mb-4 text-sm text-zinc-500">
        修改首页 4 个大数字，保存后立即生效。数值请直接输入纯数字（如 12500），不要带逗号。
      </p>
      <div className="rounded-2xl border border-zinc-200 bg-white divide-y divide-zinc-100">
        {items.map((s, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_120px_80px] gap-3 p-4 items-center">
            <input className={inputCls} value={s.label} onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} placeholder="标签" />
            <input className={inputCls} type="text" inputMode="numeric" value={s.value} onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} placeholder="数值" />
            <input className={inputCls} value={s.suffix} onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, suffix: e.target.value } : x))} placeholder="后缀" />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => setItems([...items, { label: "", value: 0, suffix: "+" }])}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-zinc-300 px-4 text-sm text-zinc-700 hover:border-zinc-900 transition"
        >
          <Plus className="w-3.5 h-3.5" /> 添加一项
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex h-9 items-center rounded-full bg-indigo-600 px-5 text-sm text-white hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "保存中..." : "保存到首页"}
        </button>
        {feedback && (
          <span className={cn("text-sm", feedback.type === "ok" ? "text-emerald-600" : "text-red-500")}>
            {feedback.type === "ok" ? "✓ " : "✗ "}{feedback.msg}
          </span>
        )}
      </div>
    </div>
  );
}

/* ============ 访问统计 ============ */
function VisitsView({ rows }: { rows: any[] }) {
  const max = Math.max(1, ...rows.map((r) => r.pv));
  return (
    <div>
      <p className="mb-4 text-sm text-zinc-500">近 14 天页面浏览(PV)与独立访客(UV)——数据来自全站埋点</p>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="flex items-end gap-1.5 h-40">
          {rows.map((r) => (
            <div key={r.date} className="flex-1 flex flex-col items-center gap-1 group" title={`${r.date} PV:${r.pv} UV:${r.uv}`}>
              <div className="w-full rounded-t-md bg-indigo-500/80 group-hover:bg-indigo-600 transition-all"
                style={{ height: `${Math.max(6, (r.pv / max) * 100)}%` }} />
              <div className="text-[10px] text-zinc-400 rotate-0 whitespace-nowrap">
                {r.date.slice(5)}
              </div>
            </div>
          ))}
        </div>
        {rows.length === 0 && (
          <p className="text-center text-zinc-400 py-10">暂无访问数据，刷新几次页面后再来看</p>
        )}
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-400">
            <tr><th className="px-4 py-3">日期</th><th className="px-4 py-3">PV(浏览量)</th><th className="px-4 py-3">UV(访客数)</th></tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((r) => (
              <tr key={r.date} className="hover:bg-zinc-50/60">
                <td className="px-4 py-2.5 text-zinc-600">{r.date}</td>
                <td className="px-4 py-2.5 font-medium text-zinc-900 tabular-nums">{r.pv}</td>
                <td className="px-4 py-2.5 text-zinc-600 tabular-nums">{r.uv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============ 通用组件 ============ */
function Field({ label, span, children }: { label: string; span?: boolean; children: React.ReactNode }) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <label className="block text-sm font-medium text-zinc-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition" aria-label="关闭">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
