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
      className={`inline-flex items-center gap-3 py-3 px-5 rounded-xl font-semibold shadow-lg transition-transform transform-gpu hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 ${className}`}
      aria-label="Crear rutina con IA"
      style={{
        background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 45%, #10b981 100%)',
        color: 'white',
      }}
    >
      <span className="relative inline-flex items-center gap-2">
        <span className="-ml-1 flex items-center justify-center w-7 h-7 rounded-lg bg-white/10">
          <Bot className="w-4 h-4 text-white" />
        </span>
        <span className="text-sm">Crear rutina con IA</span>
      </span>

      <span
        className="ml-2 w-3 h-3 rounded-full pulse"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))',
          boxShadow: '0 6px 18px rgba(16,185,129,0.18)',
        }}
      />

      <style>{`
        .pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.35); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </button>
  );
};

export default CreateRoutineWithAIButton;
