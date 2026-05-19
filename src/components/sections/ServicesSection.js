import Link from "next/link";
import {
  Home,
  Sparkles,
  Building2,
  Leaf,
  Hammer,
  ArrowRight,
  Warehouse,
} from "lucide-react";
import { services } from "@/config/services";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SECTION_PADDING } from "@/lib/constants";

const iconMap = {
  home: Home,
  sparkles: Sparkles,
  hammer: Hammer,
  house: Warehouse,
  building: Building2,
  leaf: Leaf,
};

export function ServicesSection() {
  return (
    <section id="services" className={`bg-white ${SECTION_PADDING}`}>
      <Container>
        <SectionHeader
          eyebrow="Наши услуги"
          title="Уборка под вашу задачу"
          description="Разовая, регулярная, генеральная, офисная, эко-уборка или уборка после ремонта — выберите формат, который подходит именно вам."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Home;
            return (
              <article
                key={service.id}
                className="group flex flex-col rounded-3xl border border-slate-100 bg-cleantry-beige/40 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-lg hover:shadow-emerald-900/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition-colors group-hover:text-emerald-800"
                >
                  Подробнее
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
