// src/components/ui/KpiCard.tsx
import type { ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface KpiCardProps {
  label: string;
  value: string | number;
  helperText?: string;
  trend?: string; // ej: "+12% vs mes anterior"
  icon?: ReactNode;
  /** mostrar skeleton en vez de datos reales */
  isLoading?: boolean;
}

export function KpiCard({
  label,
  value,
  helperText,
  trend,
  icon,
  isLoading = false,
}: KpiCardProps) {
  const { ref, isVisible } = useScrollReveal({
    threshold: 0.25,
    rootMargin: '0px 0px -10% 0px',
  });

  // ================== ESTADO SKELETON ==================
  if (isLoading) {
    return (
      <div
        ref={ref}
        className={`card-pop rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm dark:border-slate-800/60 dark:bg-slate-950/70 h-28 ${
          isVisible ? 'reveal-visible' : 'reveal-hidden'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg skeleton-block" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-28 rounded-full skeleton-block" />
            <div className="h-4 w-20 rounded-full skeleton-block" />
          </div>
          <div className="h-5 w-14 rounded-full skeleton-block" />
        </div>
      </div>
    );
  }

  // ================== ESTADO NORMAL ==================
  return (
    <div
      ref={ref}
      className={`card-pop relative flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm dark:border-slate-800/60 dark:bg-slate-950/70 h-28 transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md ${
        isVisible ? 'reveal-visible' : 'reveal-hidden'
      }`}
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-r-full bg-gradient-to-b from-sky-400 to-emerald-300" />

      <div className="flex items-center gap-3 pl-3">
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-emerald-400 text-white text-lg">
            {icon}
          </div>
        )}

        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-1 text-lg md:text-xl font-extrabold text-slate-900 dark:text-slate-50">{value}</p>
          {helperText && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
        </div>

        {trend && (
          <span className="mt-1 inline-flex rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-400">
            {trend}
          </span>
        )}
      </div>

      {/* subtle separator to visually group KPI content */}
      <div className="mt-2 border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-slate-800/60">&nbsp;</div>
    </div>
  );
}
