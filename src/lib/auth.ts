import { cookies } from "next/headers";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";

// ============================================
// 用户认证模块
// - 密码: scrypt 加盐哈希(零依赖,Node 内置 crypto)
// - 会话: 随机 token 存 sessions 表 + httpOnly cookie
// ============================================

const SESSION_COOKIE = "nexus_session";
const SESSION_DAYS = 7;

interface UserRow {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  role: string;
  created_at: string;
}

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return test.length === expected.length && timingSafeEqual(test, expected);
}

function mapUser(row: UserRow): SessionUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role === "admin" ? "admin" : "user",
  };
}

/** 登录:验证密码,创建会话 token;成功返回 { token, user },失败返回 { error } */
export type LoginResult =
  | { token: string; user: SessionUser }
  | { error: string };

export function loginUser(email: string, password: string): LoginResult {
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;
  if (!row || !verifyPassword(password, row.password_hash)) {
    return { error: "账号或密码错误" };
  }
  const token = randomBytes(32).toString("hex");
  db.prepare(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, datetime('now', ?))"
  ).run(token, row.id, `+${SESSION_DAYS} days`);
  return { token, user: mapUser(row) };
}

/** 登出:删除当前会话 */
export async function logoutUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  }
}

/** 根据请求中的 cookie 读取当前登录用户(供服务端组件/layout 使用) */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = db
    .prepare(
      `SELECT u.id, u.email, u.name, u.role
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > datetime('now')`
    )
    .get(token) as SessionUser | undefined;
  return row ?? null;
}

/** 根据 token 直接查询用户(供 API 使用,可传入 request cookie) */
export function getUserByToken(token: string | undefined | null): SessionUser | null {
  if (!token) return null;
  const row = db
    .prepare(
      `SELECT u.id, u.email, u.name, u.role
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > datetime('now')`
    )
    .get(token) as SessionUser | undefined;
  return row ?? null;
}

export { SESSION_COOKIE };
