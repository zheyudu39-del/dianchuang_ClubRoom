"use client";

import { useEffect } from "react";

/**
 * 全站访问埋点(客户端)
 * 每次页面加载上报一次 PV;用 localStorage 匿名 ID 区分独立访客(UV)。
 */
export function VisitTracker() {
  useEffect(() => {
    const visitorId: string =
      localStorage.getItem("nx_visitor_id") ??
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`);
    localStorage.setItem("nx_visitor_id", visitorId);
    const path = window.location.pathname;
    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, visitorId }),
    }).catch(() => {
      /* 静默失败，不影响浏览体验 */
    });
  }, []);

  return null;
}
