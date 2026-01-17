# Task: Vite + React + TypeScript project scaffold with FSD (Ant Design, Zustand, i18n/theme)

## Context

- Ticket/Request: Create a new React + TypeScript project using Vite with strict Feature-Sliced Design (FSD), Ant Design v5, react-router-dom routing, Zustand state, fetch-based data layer (no axios/react-query), ESLint/Prettier/Husky/lint-staged, light/dark theme + RU/EN i18n persisted to localStorage, and a Dashboard page fetching digests from an API base URL in `.env`.
- Notes: `docs/` folder is not present in this repo yet.

## Objective

Create a production-grade Vite app implementing FSD layers (`app`, `pages`, `widgets`, `features`, `entities`, `shared`) with alias-only imports and strict public APIs (`index.ts`) for every slice. Implement dashboard digests list with loading/error/empty states and retry.

## Technical Approach

- Use `npm create vite@latest` (React + TS) and then enforce FSD structure under `src/`.
- Configure **path aliases** at both TypeScript (`tsconfig.json`) and Vite (`vite.config.ts`) levels for all FSD layers.
- Import policy:
  - Alias imports are required **across slices/layers** (e.g., `pages/*` importing `entities/*`).
  - Relative imports are allowed **inside the same slice boundary** (e.g., within `entities/digest/*`).
- Centralize providers in `src/app/providers`:
  - Router provider (react-router-dom)
  - Ant Design `ConfigProvider` with theme algorithm controlled by feature state
  - i18n provider (react-i18next) initialized from `shared/config/i18n`
- Persist theme and language via `shared/lib/storage` wrappers over `localStorage` (safe + typed).
- Data layer:
  - `shared/api` exposes a small typed `fetchJson` wrapper with base URL from `import.meta.env.API_BASE_URL` (or `VITE_API_BASE_URL`).
  - `entities/digest/api` calls `shared/api` and maps raw JSON to `DigestDto[]` (basic runtime narrowing and defensive parsing).
  - `entities/digest/model` uses Zustand for cache + status (`idle/loading/success/error`) and exposes `useDigestStore` actions and selectors via slice public API.
- UI composition:
  - `widgets/layout` provides app shell (header/nav + content container).
  - `entities/digest/ui/DigestList.tsx` renders list UI as a presentational component (props in, callbacks out).
  - `pages/dashboard/ui/DashboardPage.tsx` acts as the container: calls `loadDigests()` on mount, renders loading/error/empty states, provides retry, and passes `items` into `DigestList`.
  - `pages/dashboard` composes layout + dashboard UI; no direct calls to `shared/api` from pages.
- Tooling:
  - ESLint + Prettier with TS + React rules, import/order + alias resolution.
  - Husky + lint-staged to run `eslint` + `prettier` on staged files.

## Implementation Steps

- [x] Step 1: Scaffold Vite React+TS project and base configs (`package.json`, `tsconfig*`, `vite.config.ts`, `index.html` pointing to `src/app/main.tsx`).
- [x] Step 2: Install and configure dependencies:
  - Ant Design v5
  - react-router-dom
  - zustand
  - i18next + react-i18next
  - ESLint + Prettier + lint-staged + husky (and required plugins)
- [x] Step 3: Create FSD directory structure with slice public APIs (`index.ts`) and alias-only imports.
- [x] Step 4: Implement `shared/lib/storage` typed helpers and `shared/config/i18n` initialization (RU/EN) with persistence.
- [x] Step 5: Implement theme switching feature (`features/theme`) with persistence + AntD theme algorithm integration.
- [x] Step 6: Implement language switching feature (`features/language`) with persistence + i18n integration.
- [x] Step 7: Implement API base config (`.env`, `shared/api/fetchJson`) and `entities/digest` (DTO type, API, Zustand cache/status).
- [x] Step 8: Implement UI:
  - `widgets/layout` app shell
  - `entities/digest/ui/DigestList.tsx` + CSS Modules (presentational)
  - `pages/dashboard/ui/DashboardPage.tsx` container with loading/error/empty and retry
  - Pages: `dashboard` (default route), `filters` (placeholder), `settings` (theme/language controls)
- [x] Step 9: Add docs baseline under `docs/` (architecture + runtime flows) and update root `README.md` with run commands and checklist.

## Files to Modify/Create

- `package.json` - scripts (dev/build/preview/lint/format), deps/devDeps, husky/prepare
- `vite.config.ts` - aliases, base Vite config
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` - strict TS + path aliases
- `.env` - `API_BASE_URL=http://35.237.12.130:8080` (user can change)
- `.eslintrc.*` or `eslint.config.*` - ESLint config
- `.prettierrc` / `prettier.config.*` - Prettier config
- `.lintstagedrc.*` - lint-staged config
- `.husky/pre-commit` - run lint-staged
- `index.html` - entry points to `src/app/main.tsx`
- `src/app/main.tsx` - app entry
- `src/app/providers/*` - providers composition
- `src/app/router/*` - route definitions
- `src/pages/dashboard/*` - dashboard page composition
- `src/pages/filters/*` - placeholder page
- `src/pages/settings/*` - settings page composition
- `src/widgets/layout/*` - layout shell UI (CSS Modules)
- `src/entities/digest/*` - DTO type, api, model store, UI (`DigestList`), public API
- `src/shared/api/*` - `fetchJson` and env base URL
- `src/shared/config/i18n/*` - i18n setup + resources
- `src/shared/lib/storage/*` - typed localStorage helpers
- `src/shared/ui/*` - small reusable UI bits if needed (e.g., `PageTitle`, `AppErrorState`)
- `docs/README.md` - docs table of contents
- `docs/Overview.md` - high-level architecture + runtime flow pointers

## Testing Strategy (if needed)

- [ ] Manual run: `npm i`, `npm run dev`, verify routing and settings persistence.
- [ ] Dashboard: verify loading state, empty state, error state (disable network), retry success.
- [ ] Verify localStorage persistence for theme and language across reload.
- [ ] `npm run lint` and `npm run build` pass.

## Rollback Plan

- Delete generated project files and revert to the previous commit state (this repo currently only contains `README.md`).

## Open Questions

- What is the **exact response shape** of `GET /digests`? (Assumed `DigestDto[]`; if it’s `{ data: DigestDto[] }` or similar, we’ll adjust mapping accordingly.)
- Do you want navigation in `widgets/layout` as AntD `Menu` with icons, or a minimal text-only nav for now?

## Completed

- Date completed: 2026-01-17
- Deviations:
  - `.env` files could not be created/edited in this environment; app supports `API_BASE_URL`, and README documents creating `.env` locally.
  - Added a Vite dev proxy for `/digests` to work around backend CORS during local development.
  - Digest UI moved from table to card-based layout, plus mobile-first hamburger navigation (see related plan docs).
- Follow-ups:
  - Consider code-splitting if bundle size warnings matter for your target (current build warns on chunk size).
