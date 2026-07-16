import {
  ArrowRight,
  Building2,
  Hammer,
  Home,
  Layers,
  Sparkles,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  home: Home,
  sparkles: Sparkles,
  layers: Layers,
  hammer: Hammer,
  house: Warehouse,
  building: Building2,
};

/**
 * @param {{
 *   item: {
 *     id: string,
 *     title: string,
 *     description: string,
 *     icon: string,
 *     kind: 'propertyType' | 'cleaningFormat',
 *     source?: 'propertyType' | 'cleaningFormat',
 *     sourceId: string,
 *   },
 *   ctaLabel: string,
 *   onSelect?: (selection: {
 *     kind: 'propertyType' | 'cleaningFormat',
 *     id: string,
 *     sourceId: string,
 *   }) => void,
 *   className?: string,
 * }} props
 */
export function ServiceOptionCard({ item, ctaLabel, onSelect, className }) {
  const Icon = iconMap[item.icon] || Home;
  const kind = item.kind ?? item.source;

  const handleSelect = () => {
    onSelect?.({
      kind,
      id: item.sourceId,
      sourceId: item.sourceId,
    });
  };

  return (
    <article className={cn("h-full", className)}>
      <button
        type="button"
        data-testid={`service-card-${item.id}`}
        data-kind={kind}
        data-source-id={item.sourceId}
        aria-label={`${item.title}. ${ctaLabel}`}
        onClick={handleSelect}
        className={cn(
          "group flex h-full w-full flex-col rounded-3xl border border-slate-100 bg-cleantry-beige/40 p-7 text-left",
          "transition-all duration-300",
          "hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-lg hover:shadow-emerald-900/5",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600",
          "active:translate-y-0 active:border-emerald-300 active:bg-white active:shadow-md",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white group-active:bg-emerald-600 group-active:text-white">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <h4 className="mt-5 text-lg font-semibold text-slate-900">
          {item.title}
        </h4>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
          {item.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition-colors group-hover:text-emerald-800 group-active:text-emerald-900">
          {ctaLabel}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-active:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </button>
    </article>
  );
}
