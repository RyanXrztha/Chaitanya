import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/presentation/lib/cn";

/** Base look for text inputs: 48px, warm grey fill, hairline border, 8px radius. */
export const fieldClasses =
  "w-full min-w-0 rounded-control border border-line-2 bg-surface-2 px-md font-body text-[15px] text-ink placeholder:text-subtle";

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClasses, "h-12", className)} {...rest} />;
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldClasses, "min-h-[120px] resize-y py-sm leading-[1.6]", className)} {...rest} />;
}

interface FieldProps {
  label: ReactNode;
  htmlFor: string;
  required?: boolean;
  error?: string | null;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Label + control + optional error, stacked with an 8px gap. */
export function Field({ label, htmlFor, required, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-sm", className)}>
      <label htmlFor={htmlFor} className="font-body text-[13.5px] font-bold text-ink">
        {label}
        {required && (
          <span className="text-danger" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && <p className="m-0 text-[12.5px] text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="m-0 text-[12.5px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
