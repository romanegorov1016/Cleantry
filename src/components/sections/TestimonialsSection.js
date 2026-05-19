import { Star } from "lucide-react";
import { testimonials } from "@/config/testimonials";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SECTION_PADDING } from "@/lib/constants";

export function TestimonialsSection() {
  return (
    <section className={`bg-cleantry-mint/40 ${SECTION_PADDING}`}>
      <Container>
        <SectionHeader
          eyebrow="Отзывы"
          title="Клиенты возвращаются, когда результат предсказуем"
          description="Нам важно, чтобы уборка не превращалась в лотерею — поэтому многие заказывают снова, когда нужна стабильная чистота."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote
              key={item.id}
              className="flex flex-col rounded-3xl border border-emerald-100/80 bg-white p-7 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-0.5 text-amber-400" aria-label={`Оценка: ${item.rating} из 5`}>
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  {item.serviceType}
                </span>
              </div>
              <p className="mt-5 flex-1 text-sm leading-relaxed text-slate-600">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-6 border-t border-slate-100 pt-5">
                <cite className="not-italic font-semibold text-slate-900">
                  {item.name}
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
