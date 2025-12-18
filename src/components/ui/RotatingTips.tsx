import { useEffect, useRef, useState } from 'react';

interface RotatingTipsProps {
  tips: string[];
  intervalMs?: number;
}

export default function RotatingTips({ tips, intervalMs = 3500 }: RotatingTipsProps) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!tips || tips.length === 0) return;
    intervalRef.current = window.setInterval(() => setIndex((i) => (i + 1) % tips.length), intervalMs);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [tips, intervalMs]);

  const pause = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resume = () => {
    if (!intervalRef.current) {
      intervalRef.current = window.setInterval(() => setIndex((i) => (i + 1) % tips.length), intervalMs);
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white px-5 pt-4 pb-6 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 h-32 shadow-sm"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* slider: horizontal layout */}
      <div className="h-full w-full">
        <div
          className="h-full flex transition-transform duration-600 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)`, width: `${tips.length * 100}%` }}
        >
          {tips.map((t, i) => (
            <div key={i} className="min-w-full flex items-start px-2">
              <div className="w-full rounded-xl border border-slate-100 bg-gradient-to-r from-white to-slate-50 px-4 py-4 text-sm text-slate-700 dark:bg-slate-900/70 dark:border-slate-800 flex items-start gap-3">
                <div className="text-xl mt-0.5">💡</div>
                <div className="text-sm leading-snug text-slate-700 dark:text-slate-300 break-words">{t}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* indicators removed per design request; tips rotate automatically and are pause-on-hover */}
    </div>
  );
}
