import React from 'react';
import { Bot } from 'lucide-react';

interface Props {
  onClick?: () => void;
  className?: string;
}

const CreateRoutineWithAIButton: React.FC<Props> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-3 py-4 px-6 rounded-2xl font-semibold text-sm shadow-xl transition-transform transform-gpu hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 ${className}`}
      aria-label="CreaRutina con IA"
      style={{
        background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 45%, #10b981 100%)',
        color: 'white',
      }}
    >
      <span className="relative inline-flex items-center gap-3">
        <span className="-ml-1 flex items-center justify-center w-9 h-9 rounded-xl bg-white/10">
          <Bot className="w-5 h-5 text-white" />
        </span>
        <span className="text-sm">Crear rutina con IA</span>
      </span>

      <span
        className="ml-3 w-3 h-3 rounded-full pulse"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))',
          boxShadow: '0 8px 24px rgba(16,185,129,0.2)'
        }}
      />

      <style>{`
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.35); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </button>
  );
};

export default CreateRoutineWithAIButton;
