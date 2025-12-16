// src/pages/RoutinesPage.tsx
import { useEffect, useState } from 'react';
import axiosClient from '@/api/axiosClient';
import { useAuth } from '@/context/useAuth';
import CreateRoutineWithAIButton from '@/components/CreateRoutineWithAIButton';
import AIChatbot from '@/components/AIChatbot';
import RoutineDetailsModal from '@/components/RoutineDetailsModal';
import ConfirmModal from '@/components/ConfirmModal';

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
  

  // Derived dashboard metrics from current routines state
  const activeCount = routines.filter(r => (r.exercises && Array.isArray(r.exercises) && r.exercises.some((e: any) => !!e.done))).length;
  const plannedDays = routines.reduce((sum, r) => {
    let n = 0;
    if (r.frequency) {
      const m = String(r.frequency).match(/(\d+)/);
      if (m) n = Number(m[1]);
    } else if (typeof r.dias === 'number') n = r.dias;
    else if (Array.isArray(r.dias)) n = r.dias.length;
    return sum + (n || 0);
  }, 0);
  // count completed exercises (checked boxes) across all routines
  const completedExercises = routines.reduce((sum, r) => {
    const ex = r.exercises || [];
    const doneCount = ex.reduce((s: number, e: any) => s + ((e && e.done) ? 1 : 0), 0);
    return sum + doneCount;
  }, 0);

  // total exercises (used as denominator for progress)
  const totalExercises = routines.reduce((sum, r) => {
    const ex = r.exercises || [];
    return sum + (ex.length || 0);
  }, 0);

  const [routineToDelete, setRoutineToDelete] = useState<Routine | null>(null);

  const doDeleteRoutine = async (routineToDelete: Routine) => {
    // remove immediately from UI
    setRoutines(prev => prev.filter(r => !(r._id === routineToDelete._id || r.name === routineToDelete.name)));
    // remove from localStorage synchronously
    try {
      const stored = localStorage.getItem('fitplanner.rutinas');
      const arr = stored ? JSON.parse(stored) : [];
      const idx = arr.findIndex((x: any) => x._id === routineToDelete._id || x.name === routineToDelete.name);
      if (idx >= 0) {
        arr.splice(idx, 1);
        localStorage.setItem('fitplanner.rutinas', JSON.stringify(arr));
      }
    } catch (e) { /* ignore */ }
    // close confirm modal immediately so UI is responsive
    setRoutineToDelete(null);
    // perform backend delete in background (don't block UI)
    (async () => {
      try {
        if (routineToDelete._id) await axiosClient.delete(`/routines/${routineToDelete._id}`);
      } catch (e) {
        console.warn('Failed to delete on backend', e);
      }
    })();
  };

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
        const normalizedFromServer = items.map((r: any) => {
          // build exercises array from possible shapes (r.exercises as strings/objects or r.dias[].ejercicios)
          const exercisesArr: any[] = [];
          if (Array.isArray(r.exercises)) {
            for (const e of r.exercises) {
              if (!e) continue;
              if (typeof e === 'string') exercisesArr.push({ name: e, sets: undefined, rest: undefined, done: false });
              else if (typeof e === 'object') exercisesArr.push({ name: e.name || e.nombre || String(e), sets: e.sets, rest: e.rest || e.descanso, done: !!e.done });
              else exercisesArr.push({ name: String(e), done: false });
            }
            // If exercises are generic placeholders like "Ejercicio 1" and generatedText exists,
            // try to extract better names from generatedText and replace them.
            const hasGeneric = exercisesArr.some(ex => /^\s*ejercicio\s*\d+/i.test(ex.name || ''));
            const genText = r.generatedText || (r as any).text || (r.resumen && r.resumen.text);
            if (hasGeneric && genText) {
              const lines = String(genText).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
              const parsedNames: string[] = [];
              for (const line of lines) {
                if (/^Rutina|^Objetivo:|^Nivel:|^Días\/?semana:|^Enfoque:|^-- Día/i.test(line)) continue;
                const cleaned = line.replace(/^\d+\)\s*/, '').replace(/^[\-•]\s*/, '');
                const nameOnly = cleaned.replace(/\|?\s*Descanso[:]?.*$/i, '').replace(/(\d+x\d+)/i, '').replace(/\(.*?\)/g, '').trim();
                if (nameOnly) parsedNames.push(nameOnly);
              }
              if (parsedNames.length >= exercisesArr.length) {
                for (let i = 0; i < exercisesArr.length; i++) {
                  if (/^\s*ejercicio\s*\d+/i.test(exercisesArr[i].name || '')) {
                    exercisesArr[i].name = parsedNames[i] || exercisesArr[i].name;
                  }
                }
              }
            }
          } else if (Array.isArray(r.dias)) {
            const day = r.dias.find((d: any) => Array.isArray(d.ejercicios) && d.ejercicios.length > 0) || r.dias[0];
              if (day && Array.isArray(day.ejercicios)) {
                for (const e of day.ejercicios) {
                  if (!e) continue;
                  if (typeof e === 'string') exercisesArr.push({ name: e, sets: undefined, rest: undefined, done: false });
                  else if (typeof e === 'object') exercisesArr.push({ name: e.name || e.nombre || String(e), sets: e.sets, rest: e.rest || e.descanso, done: !!e.done });
                  else exercisesArr.push({ name: String(e), done: false });
                }

                // If the AI stored placeholder labels like "Ejercicio 1" and there's a generatedText
                // with better names, try to extract them and replace the generic labels.
                const hasGeneric = exercisesArr.some(ex => /^\s*ejercicio\s*\d+/i.test(ex.name || ''));
                const genText = r.generatedText || (r as any).text || (r.resumen && r.resumen.text);
                if (hasGeneric && genText) {
                  const lines = String(genText).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
                  const parsedNames: string[] = [];
                  for (const line of lines) {
                    if (/^Rutina|^Objetivo:|^Nivel:|^Días\/?semana:|^Enfoque:|^-- Día/i.test(line)) continue;
                    const cleaned = line.replace(/^\d+\)\s*/, '').replace(/^[\-•]\s*/, '');
                    const nameOnly = cleaned.replace(/\|?\s*Descanso[:]?.*$/i, '').replace(/(\d+x\d+)/i, '').replace(/\(.*?\)/g, '').trim();
                    if (nameOnly) parsedNames.push(nameOnly);
                  }
                  if (parsedNames.length >= exercisesArr.length) {
                    for (let i = 0; i < exercisesArr.length; i++) {
                      if (/^\s*ejercicio\s*\d+/i.test(exercisesArr[i].name || '')) {
                        exercisesArr[i].name = parsedNames[i] || exercisesArr[i].name;
                      }
                    }
                  }
                }
              }
          }

          return {
            _id: r._id,
            name: r.name || r.nombre,
            frequency: r.frequency,
            focus: r.focus,
            status: r.status || 'Activa',
            dias: r.dias,
            objetivo: r.objetivo,
            nivel: r.nivel,
            exercises: exercisesArr
          };
        });

        // cargar rutinas guardadas localmente (fallback cuando el POST al backend falló)
        let normalizedLocal: any[] = [];
        try {
          const stored = localStorage.getItem('fitplanner.rutinas');
          const arr = stored ? JSON.parse(stored) : [];
          normalizedLocal = arr.map((r: any) => {
            const exercisesArr: any[] = [];
            if (Array.isArray(r.exercises)) {
              for (const e of r.exercises) {
                if (typeof e === 'string') exercisesArr.push({ name: e, done: !!e.done });
                else if (typeof e === 'object') exercisesArr.push({ name: e.name || e.nombre || String(e), sets: e.sets, rest: e.rest, done: !!e.done });
              }
            } else if (Array.isArray(r.dias)) {
              const day = r.dias.find((d: any) => Array.isArray(d.ejercicios) && d.ejercicios.length > 0) || r.dias[0];
              if (day && Array.isArray(day.ejercicios)) {
                for (const e of day.ejercicios) {
                  if (typeof e === 'string') exercisesArr.push({ name: e, done: false });
                  else if (typeof e === 'object') exercisesArr.push({ name: e.name || e.nombre || String(e), done: !!e.done });
                }
              }
            }

            return {
              _id: r._id || r.id || undefined,
              name: r.name || r.nombre || r.nombreRutina || 'Rutina IA',
              frequency: r.frequency || (r.diasPorSemana ? `${r.diasPorSemana} días/semana` : undefined),
              focus: r.focus || r.enfoque || '',
              status: r.status || 'Activa',
              dias: r.dias || r.diasPorSemana || r.dias,
              objetivo: r.objetivo || r.resumen?.objetivo || r.objetivo,
              nivel: r.nivel || r.resumen?.nivel,
              exercises: exercisesArr
            };
          });
        } catch (e) {
          // ignore parse errors
          normalizedLocal = [];
        }

        // unir sin duplicados (por _id o por nombre)
        // Start with server items, then merge/overwrite with local fields so local edits (exercises, resumen)
        // are preserved when backend doesn't contain them.
        const map = new Map<string, any>();
        normalizedFromServer.forEach((it: any) => {
          const key = it._id || it.name;
          map.set(key, it);
        });
        normalizedLocal.forEach((it: any) => {
          const key = it._id || it.name;
          if (!map.has(key)) {
            map.set(key, it);
          } else {
            // merge local fields into server record, prefer local exercises/resumen
            const existing = map.get(key) || {};
            map.set(key, { ...existing, ...it, exercises: (it.exercises && it.exercises.length > 0) ? it.exercises : existing.exercises, resumen: { ...(existing.resumen || {}), ...(it.resumen || {}) } });
          }
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
            <p className="mt-2 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{activeCount}</p>
            <p className="mt-1 text-xs text-slate-500">
              Rutinas actualmente en ejecución.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-lg shadow-slate-200/40 dark:bg-slate-900/90 dark:border-slate-800 dark:shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Días planificados
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">{plannedDays}</p>
            <p className="mt-1 text-xs text-slate-500">
              Días totales de entrenamiento esta semana.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-lg shadow-slate-200/40 dark:bg-slate-900/90 dark:border-slate-800 dark:shadow-black/30">
            <p className="text-[11px] uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Progreso semanal
            </p>
            <p className="mt-2 text-2xl font-semibold text-blue-600 dark:text-blue-400">{completedExercises} / {totalExercises || 0}</p>
            <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" style={{ width: `${totalExercises ? Math.round((completedExercises / totalExercises) * 100) : 0}%` }} />
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
                      {(() => {
                        const hasExercises = Array.isArray(routine.exercises) && routine.exercises.length > 0;
                        const completed = hasExercises && routine.exercises.some((e: any) => !!e.done);
                        const statusText = completed ? 'Activa' : (hasExercises ? 'Inactiva' : (routine.status || 'Inactiva'));
                        return (
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-600/10 text-rose-400'}`}>
                            {statusText}
                          </span>
                        );
                      })()}
                          <button onClick={() => setRoutineToDelete(routine)} title="Eliminar" className="rounded-lg border border-transparent bg-white px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-slate-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" /></svg>
                          </button>
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
          onSave={async (updatedRoutine: any, newlyCompletedIndices?: number[]) => {
            // ensure a stable id for local-only routines
            const normalized = { ...updatedRoutine };
            if (!normalized._id) {
              normalized._id = `local-${Date.now()}`;
            }

            // update in-memory list (replace by _id or name)
            setRoutines(prev => {
              const exists = prev.some(r => (r._id === normalized._id || r.name === normalized.name));
              if (exists) return prev.map(r => (r._id === normalized._id || r.name === normalized.name) ? { ...r, ...normalized } : r);
              return [normalized, ...prev];
            });

            // persist to localStorage (merge/update existing) synchronously
            try {
              const stored = localStorage.getItem('fitplanner.rutinas');
              const arr = stored ? JSON.parse(stored) : [];
              const idx = arr.findIndex((x: any) => x._id === normalized._id || x.name === normalized.name);
              if (idx >= 0) arr[idx] = { ...arr[idx], ...normalized };
              else arr.unshift(normalized);
              localStorage.setItem('fitplanner.rutinas', JSON.stringify(arr));
            } catch (e) { console.warn('Failed to persist routine locally', e); }

            // persist to backend in background if this has a real _id
            (async () => {
              try {
                if (updatedRoutine._id) {
                  await axiosClient.put(`/routines/${updatedRoutine._id}`, updatedRoutine);
                  // mark newly completed exercises individually on the backend
                  if (Array.isArray(newlyCompletedIndices) && newlyCompletedIndices.length > 0) {
                    for (const idx of newlyCompletedIndices) {
                      try {
                        // endpoint: PUT /routines/:id/exercises/:idx/complete
                        await axiosClient.put(`/routines/${updatedRoutine._id}/exercises/${idx}/complete`);
                      } catch (innerErr) {
                        console.warn('Failed to mark exercise complete on backend', innerErr);
                      }
                    }
                  }
                } else {
                  // No backend id: nothing to mark on server now.
                }
              } catch (e) {
                console.warn('Failed to persist routine to backend', e);
              }
            })();
          }}
        />
      )}
      {routineToDelete && (
        <ConfirmModal
          title="Eliminar rutina"
          description={`¿Estás seguro que deseas eliminar "${routineToDelete.name}"? Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          onConfirm={() => doDeleteRoutine(routineToDelete)}
          onCancel={() => setRoutineToDelete(null)}
        />
      )}
    </div>
  );
};

export default RoutinesPage;
