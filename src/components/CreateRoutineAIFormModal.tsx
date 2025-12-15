import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface RoutinePayload {
  objective: string;
  level: string;
  targets: string[];
  restrictions: string;
  daysPerWeek: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGenerate?: (payload: RoutinePayload) => Promise<string | null>;
}

const OBJECTIVES = [
  'Perder peso',
  'Ganar masa muscular',
  'Tonificar',
  'Resistencia cardiovascular',
];

const LEVELS = ['Principiante', 'Intermedio', 'Avanzado'];

const TARGETS = ['Pierna', 'Glúteo', 'Espalda', 'Pecho', 'Hombro', 'Bíceps', 'Tríceps', 'Core'];

const CreateRoutineAIFormModal: React.FC<Props> = ({ isOpen, onClose, onGenerate }) => {
  const [objective, setObjective] = useState('Perder peso');
  const [level, setLevel] = useState('Principiante');
  const [selectedTargets, setSelectedTargets] = useState<string[]>(['Pierna', 'Glúteo', 'Espalda']);
  const [restrictions, setRestrictions] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // reset form when closed
      setObjective('Perder peso');
      setLevel('Principiante');
      setSelectedTargets(['Pierna', 'Glúteo', 'Espalda']);
      setRestrictions('');
      setDaysPerWeek(3);
      setIsGenerating(false);
      setResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleTarget = (t: string) => {
    setSelectedTargets((s) => (s.includes(t) ? s.filter(x => x !== t) : [...s, t]));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);

    const payload: RoutinePayload = {
      objective,
      level,
      targets: selectedTargets,
      restrictions,
      daysPerWeek,
    };

    try {
      if (onGenerate) {
        const r = await onGenerate(payload);
        setResult(r as string | null);
      } else {
        // Call backend AI endpoint (server uses OPENAI_API_KEY)
        const base = import.meta.env.VITE_API_BASE_URL ?? '';
        // ensure no trailing slash
        const baseUrl = base.endsWith('/') ? base.slice(0, -1) : base;
        const url = `${baseUrl}/ai/generate-routine`;

        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          const t = await resp.text();
          throw new Error(`AI service error: ${resp.status} ${t}`);
        }

        const data = await resp.json();
        setResult(data?.routine || 'No se recibió respuesta de la IA.');
      }
    } catch (e: unknown) {
      // make the error printable without using `any`
      console.error(e);
      setResult('Hubo un error generando la rutina. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl mx-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-50">Crear rutina con IA</h3>
            <p className="text-sm text-slate-400">Describe tus preferencias y la IA generará una propuesta de rutina personalizada.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition">
            <X className="w-4 h-4 text-slate-200" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Objetivo del entrenamiento</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100" value={objective} onChange={(e) => setObjective(e.target.value)}>
              {OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Nivel del usuario</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100" value={level} onChange={(e) => setLevel(e.target.value)}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Días por semana</label>
              <input type="range" min={1} max={6} value={daysPerWeek} onChange={(e) => setDaysPerWeek(Number(e.target.value))} className="w-full" />
              <div className="text-sm text-slate-300 mt-1">{daysPerWeek} días / semana</div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Enfoque (selecciona uno o varios)</label>
            <div className="flex flex-wrap gap-2">
              {TARGETS.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTarget(t)}
                  className={`text-sm px-3 py-1.5 rounded-full transition ${selectedTargets.includes(t) ? 'bg-emerald-500 text-white shadow' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Restricciones (opcional)</label>
            <textarea value={restrictions} onChange={(e) => setRestrictions(e.target.value)} placeholder="Lesiones, equipo no disponible, etc." className="w-full min-h-[80px] bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"></textarea>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition">Cancelar</button>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`px-5 py-3 rounded-xl font-semibold transition ${isGenerating ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 text-white shadow-lg shadow-emerald-500/20'}`}
            >
              {isGenerating ? 'Generando...' : 'Generar rutina con IA'}
            </button>
          </div>

          {result && (
            <div className="mt-3 p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100">
              <h4 className="font-semibold mb-2">Resultado</h4>
              <p className="text-sm whitespace-pre-wrap">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRoutineAIFormModal;
