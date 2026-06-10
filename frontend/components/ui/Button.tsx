"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<Variant, string> = {
  primary: "bg-primary text-white hover:brightness-110 active:brightness-90",
  secondary: "bg-surface-alt text-text hover:bg-border active:brightness-95",
  danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
  ghost: "bg-transparent text-text-muted hover:bg-surface-alt active:bg-border",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:pointer-events-none";

export default function Button({
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
