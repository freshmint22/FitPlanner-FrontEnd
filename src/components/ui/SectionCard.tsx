import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  rightContent?: ReactNode;
  children: ReactNode;
}

export const SectionCard = ({
  title,
  description,
  rightContent,
  children,
}: SectionCardProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-fp-soft dark:border-slate-800/80 dark:bg-slate-950/90">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 px-6 py-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          {description && (
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{description}</p>
          )}
        </div>
        {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
      </header>
      <div className="px-6 py-4">{children}</div>
    </section>
  );
};
