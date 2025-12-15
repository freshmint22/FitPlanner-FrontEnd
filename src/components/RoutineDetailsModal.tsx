import React from 'react';

interface Exercise {
  name: string;
  sets?: string | number;
  rest?: string;
}

interface Routine {
  _id?: string;
  name?: string;
  frequency?: string;
  focus?: string;
  status?: string;
  dias?: any[];
  objetivo?: string;
  nivel?: string;
  exercises?: Exercise[];
  generatedText?: string;
}

interface Props {
  routine: Routine | null;
  onClose: () => void;
  onStart?: () => void;
}

// Small helper to parse exercises from AI text if needed
function parseExercisesFromDias(dias: any[] | undefined): Exercise[] {
  if (!dias || !Array.isArray(dias) || dias.length === 0) return [];
  // try to parse first day block
  const first = dias[0];
  const text = typeof first === 'string' ? first : (first.text || JSON.stringify(first));
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  // keep lines that look like "1) Name ..." or just bullets
  const ex: Exercise[] = lines
    .filter(l => /^\d+\)/.test(l) || /^[\-••]/.test(l) || l.length > 0)
    .map(l => {
      // strip leading "1)"
      const name = l.replace(/^\d+\)\s*/, '').replace(/^[-•]\s*/, '');
      return { name };
    });
  return ex;
}

export default function RoutineDetailsModal({ routine, onClose, onStart }: Props) {
  if (!routine) return null;

  const exercises: Exercise[] = (routine.exercises && Array.isArray(routine.exercises) && routine.exercises.length > 0)
    ? routine.exercises
    : parseExercisesFromDias(routine.dias);

  // derive some display values
  const entrenador = routine.usuario?.name || 'Carlos López';
  const nivel = routine.nivel || routine.resumen?.nivel || '';
  const objetivo = routine.objetivo || routine.resumen?.objetivo || routine.resumen?.meta || '';
  const duracionDisplay = routine.resumen?.duracion || '45 min';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[94%] max-w-3xl rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <button onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-4 z-20 rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
        </button>

        <div className="p-8">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{routine.name || 'Rutina'}</h3>
            <div className="text-sm text-slate-500 mt-1">Entrenador: {entrenador}</div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">⏱️</div>
              <div>
                <div className="text-xs">Duración</div>
                <div className="font-semibold">{duracionDisplay}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">🏋️</div>
              <div>
                <div className="text-xs">Ejercicios</div>
                <div className="font-semibold">{exercises.length || (routine.dias ? routine.dias.length : 0)}</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Ejercicios</h4>
            <div className="mt-3 space-y-3">
              {exercises.length === 0 ? (
                <div className="text-sm text-slate-500">No hay ejercicios detallados.</div>
              ) : (
                exercises.map((ex, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-slate-50">{ex.name}</div>
                        <div className="text-xs text-slate-500">Series: {ex.sets ?? '4x10'} · Descanso: {ex.rest ?? '90s'}</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-300">○</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200">Cerrar</button>
            <button onClick={onStart} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Iniciar Rutina</button>
          </div>
        </div>
      </div>
    </div>
  );
}
