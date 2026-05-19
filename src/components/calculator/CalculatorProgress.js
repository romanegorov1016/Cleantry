import { cn } from "@/lib/utils";

export function CalculatorProgress({ steps, currentStep }) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <ol className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = index < currentIndex;

        return (
          <li key={step.id} className="flex items-center gap-2 sm:gap-3">
            <div
              className={cn(
                "flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 transition-colors",
                isActive && "bg-emerald-50",
                isCompleted && !isActive && "opacity-80"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/25"
                    : isCompleted
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                )}
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  isActive ? "text-emerald-800" : "text-slate-600"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span
                className="mx-1 hidden h-px w-6 bg-slate-200 sm:block"
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
