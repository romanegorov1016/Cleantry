import { Building2, Calendar, Leaf } from "lucide-react";
import { Container } from "@/components/common/Container";
import { trustItems } from "@/config/trust";
import { SECTION_IDS, SECTION_SCROLL_MARGIN } from "@/lib/constants";

const iconMap = {
  calendar: Calendar,
  building: Building2,
  leaf: Leaf,
};

export function TrustSection() {
  return (
    <section
      id={SECTION_IDS.trust}
      aria-label="Коротко о сервисе"
      className={`border-y border-emerald-100/80 bg-white py-5 sm:py-6 ${SECTION_SCROLL_MARGIN}`}
    >
      <Container>
        <ul className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-10 sm:gap-y-3">
          {trustItems.map((item) => {
            const Icon = iconMap[item.icon] || Leaf;
            return (
              <li
                key={item.id}
                className="flex items-center gap-2.5 text-sm font-medium text-slate-700"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {item.label}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
