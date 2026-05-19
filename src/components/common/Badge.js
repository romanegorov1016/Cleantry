import { cn } from "@/lib/utils";

export function Badge({ children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200/60",
        className
      )}
    >
      {children}
    </span>
  );
}
