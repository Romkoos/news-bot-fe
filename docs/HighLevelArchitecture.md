# High Level Architecture

## Purpose / scope

This document describes the runtime architecture of the frontend at a system level: which subsystems exist, how requests flow through the app, and where to make changes safely while respecting Feature-Sliced Design (FSD).

## Key principles (FSD + boundaries)

- **Layers**: `app → pages → widgets → features → entities → shared` (dependencies only flow downward).
- **Slice public APIs**: external imports go through slice `index.ts`.
- **UI vs logic**: entity UI is presentational; page containers orchestrate loading/state.
- **Data access**: pages do **not** call `shared/api` directly; they use `entities/*/api` (or feature APIs where applicable).

## Runtime composition

### App bootstrap

- **Entry**: `src/app/main.tsx`
- **Composition root**: `src/app/App.tsx`
- **Global providers**:
  - AntD theming: `src/app/providers/AppProvider.tsx` uses `features/theme` state to pick AntD algorithm.
  - i18n init: `shared/config/i18n/initI18n()` is called during bootstrap; `react.useSuspense=false`.

### Routing

- **Router**: `react-router-dom` via `RouterProvider` in `src/app/App.tsx`.
- **Route config**: `src/app/router/router.tsx`
- **Shell layout**: `widgets/layout` provides `AppLayout` with a mobile-first header and a Drawer menu.

### Data flow (Digests)

1. `pages/dashboard/ui/DashboardPage.tsx` mounts.
2. It calls `entities/digest` store `loadDigests()` (Zustand).
3. Store calls `entities/digest/api/fetchDigests()`.
4. Entity API uses `shared/api/fetchJson()`:
   - In dev, `/digests` is proxied by Vite to avoid CORS.
   - In prod, `API_BASE_URL`/`VITE_API_BASE_URL` is used.
5. Page renders states:
   - loading / error (+ retry) / empty
   - success: `entities/digest/ui/DigestCardList`

### Rendering rules (Digest content)

- **Text decoding**: `shared/lib/text/unescapeText()` decodes escaped sequences and removes Telegram MarkdownV2 escape backslashes.
- **Line breaks**: preserved with CSS `white-space: pre-wrap`.
- **Links**: `shared/lib/text/parseMarkdownLinks()` turns `[label](https://...)` into safe clickable anchors (http/https only).
- **Dates**: `shared/lib/datetime/formatDateTime()` formats as `HH:mm dd.mm.yyyy` (local time).

## Where it lives (entry points)

- **Theme**: `features/theme/*`
- **Language**: `features/language/*` + `shared/config/i18n/*`
- **API client**: `shared/api/*`
- **Digest entity**: `entities/digest/*`
- **Dashboard page**: `pages/dashboard/*`
- **Layout**: `widgets/layout/*`

## Extension points (“where to change this”)

- **Add a new route/page**: add a page slice under `pages/<name>`, export it via `pages/<name>/index.ts`, and wire it in `app/router/router.tsx`.
- **Add a new entity**: create `entities/<entity>` with `types/`, `api/`, `model/`, `ui/`, and re-export via `entities/<entity>/index.ts`.
- **Add a new user action**: create `features/<action>` with `model/` + `ui/`, keep business state in `model/`.
- **Change API base URL behavior**: update `shared/api/env.ts` and (for dev) `vite.config.ts` proxy settings.
- **Change digest presentation**: edit only `entities/digest/ui/*` (presentational) and keep orchestration in `pages/dashboard/ui/*`.

## Failure modes & mitigations

- **CORS in dev**: fixed by Vite proxy for `/digests`.
- **Invalid DTO shape**: entity API validates payload and will surface an error state (page shows retry).
- **Timezone ambiguity**: date formatting uses local time by default; switch to UTC in `shared/lib/datetime/formatDateTime.ts` if required.
