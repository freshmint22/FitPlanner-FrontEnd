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
    <section className="rounded-2xl bg-slate-950/90 border border-slate-800/80 shadow-fp-soft">
      <header className="flex items-center justify-between gap-3 border-b border-slate-800/80 px-6 py-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
          {description && (
            <p className="mt-1 text-xs text-slate-400">{description}</p>
          )}
        </div>
        {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
      </header>
      <div className="px-6 py-4">{children}</div>
    </section>
  );
};
