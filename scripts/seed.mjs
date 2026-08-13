// ============================================
// 种子数据脚本 - 将站点的初始数据写入 SQLite
// 运行: node scripts/seed.mjs
// 幂等:重复运行会先清空业务表再重新插入
// ============================================
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "nexus.db"));

// ---------- 建表(与 src/lib/db.ts 保持一致) ----------
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
`);

// ---------- 清空业务表 ----------
db.exec(`
DELETE FROM departments;
DELETE FROM members;
DELETE FROM works;
DELETE FROM timeline;
DELETE FROM faqs;
DELETE FROM stats;
`);

// ---------- 部门 ----------
const departments = [
  { id: "frontend", name: "前端开发", icon: "Code2", color: "", description: "用 TypeScript 构建流畅的 Web 体验，让界面与交互都恰到好处", skills: ["TypeScript", "React", "Vue", "Next.js", "Tailwind"] },
  { id: "backend", name: "后端开发", icon: "Server", color: "", description: "以 Go / Java / Python 打造高可用服务，让数据稳定流转", skills: ["Go", "Java", "Python", "Node.js", "PostgreSQL"] },
  { id: "fullstack", name: "全栈开发", icon: "Layers", color: "", description: "打通前后端与云原生，独立交付完整产品", skills: ["TypeScript", "Node.js", "微服务", "云原生", "Docker"] },
  { id: "security", name: "网络安全", icon: "Shield", color: "", description: "攻防实战与代码审计，守护系统与数据安全", skills: ["渗透测试", "逆向工程", "CTF", "Python", "Web 安全"] },
  { id: "systems", name: "系统与算法", icon: "Cpu", color: "", description: "以 C++ 打磨底层与高性能计算，向效率极致进军", skills: ["C++", "数据结构", "算法", "操作系统", "网络编程"] },
  { id: "ai", name: "人工智能", icon: "Brain", color: "", description: "用 Python 与机器学习探索智能边界，驱动数据价值", skills: ["Python", "机器学习", "数据分析", "PyTorch", "LLM"] },
  { id: "mobile", name: "移动开发", icon: "Smartphone", color: "", description: "将体验装进口袋，让创意随触可及", skills: ["Flutter", "Android", "iOS", "Kotlin", "Swift"] },
  { id: "design", name: "产品设计", icon: "Palette", color: "", description: "洞察需求、打磨交互，让产品有灵魂", skills: ["UI/UX", "Figma", "原型设计", "用户调研", "品牌"] },
];
const insertDept = db.prepare(
  `INSERT INTO departments (id, name, icon, color, description, skills, sort_order)
   VALUES (@id, @name, @icon, @color, @description, @skills, @sort_order)`
);
departments.forEach((d, i) =>
  insertDept.run({ ...d, skills: JSON.stringify(d.skills), sort_order: i })
);

// ---------- 团队成员 ----------
const members = [
  { id: "1", name: "陈逸飞", role: "LEADER", department: "frontend", position: "工作室负责人", bio: "热爱前端架构与 TypeScript，相信代码可以改变世界。", skills: ["TypeScript", "React", "Next.js"], github: "yifei", joinedAt: "2023-09" },
  { id: "2", name: "林子衿", role: "LEADER", department: "ai", position: "AI 组组长", bio: "痴迷于机器学习与数据科学，坚信 AI 是未来十年的核心驱动力。", skills: ["Python", "PyTorch", "机器学习"], github: "zijin", joinedAt: "2023-09" },
  { id: "3", name: "苏景行", role: "MEMBER", department: "design", position: "设计总监", bio: "把每一个像素当作艺术品，细节决定品质。", skills: ["Figma", "UI/UX", "原型设计"], github: "jingxing", joinedAt: "2023-09" },
  { id: "4", name: "周慕云", role: "MEMBER", department: "backend", position: "后端工程师", bio: "深耕 Go 与 Java 服务端，玩转高并发与微服务架构。", skills: ["Go", "Java", "PostgreSQL"], github: "muyun", joinedAt: "2024-03" },
  { id: "5", name: "李清照", role: "MEMBER", department: "mobile", position: "移动端工程师", bio: "Flutter 全栈玩家，做过 5 款上架 App。", skills: ["Flutter", "Dart", "Kotlin"], github: "qingzhao", joinedAt: "2024-03" },
  { id: "6", name: "王小帆", role: "MEMBER", department: "systems", position: "算法工程师", bio: "以 C++ 为伴，沉迷数据结构的精妙与算法的优雅。", skills: ["C++", "数据结构", "算法"], github: "xiaofan", joinedAt: "2024-09" },
  { id: "7", name: "高远舟", role: "MEMBER", department: "security", position: "安全工程师", bio: "专注渗透测试与逆向工程，乐于在攻防博弈中成长。", skills: ["渗透测试", "逆向工程", "Python"], github: "yuanzhou", joinedAt: "2024-09" },
  { id: "8", name: "韩子墨", role: "MEMBER", department: "fullstack", position: "全栈工程师", bio: "TypeScript 布道者，痴迷于从零到一交付完整产品。", skills: ["TypeScript", "Node.js", "云原生"], github: "zimo", joinedAt: "2024-09" },
];
const insertMember = db.prepare(
  `INSERT INTO members (id, name, role, department, position, bio, skills, github, joined_at, is_active, sort_order)
   VALUES (@id, @name, @role, @department, @position, @bio, @skills, @github, @joinedAt, 1, @sort_order)`
);
members.forEach((m, i) => insertMember.run({ ...m, skills: JSON.stringify(m.skills), sort_order: i }));

// ---------- 作品 ----------
const works = [
  { id: "1", title: "Nimbus 云笔记", description: "基于 Next.js + Go 的全栈云笔记应用，支持 Markdown、AI 总结、协同编辑。已上线运营 1 年。", techStack: ["Next.js", "TypeScript", "Go", "PostgreSQL"], category: "Web 应用", githubUrl: "#", demoUrl: "#", teamMembers: ["1", "4"] },
  { id: "2", title: "Echo 智能客服", description: "基于 RAG 架构的智能客服系统，毫秒级响应，准确率 95%+。已服务 3 家企业客户。", techStack: ["Python", "机器学习", "FastAPI", "Milvus"], category: "AI 产品", githubUrl: "#", demoUrl: "#", teamMembers: ["2", "7"] },
  { id: "3", title: "Pulse 心率监测", description: "Flutter 移动端应用，结合 Android/iOS 健康能力，实时监测心率并生成健康报告。", techStack: ["Flutter", "Dart", "Kotlin"], category: "移动应用", githubUrl: "#", demoUrl: "#", teamMembers: ["5"] },
  { id: "4", title: "Aurora 校园社交", description: "面向大学生的兴趣社交平台，话题、活动、二手交易一站式。DAU 突破 5000。", techStack: ["Vue 3", "TypeScript", "Java", "WebSocket"], category: "Web 应用", githubUrl: "#", demoUrl: "#", teamMembers: ["1", "8", "6"] },
  { id: "5", title: "Vivid 设计系统", description: "面向中后台的 React 组件库，50+ 高质量组件，支持主题定制。GitHub 600+ star。", techStack: ["React", "TypeScript", "Storybook"], category: "开源项目", githubUrl: "#", demoUrl: "#", teamMembers: ["1", "3"] },
  { id: "6", title: "Mirage 图像引擎", description: "基于 C++ 与深度学习的高性能图像处理引擎，支持实时风格迁移与图像生成。", techStack: ["C++", "Python", "深度学习"], category: "AI 产品", githubUrl: "#", demoUrl: "#", teamMembers: ["2", "6"] },
];
const insertWork = db.prepare(
  `INSERT INTO works (id, title, description, tech_stack, category, github_url, demo_url, team_members, is_published)
   VALUES (@id, @title, @description, @techStack, @category, @githubUrl, @demoUrl, @teamMembers, 1)`
);
works.forEach((w) =>
  insertWork.run({
    ...w,
    techStack: JSON.stringify(w.techStack),
    teamMembers: JSON.stringify(w.teamMembers),
  })
);

// ---------- 时间线 ----------
const timeline = [
  { year: "2021", title: "工作室成立", description: "由 3 名计算机系同学发起，最初定位为前端技术小组。" },
  { year: "2022", title: "首个产品上线", description: "校园失物招领系统「FoundYou」正式上线，注册用户突破 3000。" },
  { year: "2023", title: "部门扩展", description: "新增 AI、设计、产品三个部门，团队规模达到 15 人。" },
  { year: "2024", title: "省赛金奖", description: "作品「Echo 智能客服」获得互联网+ 大学生创新创业大赛省赛金奖。" },
  { year: "2025", title: "商业化起步", description: "开始承接企业外包项目，工作室年营收突破 30 万元。" },
  { year: "2026", title: "全新官网", description: "你正在浏览的官网 v2.0 正式上线！欢迎加入我们。" },
];
const insertTimeline = db.prepare(
  `INSERT INTO timeline (year, title, description, sort_order) VALUES (@year, @title, @description, @sort_order)`
);
timeline.forEach((t, i) => insertTimeline.run({ ...t, sort_order: i }));

// ---------- FAQ ----------
const faqs = [
  { q: "我没有太多经验，可以加入吗？", a: "当然可以！我们更看重你的学习热情和成长潜力。每位新成员都会有学长学姐 1v1 带教。" },
  { q: "工作室有考核吗？", a: "我们有月度项目考核，但氛围轻松，目的是互相督促、共同成长。" },
  { q: "加入后需要投入多少时间？", a: "建议每周至少 8 小时，包括例会、项目开发和内部分享。" },
  { q: "有实习或工作内推机会吗？", a: "有！我们与多家互联网公司有合作关系，优秀成员可获得内推机会。" },
  { q: "工作室有报酬吗？", a: "商业项目会有项目分成，同时提供服务器、技术书籍等资源支持。" },
];
const insertFaq = db.prepare(
  `INSERT INTO faqs (question, answer, sort_order) VALUES (@q, @a, @sort_order)`
);
faqs.forEach((f, i) => insertFaq.run({ q: f.q, a: f.a, sort_order: i }));

// ---------- 统计数字 ----------
const stats = [
  { label: "活跃成员", value: 48, suffix: "+" },
  { label: "代码提交", value: 12500, suffix: "+" },
  { label: "获奖项目", value: 12, suffix: " 项" },
  { label: "上线产品", value: 8, suffix: " 款" },
];
const insertStat = db.prepare(
  `INSERT INTO stats (label, value, suffix, sort_order) VALUES (@label, @value, @suffix, @sort_order)`
);
stats.forEach((s, i) => insertStat.run({ ...s, sort_order: i }));

db.close();
console.log("✔ 种子数据写入完成");
console.log(`  - 部门: ${departments.length} 条`);
console.log(`  - 成员: ${members.length} 条`);
console.log(`  - 作品: ${works.length} 条`);
console.log(`  - 时间线: ${timeline.length} 条`);
console.log(`  - FAQ: ${faqs.length} 条`);
console.log(`  - 统计: ${stats.length} 条`);
console.log(`  数据库文件: data/nexus.db`);
