// src/pages/RoutinesPage.tsx
import { useEffect, useState } from 'react';
import axiosClient from '@/api/axiosClient';
import { useAuth } from '@/context/useAuth';
import CreateRoutineWithAIButton from '@/components/CreateRoutineWithAIButton';
import AIChatbot from '@/components/AIChatbot';
import RoutineDetailsModal from '@/components/RoutineDetailsModal';

interface Routine {
  _id?: string;
  id?: number;
  name: string;
  frequency?: string;
  focus?: string;
  status: string;
  dias?: any[];
  objetivo?: string;
  nivel?: string;
  exercises?: any[];
}

const RoutinesPage = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAI, setShowAI] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await axiosClient.get('/routines');
        const data = res?.data;
        // backend may return { items: [...] } or { ok: true, data: [...] }
        let items: any[] = [];
        if (!data) items = [];
        else if (Array.isArray(data)) items = data;
        else if (data.items) items = data.items;
        else if (data.data) items = data.data;
        else items = [data];

        // normalizar items desde backend
        const normalizedFromServer = items.map((r: any) => ({
          _id: r._id,
          name: r.name,
          frequency: r.frequency,
          focus: r.focus,
          status: r.status || 'Activa',
          dias: r.dias,
          objetivo: r.objetivo,
          nivel: r.nivel,
          exercises: r.exercises
        }));

        // cargar rutinas guardadas localmente (fallback cuando el POST al backend falló)
        let normalizedLocal: any[] = [];
        try {
          const stored = localStorage.getItem('fitplanner.rutinas');
          const arr = stored ? JSON.parse(stored) : [];
          normalizedLocal = arr.map((r: any) => ({
            _id: r._id || r.id || undefined,
            name: r.name || r.nombre || r.nombreRutina || 'Rutina IA',
            frequency: r.frequency || (r.diasPorSemana ? `${r.diasPorSemana} días/semana` : undefined),
            focus: r.focus || r.enfoque || '',
            status: r.status || 'Activa',
            dias: r.dias || r.diasPorSemana || r.dias,
            objetivo: r.objetivo || r.resumen?.objetivo || r.objetivo,
            nivel: r.nivel || r.resumen?.nivel,
            exercises: r.exercises || []
          }));
        } catch (e) {
          // ignore parse errors
          normalizedLocal = [];
        }

        // unir sin duplicados (por _id o por nombre)
        const map = new Map<string, any>();
        normalizedFromServer.forEach((it: any) => {
          const key = it._id || it.name;
          map.set(key, it);
        });
        normalizedLocal.forEach((it: any) => {
          const key = it._id || it.name;
          if (!map.has(key)) map.set(key, it);
        });

        const merged = Array.from(map.values());
        setRoutines(merged);
      } catch (error) {
        console.error('Error fetching routines:', error);
        // si falla el backend, intentar cargar rutinas desde localStorage
        try {
          const stored = localStorage.getItem('fitplanner.rutinas');
          const arr = stored ? JSON.parse(stored) : [];
          const normalizedLocal = arr.map((r: any) => ({
            _id: r._id || r.id || undefined,
            name: r.name || r.nombre || r.nombreRutina || 'Rutina IA',
            frequency: r.frequency || (r.diasPorSemana ? `${r.diasPorSemana} días/semana` : undefined),
            focus: r.focus || r.enfoque || '',
            status: r.status || 'Activa',
            dias: r.dias || r.diasPorSemana || r.dias,
            objetivo: r.objetivo || r.resumen?.objetivo || r.objetivo,
            nivel: r.nivel || r.resumen?.nivel,
            exercises: r.exercises || []
          }));
          setRoutines(normalizedLocal);
        } catch (e) {
          console.warn('No local routines found or parse failed', e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutines();
  }, []);
  return (
    <div className="min-h-full bg-white pb-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 pt-6 space-y-6">
        {/* Resumen rápido */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-lg shadow-slate-200/40 dark:bg-slate-900/90 dark:border-slate-800 dark:shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Rutinas activas
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">2</p>
            <p className="mt-1 text-xs text-slate-500">
              Rutinas actualmente en ejecución.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-lg shadow-slate-200/40 dark:bg-slate-900/90 dark:border-slate-800 dark:shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Días planificados
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">4</p>
            <p className="mt-1 text-xs text-slate-500">
              Días totales de entrenamiento esta semana.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-lg shadow-slate-200/40 dark:bg-slate-900/90 dark:border-slate-800 dark:shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Progreso semanal
            </p>
            <p className="mt-2 text-2xl font-semibold text-blue-600 dark:text-blue-400">3 / 4</p>
            <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              Sesiones completadas esta semana.
            </p>
          </div>
        </section>

        {/* Lista de rutinas */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Tus rutinas
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Gestiona y revisa tus planes de entrenamiento.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CreateRoutineWithAIButton onClick={() => setShowAI(prev => !prev)} />
            </div>
          </div>

          {/* AI full-page view (replaces routines list) */}
          {showAI ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/30">
              <div className="mb-4">
                <AIChatbot onSave={async (newRoutine: any) => {
                  // Try to persist to backend using normalized API
                  try {
                    const memberId = user?.id || (() => {
                      try { const u = localStorage.getItem('user'); return u ? JSON.parse(u).id : undefined; } catch { return undefined; }
                    })();
                    const body = {
                      nombre: newRoutine.name,
                      diasPorSemana: newRoutine.diasPorSemana,
                      objetivo: newRoutine.resumen?.objetivo,
                      enfoque: newRoutine.resumen?.enfoque,
                      nivel: newRoutine.resumen?.nivel,
                      memberId
                    };
                    const res = await axiosClient.post('/routines', body);
                    const created = res?.data?.data || newRoutine;
                    setRoutines(prev => [created, ...prev]);
                    // optionally clear any local IA cache if you used one
                  } catch (err) {
                    console.warn('Save to backend failed, falling back to local state', err);
                    setRoutines(prev => [newRoutine, ...prev]);
                    try {
                      const stored = localStorage.getItem('fitplanner.rutinas');
                      const arr = stored ? JSON.parse(stored) : [];
                      arr.unshift(newRoutine);
                      localStorage.setItem('fitplanner.rutinas', JSON.stringify(arr));
                    } catch { /* ignore */ }
                  } finally {
                    setShowAI(false);
                  }
                }} />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {isLoading ? (
                <p className="text-center text-sm text-slate-400">Cargando rutinas...</p>
              ) : routines.length === 0 ? (
                <p className="text-center text-sm text-slate-400">No tienes rutinas creadas</p>
              ) : (
                routines.map((routine) => (
                  <div
                    key={routine._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {routine.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {routine.frequency} · {routine.focus}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          routine.status === "Activa"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-600/20 text-slate-300"
                        }`}>
                        {routine.status}
                      </span>
                          <button onClick={() => setSelectedRoutine(routine)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                            Ver detalles
                          </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          
        </section>
      </div>
      {selectedRoutine && (
        <RoutineDetailsModal
          routine={selectedRoutine}
          onClose={() => setSelectedRoutine(null)}
          onStart={() => {
            // placeholder for starting a routine action
            setSelectedRoutine(null);
          }}
        />
      )}
    </div>
  );
};

export default RoutinesPage;
