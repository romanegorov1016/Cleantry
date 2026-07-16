import { Check } from "lucide-react";
import { getPricingSectionContent } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import {
  SECTION_IDS,
  SECTION_PADDING,
  SECTION_SCROLL_MARGIN,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const { eyebrow, title, description, plans } = getPricingSectionContent();

  return (
    <section
      id={SECTION_IDS.pricing}
      className={`bg-white ${SECTION_PADDING} ${SECTION_SCROLL_MARGIN}`}
    >
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-3xl border p-8 transition-shadow",
                plan.highlighted
                  ? "border-emerald-300 bg-gradient-to-b from-emerald-50 to-white shadow-xl shadow-emerald-900/10"
                  : "border-slate-200 bg-slate-50/40 hover:shadow-md"
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-xs font-semibold text-white">
                  {plan.popularLabel || "Популярно"}
                </span>
              )}
              <h3 className="text-xl font-semibold text-slate-900">
                {plan.name}
              </h3>
              <p className="mt-2 text-3xl font-bold text-emerald-700">
                {plan.price}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {plan.description}
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-slate-600"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                href="#calculator"
                variant={plan.highlighted ? "primary" : "outline"}
                className="mt-8 w-full"
              >
                {siteConfig.ctaQuote}
              </Button>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
