import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CalculatorOptionCard({
  selected,
  onSelect,
  label,
  description,
  priceLabel,
  icon: Icon,
  compact = false,
  className,
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "relative w-full rounded-2xl border text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600",
        compact ? "p-3.5" : "p-4 sm:p-5",
        selected
          ? "border-emerald-400 bg-emerald-50/80 shadow-sm shadow-emerald-900/5"
          : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50/60",
        className
      )}
    >
      {selected && (
        <span
          className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white"
          aria-hidden="true"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      )}

      <div className={cn("flex gap-3", compact && "items-center")}>
        {Icon && (
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700",
              compact ? "h-9 w-9" : "h-10 w-10"
            )}
            aria-hidden="true"
          >
            <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />
          </span>
        )}

        <div className="min-w-0 flex-1 pr-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p
              className={cn(
                "font-semibold text-slate-900",
                compact ? "text-sm" : "text-base"
              )}
            >
              {label}
            </p>
            {priceLabel && (
              <span className="shrink-0 text-sm font-medium text-emerald-700">
                {priceLabel}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
