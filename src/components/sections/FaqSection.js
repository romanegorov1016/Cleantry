import { HelpCircle } from "lucide-react";
import { faqItems } from "@/config/faq";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SECTION_PADDING } from "@/lib/constants";

export function FaqSection() {
  return (
    <section id="faq" className={`bg-cleantry-beige/40 ${SECTION_PADDING}`}>
      <Container>
        <SectionHeader
          eyebrow="Вопросы"
          title="Что важно знать перед заказом"
          description="Коротко о том, как мы работаем — чтобы вам было спокойнее оставить заявку."
        />
        <dl className="mx-auto mt-14 max-w-3xl space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm"
            >
              <dt className="flex items-start gap-3 font-semibold text-slate-900">
                <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                {item.question}
              </dt>
              <dd className="mt-3 pl-8 text-sm leading-relaxed text-slate-600">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
