import Link from "next/link";
import { cn } from "@/lib/utils";

const variantStyles = {
  primary:
    "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20",
  secondary:
    "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200",
  outline:
    "border border-slate-300 bg-white text-slate-800 hover:border-emerald-400 hover:text-emerald-700",
};

export function Button({
  children,
  href,
  variant = "primary",
  className,
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";

  const classes = cn(baseStyles, variantStyles[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
