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
        className={`card-pop rounded-3xl border border-slate-800/70 bg-slate-950/70 px-5 py-4 shadow-lg shadow-slate-950/50 ${
          isVisible ? 'reveal-visible' : 'reveal-hidden'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* icono skeleton */}
          <div className="mt-1 h-9 w-9 rounded-2xl skeleton-block" />

          <div className="flex-1 space-y-2">
            {/* label */}
            <div className="h-2 w-20 rounded-full skeleton-block" />
            {/* value */}
            <div className="h-4 w-24 rounded-full skeleton-block" />
            {/* helper */}
            <div className="h-2 w-32 rounded-full skeleton-block" />
          </div>

          {/* trend pill */}
          <div className="mt-1 h-5 w-16 rounded-full skeleton-block" />
        </div>
      </div>
    );
  }

  // ================== ESTADO NORMAL ==================
  return (
    <div
      ref={ref}
      className={`card-pop flex items-start gap-3 rounded-3xl border border-slate-800/70 bg-slate-950/70 px-5 py-4 shadow-lg shadow-slate-950/50 ${
        isVisible ? 'reveal-visible' : 'reveal-hidden'
      }`}
    >
      {icon && (
        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-lg">
          {icon}
        </div>
      )}

      <div className="flex-1 space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="text-xl font-semibold text-slate-50">
          {value}
        </p>
        {helperText && (
          <p className="text-xs text-slate-400">
            {helperText}
          </p>
        )}
      </div>

      {trend && (
        <span className="mt-1 inline-flex rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-400">
          {trend}
        </span>
      )}
    </div>
  );
}
