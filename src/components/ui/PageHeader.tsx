// src/components/ui/PageHeader.tsx
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  pill?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, pill, actions }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-r from-sky-500/20 via-indigo-600/20 to-emerald-500/20 px-6 py-5 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
      {/* halo suave */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.28),_transparent_60%)] opacity-60" />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          {pill && (
            <span className="inline-flex items-center rounded-full bg-slate-950/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300 ring-1 ring-slate-700/80">
              {pill}
            </span>
          )}
          <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="max-w-xl text-sm text-slate-200/85">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
