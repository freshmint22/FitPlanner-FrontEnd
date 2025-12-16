// src/pages/ClassesPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import axiosClient from '@/api/axiosClient';
import { EditClassModal } from '@/components/modals/EditClassModal';
import ClassDetailsModal from '@/components/modals/ClassDetailsModal';

interface Class {
  _id?: string;
  name: string;
  level?: string;
  room?: string;
  hour?: string;
  trainer?: string;
  capacity?: number;
  reservations?: number;
  scheduleISO?: string | null;
}

const mockClasses: Class[] = [
  { _id: '1', name: 'Funcional Full Body', level: 'Intermedio', room: 'Sala 2', hour: '6:00 a.m.', trainer: 'Laura Gómez', capacity: 20, reservations: 18 },
  { _id: '2', name: 'Spinning Cardio', level: 'Alta intensidad', room: 'Sala Cardio', hour: '7:30 a.m.', trainer: 'Carlos Ruiz', capacity: 18, reservations: 15 },
  { _id: '3', name: 'Cross Training', level: 'Avanzado', room: 'Sala 1', hour: '6:30 p.m.', trainer: 'Miguel Rojas', capacity: 25, reservations: 22 },
];

const ClassesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMyTab, setIsMyTab] = useState(true);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<Class | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let midnightTimer: NodeJS.Timeout | null = null;

    const fetchClasses = async () => {
      try {
        const resp = await axiosClient.get('/classes');
        // backend may return either an array or an object { items: [...] }
        let data = resp.data;
        if (data && data.items) data = data.items;
        if (!Array.isArray(data)) {
          console.warn('Unexpected /classes response shape:', resp.data);
          data = [];
        }
        // debug
        // eslint-disable-next-line no-console
        console.log('Fetched classes:', data);
        setClasses(data || []);
      } catch (error) {
        console.error('Error cargando clases:', error);
      }
    };

    const fetchReservations = async () => {
      if (!user?.id) return;
      try {
        const resp = await axiosClient.get('/classes/reservations/me');
        let d = resp.data;
        if (d && d.items) d = d.items;
        if (!Array.isArray(d)) d = [];
        setReservations(d || []);
      } catch (err) {
        // ignore
      }
    };

    const fetchInitial = async () => {
      setIsLoading(true);
      await fetchClasses();
      await fetchReservations();
      setIsLoading(false);
    };

    const pollFetch = async () => {
      await fetchClasses();
      await fetchReservations();
    };

    // initial fetch
    fetchInitial();

    // poll every 10 seconds to pick up reservations made by other users
    interval = setInterval(() => {
      pollFetch();
    }, 10000);

    // schedule daily midnight refresh
    const scheduleMidnightRefresh = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const ms = tomorrow.getTime() - now.getTime();
      if (midnightTimer) clearTimeout(midnightTimer);
      midnightTimer = setTimeout(async () => {
        await pollFetch();
        // after midnight refresh, schedule next one
        scheduleMidnightRefresh();
      }, ms + 1000); // add 1s buffer
    };
    scheduleMidnightRefresh();

    return () => {
      if (interval) clearInterval(interval);
      if (midnightTimer) clearTimeout(midnightTimer);
    };
  }, [user?.id]);

  const weekdays = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

  const groupedByWeekday = () => {
    const map = new Map<string, Class[]>();
    for (const cls of classes) {
      let dt: Date | null = null;
      if (cls.scheduleISO) dt = new Date(cls.scheduleISO);
      // fallback: try to parse hour by creating today with that hour
      if (!dt && cls.hour) {
        const today = new Date();
        const [hourPart, minutePart] = cls.hour.split(':');
        const hour = parseInt(hourPart, 10) || 0;
        const minute = minutePart ? parseInt(minutePart, 10) : 0;
        dt = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minute, 0, 0);
      }
      const key = dt ? weekdays[dt.getDay()] : 'Sin fecha';
      const arr = map.get(key) || [];
      arr.push(cls);
      map.set(key, arr);
    }
    // keep weekday order
    return weekdays.map((wd) => ({ day: wd, items: map.get(wd) || [] })).filter((g) => g.items.length > 0);
  };

  const countToday = () => {
    const today = new Date();
    const todayWeekday = today.getDay();
    return classes.filter((c) => {
      if (!c.scheduleISO) return false;
      const d = new Date(c.scheduleISO);
      return d.getDay() === todayWeekday;
    }).length;
  };

  const isReserved = (classId?: string) => reservations.some((r) => String(r.classId) === String(classId));

  const reserveClass = async (classId?: string) => {
    if (!classId) return;
    try {
      setActionLoading(classId);
      await axiosClient.post(`/classes/${classId}/reservations`);
      // refresh classes and reservations
      const [{ data: classesData }, { data: resData }] = await Promise.all([
        axiosClient.get('/classes'),
        axiosClient.get('/classes/reservations/me')
      ]);
      let cdata = classesData;
      if (cdata && cdata.items) cdata = cdata.items;
      if (!Array.isArray(cdata)) cdata = [];
      setClasses(cdata || []);
      let rdata = resData;
      if (rdata && rdata.items) rdata = rdata.items;
      if (!Array.isArray(rdata)) rdata = [];
      setReservations(rdata || []);
    } catch (err) {
      console.error('Error reservando clase', err);
      // optionally show toast
    } finally {
      setActionLoading(null);
    }
  };

  const cancelReserve = async (classId?: string) => {
    if (!classId) return;
    try {
      setActionLoading(classId);
      await axiosClient.delete(`/classes/${classId}/reservations`);
      const [{ data: classesData }, { data: resData }] = await Promise.all([
        axiosClient.get('/classes'),
        axiosClient.get('/classes/reservations/me')
      ]);
      let cdata = classesData;
      if (cdata && cdata.items) cdata = cdata.items;
      if (!Array.isArray(cdata)) cdata = [];
      setClasses(cdata || []);
      let rdata = resData;
      if (rdata && rdata.items) rdata = rdata.items;
      if (!Array.isArray(rdata)) rdata = [];
      setReservations(rdata || []);
    } catch (err) {
      console.error('Error cancelando reserva', err);
    } finally {
      setActionLoading(null);
    }
  };

  const openDetails = (cls: Class) => {
    setSelectedDetails(cls);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setSelectedDetails(null);
    setIsDetailsOpen(false);
  };

  return (
    <div className="min-h-full bg-slate-50 pb-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 pt-6 space-y-6">
        {/* Resumen rápido - Datos dinámicos */}
        <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Clases de hoy
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-800">{countToday()}</p>
            <p className="mt-1 text-xs text-slate-600">
              Entre fuerza, cardio y funcional.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Ocupación promedio
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-600">
              {classes.length > 0 
                ? Math.round((classes.reduce((sum, c) => sum + (c.reservations || 0), 0) / 
                    classes.reduce((sum, c) => sum + (c.capacity || 1), 0)) * 100) + '%'
                : '0%'}
            </p>
            <div className="mt-2 h-2 rounded-full bg-slate-800">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" 
                style={{
                  width: classes.length > 0 
                    ? `${Math.round((classes.reduce((sum, c) => sum + (c.reservations || 0), 0) / 
                        classes.reduce((sum, c) => sum + (c.capacity || 1), 0)) * 100)}%`
                    : '0%'
                }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Basado en reservas vs cupos disponibles.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Próxima clase
            </p>
            <p className="mt-2 text-base font-semibold text-slate-800">
              {classes[0]?.name || 'Sin clases programadas'}
            </p>
            <p className="text-xs text-slate-600">
              {classes[0]?.hour || 'N/A'} · {classes[0]?.room || 'N/A'}
            </p>
          </div>
        </section>

        {/* Listado de clases */}
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                Clases del día
              </h2>
              <p className="text-xs text-slate-400">
                Revisa y gestiona las clases programadas.
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <div className="rounded-md bg-slate-100 p-1 text-xs text-slate-600">
                <button onClick={() => setIsMyTab(true)} className={`px-3 py-1 ${isMyTab ? 'bg-white rounded-md shadow' : ''}`}>Mis Clases ({reservations.length})</button>
                <button onClick={() => setIsMyTab(false)} className={`px-3 py-1 ${!isMyTab ? 'bg-white rounded-md shadow' : ''}`}>Disponibles ({classes.length})</button>
              </div>
              <div className="ml-2" />
            
              <div className="flex gap-2">
              <button onClick={() => navigate('/classes/calendar')} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900">
                Ver calendario
              </button>
              {user?.role === 'ADMIN' && (
                <button className="rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 px-3 py-1.5 text-xs font-semibold text-white shadow shadow-emerald-500/40">
                  Nueva clase
                </button>
              )}
              </div>
            </div>
          </div>

            <div className="space-y-3">
            {isLoading ? (
              <p className="text-center text-sm text-slate-400">Cargando clases...</p>
            ) : classes.length === 0 ? (
              <p className="text-center text-sm text-slate-400">No hay clases disponibles</p>
            ) : (
              <>
                {groupedByWeekday().map((group) => {
                  const visibleItems = group.items.filter((cls) => (isMyTab ? isReserved(cls._id) : true));
                  // If we're in 'Mis Clases' and there are no visible items for this weekday, skip rendering the day header
                  if (isMyTab && visibleItems.length === 0) return null;
                  return (
                    <div key={group.day} className="space-y-2">
                      <h3 className="text-xs font-semibold text-slate-400">{group.day}</h3>
                      <div className="space-y-2">
                        {visibleItems.map((cls) => {
                          const reserved = isReserved(cls._id);
                          return (
                            <div
                              key={cls._id}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-950"
                            >
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{cls.name}</p>
                                <p className="text-xs text-slate-500">{cls.hour || 'Horario no especificado'} · {cls.room || 'Sala no especificada'}</p>
                                <p className="mt-1 text-[11px] text-slate-500">Instructor: <span className="font-medium text-slate-700">{cls.trainer || 'No asignado'}</span></p>
                              </div>
                              <div className="flex items-center gap-3 text-xs">
                                <div className="text-right text-slate-700">
                                  <p className="text-[11px] text-slate-500">Cupos</p>
                                  <p className="font-semibold">{cls.reservations || 0} / {cls.capacity || 0}</p>
                                </div>
                                {user?.role === 'ADMIN' && (
                                  <button onClick={() => { setSelectedClass(cls); setIsEditModalOpen(true); }} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-50">Editar</button>
                                )}
                                  {user?.role !== 'ADMIN' && (
                                    reserved ? (
                                      <div className="flex gap-2">
                                        <button onClick={() => cancelReserve(cls._id)} disabled={actionLoading === cls._id} className="rounded-md bg-red-600 text-white px-3 py-1.5 text-sm">{actionLoading === cls._id ? '...' : 'Cancelar Reserva'}</button>
                                        <button onClick={() => openDetails(cls)} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700">Ver Detalles</button>
                                      </div>
                                    ) : (
                                      <div className="flex gap-2">
                                        <button onClick={() => reserveClass(cls._id)} disabled={actionLoading === cls._id} className="rounded-md bg-blue-600 text-white px-3 py-1.5 text-sm">{actionLoading === cls._id ? '...' : 'Reservar'}</button>
                                        <button onClick={() => openDetails(cls)} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700">Ver Detalles</button>
                                      </div>
                                    )
                                  )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </section>

        {/* (Asistente IA eliminado) */}
      </div>

      {/* Modal de edición (solo admin) */}
      {user?.role === 'ADMIN' && (
        <EditClassModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedClass(null);
          }}
          classData={selectedClass}
          onSuccess={() => {
            const fetchClasses = async () => {
              try {
                const { data } = await axiosClient.get('/classes');
                setClasses(data || []);
              } catch (error) {
                console.error('Error recargando clases:', error);
              }
            };
            fetchClasses();
          }}
        />
      )}

      <ClassDetailsModal
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        classData={selectedDetails}
        reserved={selectedDetails ? isReserved(selectedDetails._id) : false}
        onReserve={async (id) => { await reserveClass(id); closeDetails(); }}
        onCancelReserve={async (id) => { await cancelReserve(id); closeDetails(); }}
      />
    </div>
  );
};

export default ClassesPage;

