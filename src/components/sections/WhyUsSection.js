import {
  BadgeCheck,
  ClipboardList,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { MediaSlot } from "@/components/common/MediaSlot";
import { whyUsBenefits, whyUsCopy, whyUsMedia } from "@/config/whyUs";
import {
  SECTION_IDS,
  SECTION_PADDING,
  SECTION_SCROLL_MARGIN,
} from "@/lib/constants";

const iconMap = {
  clipboard: ClipboardList,
  sparkles: Sparkles,
  list: ListChecks,
  check: BadgeCheck,
};

/**
 * Unified «Почему Cleantry» section (merged About + former Why Us).
 *
 * @param {{
 *   media?: typeof whyUsMedia,
 *   mediaSlot?: import('react').ReactNode,
 * }} [props]
 */
export function WhyUsSection({ media = whyUsMedia, mediaSlot } = {}) {
  return (
    <section
      id={SECTION_IDS.why}
      className={`bg-cleantry-beige/50 ${SECTION_PADDING} ${SECTION_SCROLL_MARGIN}`}
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              {whyUsCopy.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {whyUsCopy.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              {whyUsCopy.description}
            </p>
            <ul className="mt-8 space-y-5">
              {whyUsBenefits.map((benefit) => {
                const Icon = iconMap[benefit.icon] || BadgeCheck;
                return (
                  <li key={benefit.id} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {benefit.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {benefit.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Button href={whyUsCopy.ctaHref} className="mt-8">
              {whyUsCopy.ctaLabel}
            </Button>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-4 rounded-3xl bg-emerald-100/40 blur-xl"
              aria-hidden="true"
            />
            <div className="relative rounded-3xl border border-emerald-100/80 bg-white p-8 shadow-lg shadow-emerald-900/5">
              <MediaSlot media={media}>{mediaSlot}</MediaSlot>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
