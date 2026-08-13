// ============================================
// mock-data 映射层:把 mock-data.ts(唯一事实源)映射为 API/页面使用的类型
// 修改 mock-data.ts 保存后,网站内容立即更新(dev 热更新)
// ============================================
import { departments, members, works, timeline, faqs, stats, honors } from "@/lib/mock-data";
import type { Department, Member, Work, TimelineItem, Faq, Stat } from "@/lib/db";

export interface Honor {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  year: string | null;
  sortOrder: number;
}

export function getMockDepartments(): Department[] {
  return departments.map((d, i) => ({
    id: d.id,
    name: d.name,
    icon: d.icon,
    color: d.color,
    description: d.desc,
    skills: [...d.skills],
    sortOrder: i,
  }));
}

export function getMockMembers(): Member[] {
  return members.map((m) => ({
    id: m.id,
    name: m.name,
    avatar: m.avatar,
    role: m.role,
    department: m.department,
    position: m.position,
    bio: m.bio,
    skills: [...m.skills],
    github: m.github,
    joinedAt: m.joinedAt,
    isActive: m.isActive,
    sortOrder: m.order,
  }));
}

export function getMockWorks(): Work[] {
  return works.map((w) => ({
    id: w.id,
    title: w.title,
    description: w.description,
    cover: w.cover,
    techStack: [...w.techStack],
    category: w.category,
    githubUrl: w.githubUrl,
    demoUrl: w.demoUrl,
    teamMembers: [...w.teamMembers],
    isPublished: w.isPublished,
    createdAt: "",
  }));
}

export function getMockTimeline(): TimelineItem[] {
  return timeline.map((t, i) => ({
    id: i + 1,
    year: t.year,
    title: t.title,
    description: t.desc,
  }));
}

export function getMockFaqs(): Faq[] {
  return faqs.map((f, i) => ({
    id: i + 1,
    question: f.q,
    answer: f.a,
  }));
}

export function getMockStats(): Stat[] {
  return stats.map((s) => ({
    label: s.label,
    value: s.value,
    suffix: s.suffix,
  }));
}

export function getMockHonors(): Honor[] {
  return honors.map((h, i) => ({
    id: h.id,
    title: h.title,
    description: h.description ?? null,
    image: h.image ?? null,
    year: h.year ?? null,
    sortOrder: i,
  }));
}
