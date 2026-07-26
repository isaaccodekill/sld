import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "outline" | "black";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-[9999px] font-semibold tracking-[-0.01em] shadow-[0_1px_2px_rgba(23,35,45,0.06)] transition-all duration-180 ease-soft select-none active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-green text-cream hover:bg-green-2 focus-visible:outline-green",
  ghost:
    "bg-transparent text-ink hover:bg-cream-2 focus-visible:outline-ink",
  outline:
    "border border-line bg-white text-ink hover:border-green/35 hover:bg-green-3/35 hover:text-green-2 focus-visible:outline-green",
  black:
    "bg-brandblack text-cream hover:bg-ink focus-visible:outline-brandblack",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-14 px-7 text-md",
};

export const Button = forwardRef<HTMLButtonElement, CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function Button({ variant = "primary", size = "md", className, children, iconLeft, iconRight, ...rest }, ref) {
    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
        {iconLeft}
        <span>{children}</span>
        {iconRight}
      </button>
    );
  },
);

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  iconLeft,
  iconRight,
  target,
  rel,
  tabIndex,
}: CommonProps & { href: string; target?: string; rel?: string; tabIndex?: number }) {
  return (
    <Link href={href} target={target} rel={rel} tabIndex={tabIndex} className={cn(base, variants[variant], sizes[size], className)}>
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </Link>
  );
}
