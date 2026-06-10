import type { ReactNode } from "react";

type Variant = "low" | "medium" | "high" | "success" | "info" | "default";

// Needed for orders page Badge variant type
export type BadgeVariant = Variant;

type BadgeProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

const variantStyles: Record<Variant, string> = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
  success: "bg-green-100 text-green-700",
  info: "bg-blue-100 text-blue-700",
  default: "bg-gray-100 text-gray-600",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
