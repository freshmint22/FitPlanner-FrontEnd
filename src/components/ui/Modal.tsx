// src/components/ui/Modal.tsx
import { useEffect, useState, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: ModalProps) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [animationClass, setAnimationClass] =
    useState<'modal-animate-in' | 'modal-animate-out'>('modal-animate-in');

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  // Animación de entrada/salida
  useEffect(() => {
    let mountTimer: number | undefined;
    if (isOpen) {
      // Evita setState síncrono dentro del efecto — usar microtask
      mountTimer = window.setTimeout(() => {
        setIsMounted(true);
        setAnimationClass('modal-animate-in');
      }, 0);
    } else if (isMounted) {
      // Evitamos setState síncrono dentro del efecto
      const animTimer = window.setTimeout(() => {
        setAnimationClass('modal-animate-out');
      }, 0);

      const timeout = setTimeout(() => {
        setIsMounted(false);
      }, 240); // coincide con modalOut (0.24s)

      return () => {
        clearTimeout(animTimer);
        clearTimeout(timeout);
      };
    }

    return () => {
      if (mountTimer) clearTimeout(mountTimer);
    };
  }, [isOpen, isMounted]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 ${
          isOpen ? 'overlay-animate-in' : 'overlay-animate-out'
        }`}
        onClick={onClose}
      />

      {/* Contenedor modal */}
      <div
        className={`relative z-10 w-full max-w-md rounded-3xl border border-slate-700/70 bg-slate-950/90 px-5 py-4 shadow-xl shadow-black/50 backdrop-blur-md ${animationClass}`}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="text-sm font-semibold text-slate-50">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-slate-400">
                {description}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="btn-raise rounded-full bg-slate-900/80 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="text-sm text-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
}
