// src/pages/HomePage.tsx
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="page-fade-in space-y-16 bg-white text-slate-900 dark:bg-[#020617] dark:text-slate-100 shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50">
      {/* ====================== HERO ====================== */}
      <section className="relative flex flex-col lg:flex-row items-center gap-10 pt-6 pb-16 lg:pt-8 lg:pb-24">
        {/* Glow / fondo suave */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 via-white to-white dark:from-transparent dark:via-slate-900/40 dark:to-slate-950" />
        <div className="absolute -top-20 -left-10 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-500/15" />
        <div className="absolute top-10 -right-10 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/15" />

        {/* Columna izquierda: texto */}
        <div className="flex-1 max-w-xl space-y-6">
          <div className="inline-flex items-center rounded-full bg-white/80 px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:text-sky-300 dark:ring-slate-700/70">
            🔥 Plataforma de gestión para gimnasios
          </div>

          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl dark:text-slate-50">
            Administra tu <span className="text-sky-500 dark:text-sky-400">gimnasio</span>, controla tus{" "}
            <span className="text-emerald-600 dark:text-emerald-400">miembros</span> y gestiona tus{" "}
            <span className="text-indigo-600 dark:text-indigo-400">clases</span> en un solo lugar.
          </h1>

          <p className="max-w-lg text-sm text-slate-600 dark:text-slate-300">
            FitPlanner Manager es la herramienta diseñada para que administradores y
            entrenadores lleven control total del gimnasio con una interfaz moderna,
            rápida y optimizada.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="btn-raise inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-sky-400"
            >
              Empezar ahora
            </Link>

            <Link
              to="/login"
              className="btn-raise inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-800 shadow hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-950/70 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              Ya tengo una cuenta
            </Link>
          </div>
        </div>

        {/* Columna derecha: imagen gym */}
        <div className="flex-1 flex justify-center">
          <div className="relative rounded-3xl overflow-hidden shadow-[0_0_45px_-12px_rgba(34,211,238,0.5)]">
            <img
              src="https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg"
              alt="Entrenamiento en gimnasio"
              className="w-[460px] h-[320px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* ====================== FEATURES ====================== */}
      <section className="space-y-10">
        <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-slate-100">
          Herramientas profesionales para tu gimnasio
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 transition hover:shadow-cyan-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-xl">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">Control de miembros</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Registra altas, bajas, membresías activas, vencimientos y asistencia en
              segundos.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 transition hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-xl">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">Agenda de clases</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Gestiona horarios, instructores, ocupación y sesiones diarias en tiempo real.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 transition hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-xl">
            <div className="text-4xl mb-3">📈</div>
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">Panel administrativo</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Visualiza métricas clave como ingresos, membresías activas y actividad diaria.
            </p>
          </div>
        </div>
      </section>

      {/* ====================== BLOQUE FINAL ====================== */}
      <section className="relative mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/799166/pexels-photo-799166.jpeg')] bg-cover bg-center opacity-10 dark:opacity-15" />
        <div className="relative px-6 py-12 md:px-10 md:py-14 lg:px-14 lg:py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
            Diseñado para gimnasios modernos
          </h2>
          <p className="max-w-2xl text-sm md:text-base text-slate-600 dark:text-slate-200">
            FitPlanner Manager fue creado como una herramienta profesional para
            administradores, entrenadores y centros deportivos que buscan orden,
            rendimiento y una interfaz que realmente facilite la gestión diaria.
          </p>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Controla tus miembros, monitorea ingresos, revisa ocupación de clases y
            mantén tu gimnasio funcionando al máximo rendimiento con una sola plataforma.
          </p>
        </div>
      </section>
    </div>
  );
}
