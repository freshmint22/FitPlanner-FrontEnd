// src/components/ui/GlobalAnimations.tsx
export function GlobalAnimations() {
  return (
    <style>
      {`
        /* ========= PAGE FADE-IN (todas las vistas) ========= */
        @keyframes pageFadeInFix {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.96);
          }
          60% {
            opacity: 1;
            transform: translateY(0px) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
        }

        .page-fade-in {
          animation: pageFadeInFix 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0s 1 forwards !important;
          will-change: transform, opacity;
        }

        /* ========= CARD-POP (Kpis, secciones, etc.) ========= */
        @keyframes softPopFix {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.9);
          }
          70% {
            opacity: 1;
            transform: translateY(-4px) scale(1.03);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
        }

        .card-pop {
          animation: softPopFix 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0s 1 forwards !important;
          will-change: transform, opacity;
        }
      `}
    </style>
  );
}
