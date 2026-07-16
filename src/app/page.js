import { HeroSection } from "@/components/sections/HeroSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { CalculatorSection } from "@/components/sections/CalculatorSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaSection } from "@/components/sections/CtaSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <ServicesSection />
      <BeforeAfterSection />
      <ProcessSection />
      <PricingSection />
      <CalculatorSection />
      <TestimonialsSection />
      <WhyUsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
