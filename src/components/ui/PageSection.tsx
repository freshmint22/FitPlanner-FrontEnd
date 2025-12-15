// src/components/ui/PageSection.tsx
import type { ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface PageSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
}

export function PageSection({
  title,
  description,
  children,
  rightSlot,
  className = '',
}: PageSectionProps) {
  const { ref, isVisible } = useScrollReveal({
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px',
  });

  return (
    <section
      ref={ref}
      className={`card-pop rounded-3xl border border-slate-200 bg-white/90 px-5 py-4 shadow-lg shadow-slate-200/60 dark:border-slate-800/60 dark:bg-slate-950/60 dark:shadow-slate-950/40 ${
        isVisible ? 'reveal-visible' : 'reveal-hidden'
      } ${className}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
        {rightSlot && (
          <div className="shrink-0 text-xs text-sky-400 hover:text-sky-300">
            {rightSlot}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {children}
      </div>
    </section>
  );
}
