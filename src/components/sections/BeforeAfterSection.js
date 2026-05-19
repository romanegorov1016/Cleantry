import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SECTION_PADDING } from "@/lib/constants";

const placeholders = [
  { label: "Kitchen refresh", room: "Kitchen" },
  { label: "Living room reset", room: "Living room" },
  { label: "Office tidy-up", room: "Office" },
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
            Before
          </span>
          <p className="mt-3 text-center text-xs text-slate-500">{room}</p>
        </div>
        <div className="flex aspect-square flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
          <span className="rounded-full bg-emerald-600/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            After
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
          eyebrow="Before & After"
          title="See the difference we make"
          description="Real transformations from kitchens, living rooms, and offices we have refreshed for our clients."
        />
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-slate-500">
          Placeholder previews below — replace with real before/after photos in{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
            public/images/before-after/
          </code>{" "}
          when ready.
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
