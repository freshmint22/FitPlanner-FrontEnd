import React, { useMemo } from 'react';

interface ClassItem {
  _id?: string;
  name: string;
  scheduleISO?: string | null;
  hour?: string | null;
  room?: string | null;
  trainer?: string | null;
  capacity?: number;
  reservations?: number;
}

interface Props {
  classes: ClassItem[];
  year: number;
  month: number; // 0-indexed
  onDayClick?: (date: Date, items: ClassItem[]) => void;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function CalendarGrid({ classes, year, month, onDayClick }: Props) {
  // Build map dateString -> items (dateString = yyyy-mm-dd)
  const itemsByDate = useMemo(() => {
    const map = new Map<string, ClassItem[]>();
    // For each class, if it has scheduleISO use weekday to place in each date of the month matching weekday
    for (const cls of classes) {
      if (!cls.scheduleISO) continue;
      const clsDate = new Date(cls.scheduleISO);
      const wd = clsDate.getDay();
      const total = daysInMonth(year, month);
      for (let d = 1; d <= total; d++) {
        const date = new Date(year, month, d);
        if (date.getDay() === wd) {
          const key = date.toISOString().slice(0, 10);
          const arr = map.get(key) || [];
          arr.push(cls);
          map.set(key, arr);
        }
      }
    }
    return map;
  }, [classes, year, month]);

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = daysInMonth(year, month);
  const weeks: Array<Array<number | null>> = [];
  let week: Array<number | null> = new Array(7).fill(null);
  let dayCounter = 1;
  // fill first week
  for (let i = 0; i < 7; i++) {
    if (i < firstDay) week[i] = null;
    else { week[i] = dayCounter++; }
  }
  weeks.push(week);
  while (dayCounter <= totalDays) {
    week = new Array(7).fill(null);
    for (let i = 0; i < 7 && dayCounter <= totalDays; i++) {
      week[i] = dayCounter++;
    }
    weeks.push(week);
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-2 text-xs text-slate-500 mb-2">
        {['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map((d) => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>

      <div className="grid grid-rows-auto gap-2">
        {weeks.map((w, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-2">
            {w.map((d, di) => {
              const dateKey = d ? new Date(year, month, d).toISOString().slice(0,10) : null;
              const items = dateKey ? (itemsByDate.get(dateKey) || []) : [];
              return (
                <div key={di} className="min-h-[90px] rounded-lg border border-slate-200 bg-white p-2 text-sm dark:border-slate-800 dark:bg-slate-950">
                  {d ? (
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-100">{d}</div>
                        <div className="text-[11px] text-slate-400">{items.length > 0 ? `${items.length}` : ''}</div>
                      </div>
                      <div className="mt-1 space-y-1">
                        {items.slice(0,3).map((it) => (
                          <div key={it._id} className="rounded-md bg-slate-50 p-1 text-xs text-slate-700 dark:bg-slate-800" onClick={() => onDayClick && onDayClick(new Date(year, month, d), items)}>
                            <div className="font-medium">{it.name}</div>
                            <div className="text-[11px] text-slate-500">{it.hour || ''} · {it.room || ''}</div>
                          </div>
                        ))}
                        {items.length > 3 && <div className="text-[11px] text-slate-400">+{items.length - 3} más</div>}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
