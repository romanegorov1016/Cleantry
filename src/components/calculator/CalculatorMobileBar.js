import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";

/**
 * Compact sticky bottom summary for mobile / tablet.
 *
 * @param {{
 *   totalLabel: string,
 *   ctaLabel: string,
 *   ctaDisabled?: boolean,
 *   onCta: () => void,
 *   className?: string,
 * }} props
 */
export function CalculatorMobileBar({
  totalLabel,
  ctaLabel,
  ctaDisabled = false,
  onCta,
  className,
}) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-emerald-100 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(6,78,59,0.08)] backdrop-blur lg:hidden",
        className
      )}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Ориентировочно
          </p>
          <p className="truncate text-lg font-bold tabular-nums text-emerald-700">
            {totalLabel}
          </p>
        </div>
        <Button
          type="button"
          onClick={onCta}
          disabled={ctaDisabled}
          className="shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
