import React, { forwardRef, useId } from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, disabled, className = "", id, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="font-mono text-xs uppercase tracking-wider text-text-secondary select-none"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={`w-full rounded-lg border bg-surface-2 p-3 font-mono text-xs text-text-primary placeholder:text-text-disabled transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg-1 disabled:opacity-50 disabled:cursor-not-allowed ${
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
Textarea.displayName = "Textarea";
