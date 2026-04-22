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
  "inline-flex items-center justify-center gap-2 rounded-[9999px] font-medium tracking-[-0.01em] transition-all duration-180 ease-soft select-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-green text-cream hover:bg-green-2 focus-visible:outline-green",
  ghost:
    "bg-transparent text-ink hover:bg-cream-2 focus-visible:outline-ink",
  outline:
    "bg-transparent text-ink border border-ink/15 hover:border-ink/40 hover:bg-cream-2",
  black:
    "bg-brandblack text-cream hover:bg-ink focus-visible:outline-brandblack",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
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
}: CommonProps & { href: string; target?: string; rel?: string }) {
  return (
    <Link href={href} target={target} rel={rel} className={cn(base, variants[variant], sizes[size], className)}>
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </Link>
  );
}
