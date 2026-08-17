import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { DepartmentsSection } from "@/components/home/departments-section";
import { CtaSection } from "@/components/home/cta-section";
import { getMockStats, getMockDepartments } from "@/lib/mock-api";

export default function Home() {
  const stats = getMockStats();
  const departments = getMockDepartments();

  return (
    <div className="relative min-h-screen">
      {/* 全屏固定背景(GIF + 遮罩) */}
      <div className="fixed inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bg-hero.gif" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <StatsSection stats={stats} />
        <DepartmentsSection departments={departments} />
        <CtaSection />
      </div>
    </div>
  );
}
