import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  accentColor?: "green" | "blue" | "purple" | "pink";
}

const accentClasses: Record<
  NonNullable<StatCardProps["accentColor"]>,
  string
> = {
  green: "from-emerald-500/10 to-emerald-400/5 text-emerald-300",
  blue: "from-sky-500/10 to-sky-400/5 text-sky-300",
  purple: "from-violet-500/10 to-violet-400/5 text-violet-300",
  pink: "from-pink-500/10 to-pink-400/5 text-pink-300",
};

export const StatCard = ({
  label,
  value,
  subtitle,
  icon,
  accentColor = "blue",
}: StatCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-slate-800/70 shadow-fp-soft">
      <div
        className={`absolute inset-0 bg-gradient-to-tr ${
          accentClasses[accentColor]
        } opacity-40`}
      />
      <div className="relative flex items-start justify-between gap-3 px-6 py-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-300 text-xl dark:bg-slate-900/80 dark:ring-slate-700/70">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
