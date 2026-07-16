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
        "grid w-full items-start rounded-2xl border text-left transition-all",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600",
        Icon
          ? "grid-cols-[2.5rem_minmax(0,1fr)_1.5rem] gap-x-3"
          : "grid-cols-[minmax(0,1fr)_1.5rem] gap-x-3",
        compact ? "p-3.5" : "p-4 sm:p-5",
        selected
          ? "border-emerald-400 bg-emerald-50/80 shadow-sm shadow-emerald-900/5"
          : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50/60",
        className
      )}
    >
      {Icon ? (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center self-start rounded-xl bg-emerald-100 text-emerald-700",
            description ? "row-span-2" : "row-span-1",
            compact ? "h-9 w-9" : "h-10 w-10"
          )}
          aria-hidden="true"
        >
          <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />
        </span>
      ) : null}

      <div className="min-w-0 overflow-hidden">
        <div className="flex items-start gap-2">
          <p
            className={cn(
              "min-w-0 flex-1 break-words font-semibold leading-snug text-slate-900 [overflow-wrap:anywhere]",
              compact ? "text-sm" : "text-base"
            )}
          >
            {label}
          </p>
          {priceLabel ? (
            <span className="shrink-0 text-sm font-medium tabular-nums text-emerald-700">
              {priceLabel}
            </span>
          ) : null}
        </div>
      </div>

      <span
        className={cn(
          "col-end-[-1] row-start-1 flex h-6 w-6 items-center justify-center justify-self-end rounded-full",
          selected ? "bg-emerald-600 text-white" : "invisible"
        )}
        aria-hidden="true"
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>

      {description ? (
        <p
          className={cn(
            "min-w-0 overflow-hidden break-words text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere]",
            Icon ? "col-start-2" : "col-start-1",
            "mt-1.5"
          )}
        >
          {description}
        </p>
      ) : null}
    </button>
  );
}
