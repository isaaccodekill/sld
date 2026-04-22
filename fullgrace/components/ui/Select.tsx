import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

type Option = { label: string; value: string };

type Props = {
  label: string;
  options: Option[];
  hint?: string;
  className?: string;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children">;

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, options, hint, className, id, ...rest },
  ref,
) {
  const auto = useId();
  const selectId = id ?? auto;
  return (
    <label htmlFor={selectId} className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-2">{label}</span>
      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "w-full appearance-none rounded-md border border-line bg-cream px-3.5 py-2.5 pr-10 text-base text-ink focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20",
            className,
          )}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3">
          ▾
        </span>
      </div>
      {hint && <span className="mt-1 block text-xs text-ink-3">{hint}</span>}
    </label>
  );
});
