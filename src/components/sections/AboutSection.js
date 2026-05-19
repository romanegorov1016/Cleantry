import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { SECTION_PADDING } from "@/lib/constants";
import { CheckCircle2, MessageCircle, Shield } from "lucide-react";

const highlights = [
  {
    icon: Shield,
    title: "Reliability",
    text: "On-time arrivals and consistent results you can count on, visit after visit.",
  },
  {
    icon: MessageCircle,
    title: "Clear communication",
    text: "We confirm details upfront and keep you informed before, during, and after every clean.",
  },
  {
    icon: CheckCircle2,
    title: "Consistent quality",
    text: "Structured checklists and quality reviews ensure every space meets our standards.",
  },
];

const stats = [
  { value: "5+", label: "Years experience" },
  { value: "100%", label: "Quality focus" },
  { value: "Fast", label: "Response time" },
];

export function AboutSection() {
  return (
    <section id="about" className={`bg-cleantry-beige/50 ${SECTION_PADDING}`}>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              About Cleantry
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              A cleaning team that treats your space like their own
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              We are local professionals dedicated to making homes and
              businesses feel fresh, organized, and welcoming. Every visit is
              planned with care — because your comfort matters.
            </p>
            <ul className="mt-8 space-y-5">
              {highlights.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <Button href="#contact" className="mt-8">
              Get to know us
            </Button>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-4 rounded-3xl bg-emerald-100/40 blur-xl"
              aria-hidden="true"
            />
            <div className="relative rounded-3xl border border-emerald-100/80 bg-white p-8 shadow-lg shadow-emerald-900/5">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-emerald-50 via-cleantry-mint to-teal-50 p-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                  Our promise
                </p>
                <p className="mt-3 text-2xl font-bold leading-snug text-slate-900">
                  Careful team. Clear process. Spaces you love coming home to.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-emerald-100 bg-cleantry-mint/30 px-3 py-4 text-center"
                  >
                    <p className="text-xl font-bold text-emerald-700">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-600">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
