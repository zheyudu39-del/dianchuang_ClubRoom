/* eslint-disable @typescript-eslint/no-explicit-any -- better-sqlite3 动态行类型,统一按需断言 */
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// ============================================
// SQLite 数据库层(Nexus Studio 官网)
// 数据库文件: data/nexus.db(自动创建)
// ============================================

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(path.join(dataDir, "nexus.db"));
db.pragma("journal_mode = WAL");

// ============ 建表 ============
db.exec(`
CREATE TABLE IF NOT EXISTS departments (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT 'Code2',
  color       TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  skills      TEXT NOT NULL DEFAULT '[]',
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS members (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  avatar      TEXT,
  role        TEXT NOT NULL DEFAULT 'MEMBER',
  department  TEXT,
  position    TEXT,
  bio         TEXT,
  skills      TEXT NOT NULL DEFAULT '[]',
  github      TEXT,
  joined_at   TEXT,
  is_active   INTEGER NOT NULL DEFAULT 1,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS works (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  cover        TEXT,
  tech_stack   TEXT NOT NULL DEFAULT '[]',
  category     TEXT,
  github_url   TEXT,
  demo_url     TEXT,
  team_members TEXT NOT NULL DEFAULT '[]',
  is_published INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS timeline (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  year        TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS faqs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS stats (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  label      TEXT NOT NULL,
  value      INTEGER NOT NULL,
  suffix     TEXT NOT NULL DEFAULT '+',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS applications (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  student_id  TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  grade       TEXT,
  major       TEXT,
  department  TEXT,
  skills      TEXT,
  portfolio   TEXT,
  self_intro  TEXT,
  experience  TEXT,
  status      TEXT NOT NULL DEFAULT 'pending',
  created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  topic      TEXT,
  content    TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user',
  created_at    TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  token      TEXT NOT NULL UNIQUE,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
`);

// ============ 类型 ============
export interface Department {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  skills: string[];
  sortOrder: number;
}

export interface Member {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
  department: string | null;
  position: string | null;
  bio: string | null;
  skills: string[];
  github: string | null;
  joinedAt: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface Work {
  id: string;
  title: string;
  description: string | null;
  cover: string | null;
  techStack: string[];
  category: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  teamMembers: string[];
  isPublished: boolean;
  createdAt: string;
}

export interface TimelineItem {
  id: number;
  year: string;
  title: string;
  description: string | null;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
}

// ============ 查询函数 ============
export function getDepartments(): Department[] {
  const rows = db
    .prepare("SELECT * FROM departments ORDER BY sort_order ASC, id ASC")
    .all() as any[];
  return rows.map((r) => ({
    ...r,
    skills: JSON.parse(r.skills || "[]"),
    sortOrder: r.sort_order,
  }));
}

export function getMembers(): Member[] {
  const rows = db
    .prepare("SELECT * FROM members WHERE is_active = 1 ORDER BY sort_order ASC, id ASC")
    .all() as any[];
  return rows.map((r) => ({
    ...r,
    avatar: r.avatar ?? null,
    position: r.position ?? null,
    bio: r.bio ?? null,
    department: r.department ?? null,
    github: r.github ?? null,
    joinedAt: r.joined_at,
    isActive: !!r.is_active,
    sortOrder: r.sort_order,
    skills: JSON.parse(r.skills || "[]"),
  }));
}

export function getWorks(): Work[] {
  const rows = db
    .prepare("SELECT * FROM works WHERE is_published = 1 ORDER BY created_at DESC, id ASC")
    .all() as any[];
  return rows.map((r) => ({
    ...r,
    cover: r.cover ?? null,
    description: r.description ?? null,
    category: r.category ?? null,
    githubUrl: r.github_url,
    demoUrl: r.demo_url,
    createdAt: r.created_at,
    isPublished: !!r.is_published,
    techStack: JSON.parse(r.tech_stack || "[]"),
    teamMembers: JSON.parse(r.team_members || "[]"),
  }));
}

export function getTimeline(): TimelineItem[] {
  const rows = db
    .prepare("SELECT * FROM timeline ORDER BY sort_order ASC, year ASC")
    .all() as any[];
  return rows.map((r) => ({
    id: r.id,
    year: r.year,
    title: r.title,
    description: r.description ?? null,
  }));
}

export function getFaqs(): Faq[] {
  const rows = db
    .prepare("SELECT * FROM faqs ORDER BY sort_order ASC, id ASC")
    .all() as any[];
  return rows.map((r) => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
  }));
}

export function getStats(): Stat[] {
  const rows = db.prepare("SELECT * FROM stats ORDER BY sort_order ASC, id ASC").all() as any[];
  const list: Stat[] = rows.map((r) => ({
    label: r.label,
    value: r.value,
    suffix: r.suffix,
  }));
  // 兜底:表为空时返回默认宣传数字
  if (list.length === 0) {
    return [
      { label: "活跃成员", value: 48, suffix: "+" },
      { label: "代码提交", value: 12500, suffix: "+" },
      { label: "获奖项目", value: 12, suffix: " 项" },
      { label: "上线产品", value: 8, suffix: " 款" },
    ];
  }
  return list;
}

// ============ 写入函数 ============
export interface ApplicationInput {
  name: string;
  studentId: string;
  email: string;
  phone: string;
  grade: string;
  major: string;
  department: string;
  skills: string;
  portfolio?: string;
  selfIntro: string;
  experience?: string;
}

export function createApplication(input: ApplicationInput) {
  const info = db
    .prepare(
      `INSERT INTO applications
       (name, student_id, email, phone, grade, major, department, skills, portfolio, self_intro, experience)
       VALUES (@name, @studentId, @email, @phone, @grade, @major, @department, @skills, @portfolio, @selfIntro, @experience)`
    )
    .run({
      ...input,
      portfolio: input.portfolio || null,
      experience: input.experience || null,
    });
  return Number(info.lastInsertRowid);
}

export interface MessageInput {
  name: string;
  email: string;
  topic: string;
  content: string;
}

export function createMessage(input: MessageInput) {
  const info = db
    .prepare(
      `INSERT INTO messages (name, email, topic, content)
       VALUES (@name, @email, @topic, @content)`
    )
    .run(input);
  return Number(info.lastInsertRowid);
}

// ============ 访问统计 ============
db.exec(`
CREATE TABLE IF NOT EXISTS page_views (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  visit_date TEXT NOT NULL,
  path       TEXT NOT NULL DEFAULT '/',
  visitor_id TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(visit_date);
`);

export function recordVisit(visitDate: string, path: string, visitorId: string) {
  db.prepare(
    `INSERT INTO page_views (visit_date, path, visitor_id) VALUES (?, ?, ?)`
  ).run(visitDate, path, visitorId);
}

export function getVisitStats(days = 14): { date: string; pv: number; uv: number }[] {
  const rows = db
    .prepare(
      `SELECT visit_date as date,
              COUNT(*) as pv,
              COUNT(DISTINCT visitor_id) as uv
       FROM page_views
       WHERE visit_date >= date('now', ?)
       GROUP BY visit_date
       ORDER BY visit_date ASC`
    )
    .all(`-${days} days`) as any[];
  return rows.map((r) => ({ date: r.date, pv: r.pv, uv: r.uv }));
}

// ============ 报名管理 ============
export interface ApplicationRow {
  id: number;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  grade: string | null;
  major: string | null;
  department: string | null;
  skills: string | null;
  portfolio: string | null;
  selfIntro: string | null;
  experience: string | null;
  status: string;
  createdAt: string;
}

export function getApplications(): ApplicationRow[] {
  const rows = db
    .prepare("SELECT * FROM applications ORDER BY id DESC")
    .all() as any[];
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    studentId: r.student_id,
    email: r.email,
    phone: r.phone,
    grade: r.grade ?? null,
    major: r.major ?? null,
    department: r.department ?? null,
    skills: r.skills ?? null,
    portfolio: r.portfolio ?? null,
    selfIntro: r.self_intro ?? null,
    experience: r.experience ?? null,
    status: r.status,
    createdAt: r.created_at,
  }));
}

export function updateApplicationStatus(id: number, status: string) {
  db.prepare("UPDATE applications SET status = ? WHERE id = ?").run(status, id);
}

// ============ 成员管理 CRUD ============
export interface MemberInput {
  name: string;
  role: string;
  department: string;
  position: string;
  bio: string;
  skills: string[];
  github: string;
}

export function createMember(input: MemberInput) {
  const id = crypto.randomUUID().slice(0, 8);
  db.prepare(
    `INSERT INTO members (id, name, role, department, position, bio, skills, github, is_active)
     VALUES (@id, @name, @role, @department, @position, @bio, @skills, @github, 1)`
  ).run({ ...input, id, skills: JSON.stringify(input.skills) });
  return id;
}

export function updateMember(id: string, input: MemberInput) {
  db.prepare(
    `UPDATE members SET name=@name, role=@role, department=@department, position=@position,
     bio=@bio, skills=@skills, github=@github WHERE id=@id`
  ).run({ ...input, id, skills: JSON.stringify(input.skills) });
}

export function deleteMember(id: string) {
  db.prepare("DELETE FROM members WHERE id = ?").run(id);
}

// ============ 作品管理 CRUD ============
export interface WorkInput {
  title: string;
  description: string;
  techStack: string[];
  category: string;
  githubUrl: string;
  demoUrl: string;
}

export function createWork(input: WorkInput) {
  const id = crypto.randomUUID().slice(0, 8);
  db.prepare(
    `INSERT INTO works (id, title, description, tech_stack, category, github_url, demo_url, is_published)
     VALUES (@id, @title, @description, @techStack, @category, @githubUrl, @demoUrl, 1)`
  ).run({ ...input, id, techStack: JSON.stringify(input.techStack) });
  return id;
}

export function updateWork(id: string, input: WorkInput) {
  db.prepare(
    `UPDATE works SET title=@title, description=@description, tech_stack=@techStack,
     category=@category, github_url=@githubUrl, demo_url=@demoUrl WHERE id=@id`
  ).run({ ...input, id, techStack: JSON.stringify(input.techStack) });
}

export function deleteWork(id: string) {
  db.prepare("DELETE FROM works WHERE id = ?").run(id);
}

// ============ 部门管理 CRUD ============
export interface DepartmentInput {
  id: string;
  name: string;
  icon: string;
  description: string;
  skills: string[];
}

export function createDepartment(input: DepartmentInput) {
  db.prepare(
    `INSERT INTO departments (id, name, icon, description, skills)
     VALUES (@id, @name, @icon, @description, @skills)`
  ).run({ ...input, skills: JSON.stringify(input.skills) });
}

export function updateDepartment(id: string, input: DepartmentInput) {
  db.prepare(
    `UPDATE departments SET name=@name, icon=@icon, description=@description, skills=@skills
     WHERE id=@id`
  ).run({ ...input, id, skills: JSON.stringify(input.skills) });
}

export function deleteDepartment(id: string) {
  db.prepare("DELETE FROM departments WHERE id = ?").run(id);
}

// ============ 统计数字管理 ============
// label 唯一索引:保存时按标签 upsert,避免 DELETE+INSERT 导致 id 无限漂移
db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_stats_label ON stats(label)`);

export function replaceStats(list: { label: string; value: number; suffix: string }[]) {
  const tx = db.transaction((items: { label: string; value: number; suffix: string }[]) => {
    // 删除本次未提交的旧标签
    const oldRows = db.prepare("SELECT label FROM stats").all() as { label: string }[];
    for (const row of oldRows) {
      if (!items.some((i) => i.label === row.label)) {
        db.prepare("DELETE FROM stats WHERE label = ?").run(row.label);
      }
    }
    const upsert = db.prepare(
      `INSERT INTO stats (label, value, suffix, sort_order) VALUES (?, ?, ?, ?)
       ON CONFLICT(label) DO UPDATE SET value = excluded.value, suffix = excluded.suffix, sort_order = excluded.sort_order`
    );
    items.forEach((s, i) => upsert.run(s.label, s.value, s.suffix, i));
  });
  tx(list);
}

// ============ 后台总览 ============
export function getOverview() {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const count = (table: string) =>
    Number((db.prepare(`SELECT COUNT(*) c FROM ${table}`).get() as { c: number }).c);
  return {
    members: count("members"),
    works: count("works"),
    applications: count("applications"),
    messages: count("messages"),
    totalViews: count("page_views"),
    todayViews: Number(
      (db.prepare("SELECT COUNT(*) c FROM page_views WHERE visit_date = ?").get(todayStr) as {
        c: number;
      }).c
    ),
  };
}
