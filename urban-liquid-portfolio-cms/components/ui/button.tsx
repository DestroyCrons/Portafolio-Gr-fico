import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "solid" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
};

export function Button({
  className,
  variant = "solid",
  icon,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-[8px] px-4 text-sm font-semibold uppercase transition",
        variant === "solid" &&
          "border border-acid/45 bg-acid text-black shadow-glow hover:bg-cyan",
        variant === "ghost" &&
          "border border-white/12 bg-white/8 text-white hover:border-cyan/55 hover:text-cyan",
        variant === "danger" &&
          "border border-signal/35 bg-signal/12 text-signal hover:bg-signal hover:text-white",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

