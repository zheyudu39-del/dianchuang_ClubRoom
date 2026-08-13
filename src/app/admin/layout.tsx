import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  // 未登录 → 跳转登录页,登录后回跳后台
  if (!user) {
    redirect("/login?redirect=/admin");
  }
  // 非管理员 → 回首页
  if (user.role !== "admin") {
    redirect("/");
  }

  return <>{children}</>;
}
