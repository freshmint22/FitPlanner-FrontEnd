import { useEffect, useMemo, useState } from 'react';
import axiosClient from '@/api/axiosClient';
import CalendarGrid from '@/components/Calendar/CalendarGrid';
import { PageHeader } from '@/components/ui/PageHeader';
import { useNavigate } from 'react-router-dom';
import { KpiCard } from '@/components/ui/KpiCard';

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

export default function CalendarPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [yearMonth, setYearMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const countToday = () => {
    const today = new Date();
    const wd = today.getDay();
    return classes.filter((c) => c.scheduleISO && new Date(c.scheduleISO).getDay() === wd).length;
  };

  const occupancy = () => {
    if (!classes.length) return 0;
    const totalRes = classes.reduce((s, c) => s + (c.reservations || 0), 0);
    const totalCap = classes.reduce((s, c) => s + (c.capacity || 0), 0) || 1;
    return Math.round((totalRes / totalCap) * 100);
  };

  const nextClass = () => {
    const now = new Date();
    const future = classes
      .map((c) => ({ ...c, date: c.scheduleISO ? new Date(c.scheduleISO) : null }))
      .filter((c: any) => c.date && c.date.getTime() >= now.getTime())
      .sort((a: any, b: any) => a.date.getTime() - b.date.getTime());
    return future[0] || null;
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axiosClient.get('/classes');
        let items = data;
        if (items && items.items) items = items.items;
        if (!Array.isArray(items)) items = [];
        setClasses(items || []);
      } catch (err) {
        console.error('Error loading classes for calendar', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const { year, month } = yearMonth;

  const onPrev = () => setYearMonth((s) => {
    const m = s.month - 1;
    if (m < 0) return { year: s.year - 1, month: 11 };
    return { year: s.year, month: m };
  });
  const onNext = () => setYearMonth((s) => {
    const m = s.month + 1;
    if (m > 11) return { year: s.year + 1, month: 0 };
    return { year: s.year, month: m };
  });

  const monthLabel = useMemo(() => new Date(year, month, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' }), [year, month]);

  const handleDayClick = (date: Date, items: ClassItem[]) => {
    // navigate to classes page and optionally filter by date
    navigate('/classes');
  };

  return (
    <div className="page-fade-in">
      <PageHeader
        pill="Calendario"
        title="Calendario de clases"
        subtitle="Revisa las clases por día y reserva desde los detalles."
        actions={(
          <div className="flex items-center gap-2">
            <button onClick={onPrev} className="rounded px-3 py-1 text-sm bg-slate-700 text-white">‹</button>
            <div className="text-sm font-semibold text-slate-800">{monthLabel}</div>
            <button onClick={onNext} className="rounded px-3 py-1 text-sm bg-slate-700 text-white">›</button>
          </div>
        )}
      />

      <div className="mt-6 space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <KpiCard label="Clases de hoy" value={String(countToday())} helperText="Entre fuerza, cardio y funcional." isLoading={isLoading} />
          <KpiCard label="Ocupación promedio" value={`${occupancy()}%`} helperText="Basado en reservas vs cupos disponibles." isLoading={isLoading} />
          <KpiCard label="Próxima clase" value={nextClass()?.name || 'Sin clases'} helperText={nextClass() ? `${nextClass()?.hour || ''} · ${nextClass()?.room || ''}` : 'No hay clases próximas'} isLoading={isLoading} />
        </section>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900/90">
          {isLoading ? (
            <p className="text-sm text-slate-400">Cargando calendario...</p>
          ) : (
            <CalendarGrid classes={classes} year={year} month={month} onDayClick={handleDayClick} />
          )}
        </div>
      </div>
    </div>
  );
}
