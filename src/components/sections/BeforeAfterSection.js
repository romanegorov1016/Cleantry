import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SECTION_PADDING } from "@/lib/constants";

const placeholders = [
  { label: "Кухня после уборки", room: "Кухня" },
  { label: "Комната после генеральной уборки", room: "Комната" },
  { label: "Офис после наведения порядка", room: "Офис" },
];

function BeforeAfterCard({ label, room }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <p className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-800">
        {label}
      </p>
      <div className="grid grid-cols-2 gap-px bg-slate-100">
        <div className="flex aspect-square flex-col items-center justify-center bg-slate-200/60 p-4">
          <span className="rounded-full bg-slate-400/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
            До
          </span>
          <p className="mt-3 text-center text-xs text-slate-500">{room}</p>
        </div>
        <div className="flex aspect-square flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
          <span className="rounded-full bg-emerald-600/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            После
          </span>
          <p className="mt-3 text-center text-xs text-emerald-700/80">{room}</p>
        </div>
      </div>
    </article>
  );
}

export function BeforeAfterSection() {
  return (
    <section className={`bg-white ${SECTION_PADDING}`}>
      <Container>
        <SectionHeader
          eyebrow="До и после"
          title="Результат, который видно сразу"
          description="Здесь будут реальные фото до и после уборки — чтобы вы могли оценить разницу ещё до заказа."
        />
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-slate-500">
          Здесь позже появятся реальные фото работ Cleantry.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {placeholders.map((item) => (
            <BeforeAfterCard key={item.label} {...item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
