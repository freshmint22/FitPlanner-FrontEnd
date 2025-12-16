// src/utils/routineStats.ts
export function formatLocalDateKey(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function extractCompletedDates(assignments: any[]): Date[] {
  const dates: Date[] = [];
  if (!Array.isArray(assignments)) return dates;
  for (const a of assignments) {
    const exercises = a.exercisesStatus || [];
    for (const ex of exercises) {
      if (ex && ex.completed && ex.completedAt) {
        const d = new Date(ex.completedAt);
        if (!Number.isNaN(d.getTime())) dates.push(d);
      }
    }
  }
  return dates;
}

export function uniqueLocalDayKeys(dates: Date[]) {
  const s = new Set<string>();
  for (const d of dates) s.add(formatLocalDateKey(d));
  return Array.from(s);
}

export function daysTrainedInMonth(dates: Date[], year?: number, month?: number) {
  const now = new Date();
  const y = typeof year === 'number' ? year : now.getFullYear();
  const m = typeof month === 'number' ? month : now.getMonth();
  const keys = uniqueLocalDayKeys(dates);
  return keys.filter((k) => {
    const [ky, km] = k.split('-');
    return Number(ky) === y && Number(km) === m + 1;
  }).length;
}

export function currentStreak(dates: Date[]) {
  const keys = new Set(uniqueLocalDayKeys(dates));
  if (keys.size === 0) return 0;
  // find latest date key
  const sorted = Array.from(keys).sort();
  let cur = sorted[sorted.length - 1];
  // parse cur to Date
  const [y, m, d] = cur.split('-').map((v) => Number(v));
  let curDate = new Date(y, m - 1, d);
  let streak = 0;
  while (true) {
    const key = formatLocalDateKey(curDate);
    if (keys.has(key)) {
      streak += 1;
      // move back one day
      curDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
