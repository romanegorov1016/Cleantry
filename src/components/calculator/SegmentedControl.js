import { cn } from "@/lib/utils";

export function SegmentedControl({
  options,
  value,
  onChange,
  ariaLabel,
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-2"
    >
      {options.map((option) => {
        const optionValue = typeof option === "string" ? option : option.id;
        const optionLabel =
          typeof option === "string" ? option : option.label;
        const isSelected = value === optionValue;

        return (
          <button
            key={optionValue}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(optionValue)}
            className={cn(
              "rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600",
              isSelected
                ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-slate-50"
            )}
          >
            {optionLabel}
          </button>
        );
      })}
    </div>
  );
}
