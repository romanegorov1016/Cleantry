import { cn } from "@/lib/utils";

/**
 * Progress of required blocks for the single-page calculator.
 * Chosen over fake wizard steps and section jump-nav: it matches the current
 * soft emerald UI, stays honest about a one-page form, and shows what is left.
 *
 * @param {{
 *   completion: {
 *     blocks: Array<{ id: string, label: string, required: boolean, complete: boolean }>,
 *     progress: number,
 *     completedRequiredCount: number,
 *     requiredCount: number,
 *   },
 * }} props
 */
export function CalculatorCompletionBar({ completion }) {
  const percent = Math.round(completion.progress * 100);
  const requiredBlocks = completion.blocks.filter((block) => block.required);

  return (
    <div className="mt-10 rounded-3xl border border-emerald-100 bg-white/80 p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Заполнение расчёта
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {completion.completedRequiredCount} из {completion.requiredCount}{" "}
            обязательных блоков
          </p>
        </div>
        <p className="text-sm font-semibold tabular-nums text-emerald-700">
          {percent}%
        </p>
      </div>

      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-50"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Прогресс заполнения калькулятора"
      >
        <div
          className="h-full rounded-full bg-emerald-600 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="mt-4 flex flex-wrap gap-2">
        {requiredBlocks.map((block) => (
          <li key={block.id}>
            <span
              className={cn(
                "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                block.complete
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-500"
              )}
            >
              {block.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
