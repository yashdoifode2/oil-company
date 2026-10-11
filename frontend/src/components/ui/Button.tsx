import Link from "next/link";
import type { ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  target?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3 text-lg",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  target,
  ...rest
}: Props) {
  const classes = clsx(
    "inline-flex items-center justify-center font-semibold rounded transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2",
    SIZES[size],
    variant === "primary" && "text-white",
    variant === "outline" && "border-2 bg-transparent",
    variant === "ghost" && "bg-transparent",
    className
  );

  const style =
    variant === "primary"
      ? { background: "var(--color-button)", color: "var(--color-button-text)" }
      : variant === "outline"
      ? { borderColor: "var(--color-button)", color: "var(--color-button)" }
      : { color: "var(--color-button)" };

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <Link href={href} className={classes} style={style} target={target ?? (isExternal ? "_blank" : undefined)} rel={isExternal ? "noopener noreferrer" : undefined}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} style={style} {...rest}>
      {children}
    </button>
  );
}