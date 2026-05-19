import { processSteps } from "@/config/process";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SECTION_PADDING } from "@/lib/constants";

export function ProcessSection() {
  return (
    <section id="process" className={`bg-slate-50/80 ${SECTION_PADDING}`}>
      <Container>
        <SectionHeader
          eyebrow="Как это работает"
          title="Четыре шага до чистого пространства"
          description="Заказать уборку просто — без длинных звонков и непонятных условий."
        />
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((item, index) => (
            <li
              key={item.step}
              className="relative rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm"
            >
              {index < processSteps.length - 1 && (
                <span
                  className="absolute -right-3 top-10 hidden h-0.5 w-6 bg-emerald-200 lg:block"
                  aria-hidden="true"
                />
              )}
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                {item.step}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
