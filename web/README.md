# LookingProf — frontend (Next.js)

App Router + TypeScript + Tailwind. Reemplaza el CRA de `lookinprof/` para desarrollo local.

## Arranque

1. El API Spring Boot tiene que estar en `http://localhost:8080`.
2. Copiá las variables:

```bash
cp .env.example .env.local
```

3. Instalá y levantá el front:

```bash
npm install
npm run dev
```

Queda en http://localhost:3000.

## Rutas

| Ruta | Qué hace |
|---|---|
| `/` | Home + profesionales destacados |
| `/profesionales` | Búsqueda con filtros en la URL |
| `/profesional/[id]` | Ficha pública |
| `/ingresar` `/registro` | Auth JWT |
| `/cuenta/perfil` | Editar perfil (requiere sesión) |
| `/soporte` | Formulario de contacto |

El JWT se guarda en `localStorage` (igual que el CRA). El contacto (teléfono/mail) solo se pide al API si hay sesión.
