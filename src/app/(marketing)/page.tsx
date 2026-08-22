import { CtaSection } from "@/components/marketing/cta-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { Hero } from "@/components/marketing/hero";
import { PricingSection } from "@/components/marketing/pricing-section";
import { StatsSection } from "@/components/marketing/stats-section";

export default function MarketingPage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
    </>
  );
}
