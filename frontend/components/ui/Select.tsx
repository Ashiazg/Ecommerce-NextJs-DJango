"use client";

import type { SelectHTMLAttributes } from "react";

type Option = { value: string; label: string };

type SelectProps = {
  label?: string;
  error?: string;
  options: Option[];
} & SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({
  label,
  error,
  options,
  className = "",
  id,
  ...props
}: SelectProps) {
  const selectId = id || props.name;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-text">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full border rounded-lg px-3 py-2 text-sm transition bg-surface focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? "border-red-400" : "border-border"
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
