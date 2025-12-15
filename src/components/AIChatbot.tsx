import { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface AIChatbotProps {
  className?: string;
  onBack?: () => void;
}

const objectives = ['Hipertrofia', 'Fuerza', 'Pérdida de grasa', 'Resistencia', 'Tonificación'];
const levels = ['Principiante', 'Intermedio', 'Avanzado'];
const muscleGroups = ['Pierna', 'Glúteo', 'Espalda', 'Pecho', 'Bíceps', 'Tríceps', 'Hombro', 'Core'];

const AIChatbot = ({ className = '', onBack }: AIChatbotProps) => {
  const [objective, setObjective] = useState('');
  const [level, setLevel] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>(['Pierna', 'Glúteo', 'Espalda']);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [restrictions, setRestrictions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const toggleGroup = (g: string) => {
    setSelectedGroups(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const handleGenerate = async () => {
    setResult(null);
    setIsGenerating(true);
    // Simula llamada a la API de IA
    await new Promise(resolve => setTimeout(resolve, 1200));

    const routine = `Rutina generada:
Objetivo: ${objective || 'No especificado'}
Nivel: ${level || 'No especificado'}
Días/semana: ${daysPerWeek}
Enfoque: ${selectedGroups.join(', ') || 'General'}
Restricciones: ${restrictions || 'Ninguna'}

-- Ejemplo de sesión (día 1) --
1) Sentadillas 4x8
2) Peso muerto 4x6
3) Zancadas 3x12
4) Abdominales 3x15`;

    setResult(routine);
    setIsGenerating(false);
  };

  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-lg overflow-auto max-h-[80vh] ${className} dark:bg-slate-900/95 dark:border-slate-800` }>
      <div className="p-6">
        <div className="mb-4 flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
              ← Volver
            </button>
          )}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Crear rutina con IA</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-2">Objetivo del entrenamiento</label>
            <select value={objective} onChange={e => setObjective(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
              <option value="">Selecciona objetivo</option>
              {objectives.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-2">Nivel del usuario</label>
            <select value={level} onChange={e => setLevel(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
              <option value="">Selecciona nivel</option>
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-2">Días por semana</label>
            <input type="range" min={1} max={6} value={daysPerWeek} onChange={e => setDaysPerWeek(Number(e.target.value))} className="w-full" />
            <div className="text-sm text-slate-400 mt-1">{daysPerWeek} días / semana</div>
          </div>

          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-2">Enfoque / Grupos musculares</label>
            <div className="flex flex-wrap gap-2">
              {muscleGroups.map(g => (
                <button key={g} onClick={() => toggleGroup(g)} className={`text-sm px-3 py-2 rounded-full border ${selectedGroups.includes(g) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-850 text-slate-200 border-slate-700'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-2">Restricciones (opcional)</label>
            <input value={restrictions} onChange={e => setRestrictions(e.target.value)} placeholder="Lesiones, preferencias, horarios..." className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100" />
          </div>

          <div className="mt-4">
            <button onClick={handleGenerate} disabled={isGenerating} className={`w-full py-3 rounded-xl text-white font-semibold ${isGenerating ? 'bg-slate-700' : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 shadow-lg shadow-emerald-500/20'}`}>
              {isGenerating ? (<span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Generando...</span>) : 'Generar rutina con IA'}
            </button>
          </div>

          {result && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
              {result}
            </div>
          )}

          <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-blue-900/6 border border-blue-800/20">
            <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400">La rutina generada por IA es una sugerencia. Revisa y adapta según tus necesidades y condiciones médicas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
