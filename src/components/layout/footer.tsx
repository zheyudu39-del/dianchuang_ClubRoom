import Link from "next/link";
import { Code2 as Github, Mail, MessageCircle, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-zinc-900 text-white flex items-center justify-center text-sm font-bold">
                典
              </div>
              <span className="font-bold text-lg tracking-tight text-zinc-900">
                典创<span className="text-indigo-600">.</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500 max-w-md">
              典创 是一支由大学生组成的技术工作室。我们相信代码可以改变世界，创意没有边界。
              欢迎每一位有热情的同学加入。
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@dianchuang.studio"
                className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                aria-label="Discord"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 mb-4">导航</h4>
            <ul className="space-y-2.5 text-sm text-zinc-500">
              <li><Link href="/about" className="hover:text-zinc-900 transition">关于我们</Link></li>
              <li><Link href="/members" className="hover:text-zinc-900 transition">团队成员</Link></li>
              <li><Link href="/works" className="hover:text-zinc-900 transition">作品展示</Link></li>
              <li><Link href="/join" className="hover:text-zinc-900 transition">加入我们</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-900 mb-4">资源</h4>
            <ul className="space-y-2.5 text-sm text-zinc-500">
              <li><Link href="/contact" className="hover:text-zinc-900 transition">联系我们</Link></li>
              <li><a href="#" className="hover:text-zinc-900 transition">技术博客</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition">内推合作</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition">隐私政策</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p className="flex items-center gap-3">
            © 2026 典创 Studio. All rights reserved.
            <span className="text-zinc-300">·</span>
            <Link href="/admin" className="hover:text-zinc-700 transition">管理后台</Link>
          </p>
          <p className="flex items-center gap-1.5">
            Built with <Sparkles className="w-3 h-3 text-indigo-600" /> by 典创 Team
          </p>
        </div>
      </div>
    </footer>
  );
}
