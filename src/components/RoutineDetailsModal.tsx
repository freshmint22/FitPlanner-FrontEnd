import React from 'react';
import axiosClient from '@/api/axiosClient';
import { createPortal } from 'react-dom';

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
  // second param: indices of exercises that were newly marked as done
  onSave?: (routine: Routine, newlyCompletedIndices?: number[]) => void;
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

export default function RoutineDetailsModal({ routine, onClose, onStart, onSave }: Props) {
  if (!routine) return null;

  

  const exercisesFromDias = (routine.exercises && Array.isArray(routine.exercises) && routine.exercises.length > 0)
    ? routine.exercises
    : parseExercisesFromDias(routine.dias);

  // if generatedText exists, try to parse exercises across all days
  function parseFromGeneratedText(text?: string): Exercise[] {
    if (!text) return exercisesFromDias || [];
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const exs: Exercise[] = [];
    for (const line of lines) {
      // ignore headers like 'Rutina generated' or day separators
      if (/^Rutina|^Objetivo:|^Nivel:|^Días\/semana:|^Enfoque:|^-- Día/i.test(line)) continue;
      // match lines like '1) Press de banca 4x10' or '- Press banca 4x10 | Descanso: 90s'
      const cleaned = line.replace(/^\d+\)\s*/, '').replace(/^[\-•]\s*/, '');
      // extract sets pattern e.g. 4x10
      const setsMatch = cleaned.match(/(\d+x\d+)/i);
      const restMatch = cleaned.match(/Descanso[:]?\s*(\d+\s?s|\d+s|\d+\s?segundos)/i) || cleaned.match(/(\d+\s?s)/i);
      const sets = setsMatch ? setsMatch[1] : undefined;
      const rest = restMatch ? restMatch[1] : undefined;
      // remove sets/rest from name
      let name = cleaned.replace(/\|?\s*Descanso[:]?.*$/i, '').replace(/(\d+x\d+)/i, '').replace(/\(.*?\)/g, '').trim();
      if (!name) continue;
      exs.push({ name, sets, rest });
    }
    return exs;
  }

  const parsedAll: Exercise[] = (() => {
    const fromText = parseFromGeneratedText((routine as any)?.generatedText || undefined);
    return (fromText && fromText.length > 0) ? fromText : (exercisesFromDias || []);
  })();

  // detect a restriction entry like "Restricciones: me duele el brazo" and remove it from the visible exercises
  const restrictionText = React.useMemo(() => {
    const found = parsedAll.find(ex => /^\s*restricciones?[:\-]/i.test(ex.name));
    if (!found) return null;
    const m = found.name.match(/^\s*restricciones?[:\-]\s*(.+)$/i);
    return m ? m[1].trim() : null;
  }, [routine?._id]);

  const visibleExercises = React.useMemo(() => parsedAll.filter(ex => !/^\s*restricciones?[:\-]/i.test(ex.name)), [parsedAll]);

  const [checked, setChecked] = React.useState<Record<number, boolean>>(() => {
    const map: Record<number, boolean> = {};
    visibleExercises.forEach((ex, i) => map[i] = !!(ex as any).done);
    return map;
  });

  // keep a snapshot to allow cancel -> revert
  const initialCheckedRef = React.useRef<Record<number, boolean>>({});

  React.useEffect(() => {
    const map: Record<number, boolean> = {};
    visibleExercises.forEach((ex, i) => map[i] = !!(ex as any).done);
    setChecked(map);
    initialCheckedRef.current = { ...map };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routine?._id]);

  // derive some display values
  const nivel = routine.nivel || routine.resumen?.nivel || '';
  const objetivo = routine.objetivo || routine.resumen?.objetivo || routine.resumen?.meta || '';
  const duracionDisplay = routine.resumen?.duracion || '45 min';
  const enfoque = routine.focus || (routine.resumen && routine.resumen.enfoque ? (Array.isArray(routine.resumen.enfoque) ? routine.resumen.enfoque.join(', ') : routine.resumen.enfoque) : 'Mixto');

  // fetch IA advice for the restriction (if present)
  const [restrictionAdvice, setRestrictionAdvice] = React.useState<string | null>(null);
  const [adviceLoading, setAdviceLoading] = React.useState(false);
  React.useEffect(() => {
    if (!restrictionText) {
      setRestrictionAdvice(null);
      return;
    }
    let cancelled = false;
    setAdviceLoading(true);
    axiosClient.post('/api/ai/restriction-advice', { restriction: restrictionText, context: { nivel, objetivo, enfoque } })
      .then(res => {
        if (cancelled) return;
        setRestrictionAdvice(res?.data?.advice || res?.data?.result || String(res?.data || ''));
      })
      .catch(err => {
        if (cancelled) return;
        console.warn('Failed to fetch restriction advice', err);
        setRestrictionAdvice(null);
      })
      .finally(() => { if (!cancelled) setAdviceLoading(false); });
    return () => { cancelled = true; };
  }, [restrictionText, nivel, objetivo, enfoque]);

  

  const modalContent = (
    <div className="fixed inset-0 z-[2147483646] flex items-center justify-center pointer-events-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div style={{ zIndex: 2147483647 }} className="relative w-full max-w-md rounded-2xl bg-white/100 dark:bg-slate-900/100 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh]">
        <div className="h-1 rounded-t-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />
        <button onClick={onClose} aria-label="Cerrar" className="absolute right-3 top-3 z-20 rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
        </button>

        <div className="overflow-auto max-h-[calc(100vh-7rem)] p-4">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{routine.name || 'Rutina'}</h3>
            <div className="text-xs text-slate-500 mt-1">{/* Nivel / Tipo / Enfoque line */}
              {nivel ? `${nivel} · ` : ''}{(objetivo || 'General')} · {enfoque || 'Mixto'}</div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
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
                <div className="font-semibold">{visibleExercises.length || (routine.dias ? routine.dias.length : 0)}</div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Ejercicios</h4>
            <div className="mt-3 space-y-3">
              {restrictionText && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-semibold">!</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900">Restricción</div>
                      <div className="text-sm text-slate-700 mt-1">{restrictionText}</div>
                      <div className="mt-2 text-xs text-slate-600">
                        {adviceLoading ? 'Obteniendo recomendación...' : (restrictionAdvice ? <div dangerouslySetInnerHTML={{ __html: restrictionAdvice.replace(/\n/g, '<br/>') }} /> : <div>No hay recomendaciones disponibles.</div>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="max-h-[40vh] overflow-y-auto pr-2 text-sm space-y-3">
                {visibleExercises.length === 0 ? (
                  <div className="text-sm text-slate-500">No hay ejercicios detallados.</div>
                ) : (
                  visibleExercises.map((ex, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-2 bg-white dark:bg-slate-900">
                      <input
                        type="checkbox"
                        checked={!!checked[idx]}
                        onChange={() => setChecked(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-slate-50">{ex.name}</div>
                        <div className="text-xs text-slate-500">Series: {ex.sets ?? '4x10'} · Descanso: {ex.rest ?? '90s'}</div>
                      </div>
                      <div className="ml-2 text-emerald-600 font-semibold">{checked[idx] ? '✓' : ''}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button onClick={() => {
              // revert to initial checked state and close without saving
              setChecked({ ...initialCheckedRef.current });
              onClose();
            }} className="px-4 py-2 rounded-lg border bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200">Cancelar</button>
            <button onClick={() => {
              try {
                const updatedExercises = visibleExercises.map((ex, idx) => ({ name: ex.name, sets: ex.sets, rest: ex.rest, done: !!checked[idx] }));
                const updated: Routine = { ...(routine as Routine), exercises: updatedExercises };
                const resumen = { ...(routine as any).resumen } || {};
                if (!resumen.duracion && duracionDisplay) resumen.duracion = duracionDisplay;
                if (!resumen.nivel && nivel) resumen.nivel = nivel;
                if (!resumen.enfoque && enfoque) resumen.enfoque = enfoque;
                updated.resumen = resumen;

                // compute which exercises were newly marked as done compared to the initial snapshot
                // determine which visible indices were newly completed and map them to original parsedAll indices
                const newlyCompleted: number[] = [];
                Object.keys(checked).forEach(k => {
                  const visibleIdx = Number(k);
                  const before = !!initialCheckedRef.current[visibleIdx];
                  const now = !!checked[visibleIdx];
                  if (!before && now) {
                    const ex = visibleExercises[visibleIdx];
                    // find original index in parsedAll by matching name/sets/rest
                    const orig = parsedAll.findIndex(p => p.name === ex.name && String(p.sets || '') === String(ex.sets || '') && String(p.rest || '') === String(ex.rest || ''));
                    // push visible index (matches updated.exercises order)
                    newlyCompleted.push(visibleIdx);
                  }
                });

                // store restriction text in resumen if present
                if (restrictionText) {
                  const r = { ...(updated as any).resumen } || {};
                  r.restricciones = restrictionText;
                  (updated as any).resumen = r;
                }

                if (onSave) {
                  // call onSave but don't await network response to keep UI snappy
                  try { onSave(updated as any, newlyCompleted); } catch (e) { console.warn('onSave error', e); }
                }
                // optimistically update snapshot so Cancel won't revert after save
                initialCheckedRef.current = { ...checked };
              } catch (e) {
                console.warn('Error preparing routine save', e);
              }
              onClose();
            }} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Guardar cambios de rutina</button>
          </div>

          {/* removed Tipo/Enfoque and Restrictions per request */}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
