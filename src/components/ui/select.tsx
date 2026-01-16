"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LuChevronDown as ChevronDown } from "react-icons/lu";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const selectId = id ?? React.useId();
    const errorId = error ? `${selectId}-error` : undefined;
    const describedBy = [props["aria-describedby"], errorId]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground" htmlFor={selectId}>
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              "flex h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            id={selectId}
            aria-invalid={error ? true : props["aria-invalid"]}
            aria-describedby={describedBy}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        {error && (
          <p className="text-xs text-destructive" id={errorId}>
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };

