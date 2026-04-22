import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, hint, error, className, id, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-2">{label}</span>
      <input
        id={inputId}
        ref={ref}
        className={cn(
          "w-full rounded-md border border-line bg-cream px-3.5 py-2.5 text-base text-ink placeholder:text-ink-3 focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20",
          error && "border-puzzle-red",
          className,
        )}
        {...rest}
      />
      {hint && !error && <span className="mt-1 block text-xs text-ink-3">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-puzzle-red">{error}</span>}
    </label>
  );
});
