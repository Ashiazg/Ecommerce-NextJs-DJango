"use client";

import type { InputHTMLAttributes } from "react";

type InputProps = {
  label?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full border rounded-lg px-3 py-2 text-sm transition placeholder:text-text-muted bg-surface focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? "border-red-400" : "border-border"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
