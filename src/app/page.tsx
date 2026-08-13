import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { DepartmentsSection } from "@/components/home/departments-section";
import { CtaSection } from "@/components/home/cta-section";
import { getStats, getDepartments } from "@/lib/db";

export default function Home() {
  const stats = getStats();
  const departments = getDepartments();

  return (
    <>
      <HeroSection />
      <StatsSection stats={stats} />
      <DepartmentsSection departments={departments} />
      <CtaSection />
    </>
  );
}
