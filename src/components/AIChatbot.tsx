import { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface AIChatbotProps {
  className?: string;
  onSave?: (routine: any) => void;
}

const objectives = ['Hipertrofia', 'Fuerza', 'Pérdida de grasa', 'Resistencia', 'Tonificación'];
const levels = ['Principiante', 'Intermedio', 'Avanzado'];
const muscleGroups = ['Pierna', 'Glúteo', 'Espalda', 'Pecho', 'Bíceps', 'Tríceps', 'Hombro', 'Core'];

const AIChatbot = ({ className = '', onSave }: AIChatbotProps) => {
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
    await new Promise(resolve => setTimeout(resolve, 900));

    const exercisesPool: Record<string, string[]> = {
      Pierna: ['Sentadillas 4x8', 'Zancadas 3x12', 'Prensa 3x10'],
      Glúteo: ['Hip thrust 4x8', 'Puente de glúteo 3x12', 'Patada de glúteo 3x15'],
      Espalda: ['Remo con barra 4x6', 'Jalón al pecho 3x10', 'Peso muerto 3x6'],
      Pecho: ['Press banca 4x6', 'Press inclinado 3x8', 'Aperturas 3x12'],
      Bíceps: ['Curl barra 3x8', 'Curl martillo 3x10'],
      Tríceps: ['Fondos 3x8', 'Extensión tríceps 3x10'],
      Hombro: ['Press militar 4x6', 'Elevaciones laterales 3x12'],
      Core: ['Planchas 3x60s', 'Abdominales 3x15']
    };

    const dias: string[] = [];
    for (let d = 1; d <= daysPerWeek; d++) {
      const dayExercises: string[] = [];
      const primary = selectedGroups[(d - 1) % selectedGroups.length];
      const secondary = selectedGroups.length > 1 ? selectedGroups[d % selectedGroups.length] : null;
      const poolPrimary = exercisesPool[primary] || ['Ejercicio 1 3x10'];
      dayExercises.push(poolPrimary[(d - 1) % poolPrimary.length]);
      if (secondary) {
        const poolSecondary = exercisesPool[secondary] || ['Ejercicio 2 3x10'];
        dayExercises.push(poolSecondary[(d - 1) % poolSecondary.length]);
      }
      // asegurar 3 ejercicios
      if (dayExercises.length < 3) dayExercises.push(exercisesPool['Core'][0]);

      const dayText = `-- Día ${d} --\n${dayExercises.map((ex, i) => `${i + 1}) ${ex}`).join('\n')}`;
      dias.push(dayText);
    }

    const header = `Rutina generada:\nObjetivo: ${objective || 'No especificado'}\nNivel: ${level || 'No especificado'}\nDías/semana: ${daysPerWeek}\nEnfoque: ${selectedGroups.join(', ') || 'General'}\nRestricciones: ${restrictions || 'Ninguna'}\n`;

    const routine = `${header}\n${dias.join('\n\n')}`;

    setResult(routine);
    setIsGenerating(false);
  };

  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-lg overflow-auto max-h-[80vh] ${className} dark:bg-slate-900/95 dark:border-slate-800` }>
      <div className="p-6">
        <div className="mb-4">
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
            <>
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 whitespace-pre-wrap">
                {result}
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={() => {
                  if (!onSave) return;
                  const newRoutine = {
                    _id: `temp-${Date.now()}`,
                    name: `${objective || 'Rutina IA'} - ${level || 'General'}`,
                    frequency: `${daysPerWeek} días/semana`,
                    focus: selectedGroups.join(', '),
                    status: 'Activa',
                    diasPorSemana: daysPerWeek,
                    resumen: { objetivo: objective, nivel: level, enfoque: selectedGroups, restricciones: restrictions },
                    generatedText: result
                  };
                  onSave(newRoutine);
                }} className="py-2 px-4 rounded-xl bg-emerald-600 text-white font-semibold">Guardar rutina</button>
                <button onClick={() => { setResult(null); }} className="py-2 px-4 rounded-xl border">Cerrar vista IA</button>
              </div>
            </>
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
