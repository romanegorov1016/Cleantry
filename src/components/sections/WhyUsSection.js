import {
  Users,
  Receipt,
  Calendar,
  Leaf,
  BadgeCheck,
  Building2,
} from "lucide-react";
import { whyUsBenefits } from "@/config/whyUs";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SECTION_PADDING } from "@/lib/constants";

const iconMap = {
  users: Users,
  receipt: Receipt,
  calendar: Calendar,
  leaf: Leaf,
  check: BadgeCheck,
  building: Building2,
};

export function WhyUsSection() {
  return (
    <section className={`bg-white ${SECTION_PADDING}`}>
      <Container>
        <SectionHeader
          eyebrow="Почему Cleantry"
          title="Не просто уборка, а спокойствие за результат"
          description="Сервис построен вокруг доверия, ясности и стабильного качества — чтобы вы могли делигировать уборку и не думать о ней снова."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyUsBenefits.map((benefit) => {
            const Icon = iconMap[benefit.icon] || BadgeCheck;
            return (
              <article
                key={benefit.id}
                className="rounded-3xl border border-slate-100 bg-slate-50/50 p-7 transition-shadow hover:border-emerald-100 hover:shadow-md hover:shadow-emerald-900/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
