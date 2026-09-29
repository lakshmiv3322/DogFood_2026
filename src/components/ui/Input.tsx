import React, { forwardRef, useId } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, disabled, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-mono text-xs uppercase tracking-wider text-text-secondary select-none"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={`w-full rounded-lg border bg-surface-2 px-3.5 py-2.5 font-mono text-xs text-text-primary placeholder:text-text-disabled transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg-1 disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? "border-danger text-danger focus-visible:ring-danger"
              : "border-border hover:border-text-tertiary focus:border-accent"
          } ${className}`}
          {...props}
        />
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
Input.displayName = "Input";
