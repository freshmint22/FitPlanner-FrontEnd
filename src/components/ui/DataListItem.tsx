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
    <div className="flex flex-col gap-2 rounded-xl bg-slate-900/70 px-4 py-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-100">{title}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
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
