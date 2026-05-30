"use client";

import { cn } from "@/lib/utils";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
};

export function Switch({ checked, onCheckedChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "focus-ring inline-flex h-7 w-12 items-center rounded-full border border-white/14 p-1 transition",
        checked ? "bg-acid/80" : "bg-white/10"
      )}
    >
      <span
        className={cn(
          "h-5 w-5 rounded-full bg-white shadow-lg transition",
          checked ? "translate-x-5 bg-black" : "translate-x-0"
        )}
      />
    </button>
  );
}

