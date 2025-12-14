/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Fondo general
        "fp-bg": "#020617", // slate-950 muy oscuro
        "fp-bg-soft": "#050b1f",

        // Superficies / cards
        "fp-surface": "#020617",
        "fp-surface-soft": "#02081a",

        // Gradientes principales
        "fp-primary": "#4f46e5", // indigo-600
        "fp-primary-soft": "#6366f1",
        "fp-accent": "#22c55e", // verde
        "fp-accent-soft": "#16a34a",

        // Texto
        "fp-text-main": "#e5e7eb",
        "fp-text-muted": "#9ca3af",

        // Estados
        "fp-success": "#22c55e",
        "fp-warning": "#facc15",
        "fp-danger": "#f97373",
      },
      boxShadow: {
        "fp-card": "0 20px 40px rgba(15,23,42,0.9)",
        "fp-soft": "0 18px 35px rgba(15,23,42,0.75)",
      },
      borderRadius: {
        "fp-xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
