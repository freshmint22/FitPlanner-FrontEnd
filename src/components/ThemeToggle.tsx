import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ size = 18, floating = false }: { size?: number; floating?: boolean }) {
  const { theme, toggle } = useTheme();

  const isDark = theme === 'dark';
  const baseBtn = "inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold border transition-all duration-200";
  const themeBtn = "bg-white text-slate-800 border-slate-300 hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800";
  const floatingWrap = "fixed bottom-6 right-6 z-50";
  const floatingShadow = "shadow-2xl shadow-slate-900/40 dark:shadow-black/50 backdrop-blur bg-opacity-90";

  const btn = (
    <button
      onClick={toggle}
      className={[baseBtn, themeBtn, floating ? floatingShadow : "shadow"].join(" ")}
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

  if (!floating) return btn;
  return <div className={floatingWrap}>{btn}</div>;
}
