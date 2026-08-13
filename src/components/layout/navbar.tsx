"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/lib/auth";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于" },
  { href: "/members", label: "团队" },
  { href: "/works", label: "作品" },
  { href: "/join", label: "纳新" },
  { href: "/contact", label: "联系" },
];

export function Navbar({ user }: { user: SessionUser | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* 忽略网络错误 */
    }
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/85 backdrop-blur-md border-b border-zinc-200/80 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-md bg-zinc-900 text-white flex items-center justify-center text-sm font-bold transition-colors group-hover:bg-indigo-600">
                典
              </div>
              <span className="font-bold text-lg tracking-tight text-zinc-900">
                典创<span className="text-indigo-600">.</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative px-4 py-2 text-sm transition-colors",
                        active
                          ? "text-zinc-900 font-medium"
                          : "text-zinc-500 hover:text-zinc-900"
                      )}
                    >
                      {item.label}
                      {active && (
                        <motion.span
                          layoutId="navbar-indicator"
                          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-indigo-600"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* 右侧:登录态 */}
            <div className="hidden md:flex items-center gap-2.5">
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className={cn(
                        "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm transition-colors",
                        pathname.startsWith("/admin")
                          ? "bg-zinc-900 text-white"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                      )}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      管理后台
                    </Link>
                  )}
                  <span className="max-w-[120px] truncate text-sm font-medium text-zinc-900">
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    disabled={loggingOut}
                    className="inline-flex h-9 items-center gap-1 rounded-full border border-zinc-200 px-3.5 text-sm text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition disabled:opacity-60"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {loggingOut ? "退出中" : "退出"}
                  </button>
                </>
              ) : (
                <Link
                  href="/join"
                  className="inline-flex h-9 items-center rounded-full bg-indigo-600 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  立即加入
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-zinc-600 hover:text-zinc-900"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-16 inset-x-4 z-40 md:hidden"
          >
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl shadow-zinc-900/5">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block px-4 py-2.5 rounded-lg text-sm transition-colors",
                          active
                            ? "bg-zinc-100 text-zinc-900 font-medium"
                            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* 移动端登录态 */}
              {user ? (
                <div className="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
                  <div className="px-4 py-1 text-sm font-medium text-zinc-900">{user.name}</div>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50"
                    >
                      管理后台
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="block w-full text-left px-4 py-2.5 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50"
                  >
                    退出登录
                  </button>
                </div>
              ) : (
                <Link
                  href="/join"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 block text-center px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700"
                >
                  立即加入
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
