import React, { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      children,
      disabled,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="font-mono text-xs uppercase tracking-wider text-text-secondary select-none"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={`w-full appearance-none rounded-lg border bg-surface-2 px-3.5 py-2.5 pr-10 font-mono text-xs text-text-primary transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg-1 disabled:opacity-50 disabled:cursor-not-allowed ${
              error
                ? "border-danger text-danger focus-visible:ring-danger"
                : "border-border hover:border-text-tertiary focus:border-accent"
            } ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            aria-hidden
          />
        </div>
        {error && (
          <p id={errorId} className="font-mono text-[11px] text-danger" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="font-mono text-[11px] text-text-tertiary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
