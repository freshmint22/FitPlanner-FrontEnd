import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ size = 18 }: { size?: number }) {
  const { theme, toggle } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold border transition-colors
                 bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200
                 dark:border-slate-700/80 dark:bg-slate-950/60 dark:text-slate-100 dark:hover:bg-slate-900"
      aria-label={isDark ? 'Cambiar a modo día' : 'Cambiar a modo noche'}
    >
      {isDark ? (
        <span className="inline-flex items-center gap-2">
          {/* Sun icon */}
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <span>Modo Día</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          {/* Moon icon */}
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
          </svg>
          <span>Modo Noche</span>
        </span>
      )}
    </button>
  );
}
