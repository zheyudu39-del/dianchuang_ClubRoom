// ============================================
// 创建初始管理员账号(幂等)
// 运行: node scripts/create-admin.mjs
// 默认账号: admin@dianchuang.studio / admin123(首次登录后请尽快修改)
// ============================================
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { randomBytes, scryptSync } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "nexus.db"));

db.exec(`
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

const email = "admin@dianchuang.studio";
const password = "admin123";
const name = "管理员";

const existing = db.prepare("SELECT id, role FROM users WHERE email = ?").get(email);
if (existing) {
  console.log(`⚠ 管理员账号已存在: ${email} (id=${existing.id})`);
} else {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  db.prepare("INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, 'admin')").run(
    email,
    name,
    `${salt}:${hash}`
  );
  console.log("✔ 管理员账号已创建");
}

console.log("  账号: admin@dianchuang.studio");
console.log("  密码: admin123  (首次登录后请及时修改)");
db.close();
