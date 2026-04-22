import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  hint?: string;
  className?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { label, hint, className, id, rows = 4, ...rest },
  ref,
) {
  const auto = useId();
  const areaId = id ?? auto;
  return (
    <label htmlFor={areaId} className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-2">{label}</span>
      <textarea
        id={areaId}
        ref={ref}
        rows={rows}
        className={cn(
          "w-full rounded-md border border-line bg-cream px-3.5 py-3 text-base text-ink placeholder:text-ink-3 focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20",
          className,
        )}
        {...rest}
      />
      {hint && <span className="mt-1 block text-xs text-ink-3">{hint}</span>}
    </label>
  );
});
