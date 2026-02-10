"use client";

import { clsx } from "clsx";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterButtonsProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
}

export function FilterButtons({
  options,
  value,
  onChange,
  allLabel,
}: FilterButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("")}
        className={clsx(
          "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
          value === ""
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        {allLabel}
      </button>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={clsx(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
            value === option.value
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
