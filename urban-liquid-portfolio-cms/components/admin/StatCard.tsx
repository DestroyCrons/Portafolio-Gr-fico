import type { ReactNode } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";

type StatCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
};

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <GlassPanel className="p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase text-white/48">{label}</p>
        <span className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/8 text-cyan">
          {icon}
        </span>
      </div>
      <p className="mt-8 font-display text-5xl uppercase text-white">{value}</p>
    </GlassPanel>
  );
}

