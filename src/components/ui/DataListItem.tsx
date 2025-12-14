// src/components/ui/DataListItem.tsx
import type { ReactNode } from "react";

interface DataListItemProps {
  title: string;
  subtitle?: string;
  metaLeft?: string;
  metaRight?: string;
  rightContent?: ReactNode;
}

export const DataListItem = ({
  title,
  subtitle,
  metaLeft,
  metaRight,
  rightContent,
}: DataListItemProps) => {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between dark:bg-slate-900/70 dark:ring-slate-800/70">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{subtitle}</p>
        )}
        {(metaLeft || metaRight) && (
          <p className="mt-1 text-xs text-slate-500 flex flex-wrap gap-3">
            {metaLeft && <span>{metaLeft}</span>}
            {metaRight && (
              <span className="text-slate-400">{metaRight}</span>
            )}
          </p>
        )}
      </div>
      {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
    </div>
  );
};
