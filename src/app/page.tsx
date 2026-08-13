import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { DepartmentsSection } from "@/components/home/departments-section";
import { CtaSection } from "@/components/home/cta-section";
import { getMockStats, getMockDepartments } from "@/lib/mock-api";

export default function Home() {
  const stats = getMockStats();
  const departments = getMockDepartments();

  return (
    <>
      <HeroSection />
      <StatsSection stats={stats} />
      <DepartmentsSection departments={departments} />
      <CtaSection />
    </>
  );
}
