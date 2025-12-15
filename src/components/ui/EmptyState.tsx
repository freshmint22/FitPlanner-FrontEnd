// src/components/ui/EmptyState.tsx
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300/70 bg-slate-50 px-4 py-6 text-center shadow-inner shadow-slate-200/40 dark:border-slate-700/70 dark:bg-slate-900/40 dark:shadow-slate-950/60">
      <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
        {title}
      </p>
      {description && (
        <p className="max-w-xs text-xs text-slate-600 dark:text-slate-400">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
