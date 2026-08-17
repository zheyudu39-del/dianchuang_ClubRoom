// ============================================
// 修改管理员密码(可同时改管理员邮箱)
// 用法:
//   node scripts/change-password.mjs 新密码
//   node scripts/change-password.mjs 新密码 新邮箱(可选)
// 示例:
//   node scripts/change-password.mjs myNewPass123
//   node scripts/change-password.mjs myNewPass123 admin2@dianchuang.studio
// ============================================
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { randomBytes, scryptSync } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const db = new Database(path.join(dataDir, "nexus.db"));

const newPassword = process.argv[2];
const newEmail = process.argv[3];

if (!newPassword) {
  console.log("❌ 用法: node scripts/change-password.mjs 新密码 [新邮箱]");
  console.log("   示例: node scripts/change-password.mjs myNewPass123");
  process.exit(1);
}
if (newPassword.length < 6) {
  console.log("❌ 新密码至少 6 位");
  process.exit(1);
}
if (newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
  console.log("❌ 邮箱格式不正确");
  process.exit(1);
}

// 找到管理员账号(role = admin)
const admin = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
if (!admin) {
  console.log("❌ 未找到管理员账号");
  process.exit(1);
}

// 生成新密码哈希
const salt = randomBytes(16).toString("hex");
const hash = scryptSync(newPassword, salt, 64).toString("hex");

if (newEmail) {
  db.prepare("UPDATE users SET password_hash = ?, email = ? WHERE id = ?").run(
    `${salt}:${hash}`,
    newEmail,
    admin.id
  );
  console.log(`✔ 密码已修改`);
  console.log(`  新邮箱: ${newEmail}`);
} else {
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(`${salt}:${hash}`, admin.id);
  console.log(`✔ 密码已修改(邮箱不变: ${admin.email})`);
}
console.log(`  新密码: ${newPassword}(请牢记)`);
db.close();
