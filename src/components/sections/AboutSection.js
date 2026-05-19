import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { SECTION_PADDING } from "@/lib/constants";
import { CheckCircle2, MessageCircle, Shield } from "lucide-react";

const highlights = [
  {
    icon: Shield,
    title: "Надёжность",
    text: "Приезжаем в согласованное время и держим процесс понятным от начала до конца.",
  },
  {
    icon: MessageCircle,
    title: "Понятная коммуникация",
    text: "Уточняем детали до уборки и заранее проговариваем важные моменты.",
  },
  {
    icon: CheckCircle2,
    title: "Контроль результата",
    text: "Работаем по чек-листу и обращаем внимание на зоны, которые часто пропускают.",
  },
];

const stats = [
  { value: "12+", label: "лет опыта" },
  { value: "100%", label: "фокус на результате" },
  { value: "Быстро", label: "отвечаем на заявки" },
];

export function AboutSection() {
  return (
    <section id="about" className={`bg-cleantry-beige/50 ${SECTION_PADDING}`}>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              О Cleantry
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Мы убираем так, чтобы вам не приходилось всё перепроверять
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Cleantry — это понятная коммуникация, аккуратная работа и результат,
              на который можно рассчитывать. Вы знаете, что будет сделано, когда
              приедет команда и как принять уборку без лишнего стресса.
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
              Узнать больше
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
                  Наш подход
                </p>
                <p className="mt-3 text-2xl font-bold leading-snug text-slate-900">
                  Аккуратно. Понятно. Без ощущения, что за уборкой нужно следить.
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
