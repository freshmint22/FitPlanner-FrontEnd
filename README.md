# FitPlanner Frontend

[![CI](https://github.com/freshmint22/FitPlanner-FrontEnd/actions/workflows/ci.yml/badge.svg)](https://github.com/freshmint22/FitPlanner-FrontEnd/actions/workflows/ci.yml)
[![CD](https://github.com/freshmint22/FitPlanner-FrontEnd/actions/workflows/cd.yml/badge.svg)](https://github.com/freshmint22/FitPlanner-FrontEnd/actions/workflows/cd.yml)
[![codecov](https://codecov.io/gh/freshmint22/FitPlanner-FrontEnd/branch/main/graph/badge.svg)](https://codecov.io/gh/freshmint22/FitPlanner-FrontEnd)

## Descripción
Frontend de FitPlanner, construido con React y Vite.

## Instalación
1. Clona el repo: `git clone https://github.com/freshmint22/FitPlanner-FrontEnd.git`
2. Instala dependencias: `npm install`
3. Corre en desarrollo: `npm run dev`

## Scripts
- `npm run dev`: Inicia en modo desarrollo
- `npm run build`: Construye para producción
- `npm run preview`: Previsualiza build
- `npm run test`: Ejecuta tests con cobertura
- `npm run lint`: Linta el código

## CI/CD
- **CI**: Se ejecuta en push/PR a `main`/`develop`. Incluye lint, tests y build.
- **CD**: Se ejecuta en push a `main` o releases. Despliega a GitHub Pages.

## Contribución
1. Crea una rama `feature/nombre`
2. Haz commits convencionales
3. Abre PR con code review
