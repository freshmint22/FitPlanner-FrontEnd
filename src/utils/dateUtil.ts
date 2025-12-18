// src/utils/dateUtil.ts
export function parseHourStringToDate(hourStr: string): Date | null {
  if (!hourStr || typeof hourStr !== 'string') return null;
  // normalize
  const s = hourStr.trim().toLowerCase();
  // try formats like "6:00 p.m.", "6:00 pm", "18:30"
  const ampmMatch = s.match(/(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m?\.?/i);
  const twentyFourMatch = s.match(/^(\d{1,2}):(\d{2})$/);

  const now = new Date();

  let hour = 0;
  let minute = 0;
  if (ampmMatch) {
    hour = Number(ampmMatch[1]);
    minute = ampmMatch[2] ? Number(ampmMatch[2]) : 0;
    const ampm = ampmMatch[3].toLowerCase();
    if (ampm === 'p' && hour < 12) hour += 12;
    if (ampm === 'a' && hour === 12) hour = 0;
  } else if (twentyFourMatch) {
    hour = Number(twentyFourMatch[1]);
    minute = Number(twentyFourMatch[2]);
  } else {
    // try to extract numbers like '6:00' or '6 00'
    const loose = s.match(/(\d{1,2})(?::|\s)?(\d{2})?/);
    if (loose) {
      hour = Number(loose[1]);
      minute = loose[2] ? Number(loose[2]) : 0;
    } else {
      return null;
    }
  }

  // build date for today at that hour
  const candidate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
  if (candidate.getTime() >= now.getTime()) return candidate;
  // otherwise return tomorrow at that hour
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, hour, minute, 0, 0);
  return tomorrow;
}
