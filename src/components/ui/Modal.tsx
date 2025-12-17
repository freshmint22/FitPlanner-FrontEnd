// src/components/ui/Modal.tsx
import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

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
    if (isOpen) {
      setIsMounted(true);
      setAnimationClass('modal-animate-in');
    } else if (isMounted) {
      setAnimationClass('modal-animate-out');
      const timeout = setTimeout(() => {
        setIsMounted(false);
      }, 240); // coincide con modalOut (0.24s)

      return () => clearTimeout(timeout);
    }
  }, [isOpen, isMounted]);

  if (!isMounted) return null;

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 ${
          isOpen ? 'overlay-animate-in' : 'overlay-animate-out'
        }`}
        onClick={onClose}
      />

      {/* Contenedor modal */}
      <div
        className={`relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-xl shadow-slate-200/80 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-950/90 dark:shadow-black/50 ${animationClass} max-h-[85vh] overflow-y-auto`}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
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
            className="btn-raise rounded-full border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="text-sm text-slate-900 dark:text-slate-100">
          {children}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
}
