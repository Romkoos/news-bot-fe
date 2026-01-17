# news-bot-fe

## Setup

```bash
npm install
npm run dev
```

Local: `http://localhost:5173/`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm run format`

## Environment

This app reads the API base URL from:

- `API_BASE_URL` (preferred)
- `VITE_API_BASE_URL` (fallback)

Note: in this environment `.env` files are blocked; create `.env` locally if needed:

```bash
API_BASE_URL=http://35.237.12.130:8080
```

## Architecture (FSD)

- **Entry**: `src/app/main.tsx`
- **Providers**: `src/app/providers/AppProvider.tsx` (AntD theme), `src/app/router/*` (routes)
- **Pages**: `src/pages/*`
- **Widgets**: `src/widgets/layout`
- **Features**: `src/features/theme`, `src/features/language`
- **Entities**: `src/entities/digest` (types/api/model/ui)
- **Shared**: `src/shared/api`, `src/shared/config/i18n`, `src/shared/lib/*`

## FSD compliance checklist

- [x] Layers: `app/pages/widgets/features/entities/shared`
- [x] Slice public APIs via `index.ts`
- [x] Alias imports across slices/layers; relative imports allowed within a slice
- [x] Pages don’t call `shared/api` directly (only via `entities/*/api`)
- [x] Theme and language persisted via typed `shared/lib/storage`
- [x] CSS Modules for custom styling
- [x] AntD v5 + react-router-dom + Zustand + fetch-based data layer

## Docs

See `docs/README.md`.
