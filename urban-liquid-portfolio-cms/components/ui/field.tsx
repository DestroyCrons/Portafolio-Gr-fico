import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-2 block text-xs font-semibold uppercase text-white/54", className)}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "focus-ring h-11 w-full rounded-[8px] border border-white/12 bg-black/28 px-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-cyan/60",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "focus-ring min-h-32 w-full resize-y rounded-[8px] border border-white/12 bg-black/28 px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/28 focus:border-cyan/60",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "focus-ring h-11 w-full rounded-[8px] border border-white/12 bg-black/28 px-3 text-sm text-white outline-none transition focus:border-cyan/60",
        className
      )}
      {...props}
    />
  );
}

