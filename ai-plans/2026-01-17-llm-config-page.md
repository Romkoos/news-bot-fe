# Task: Add LLM config page (GET/PUT `/api/llm-config`)

## Context

- Ticket/Request: Create a new “LLM” page that displays and edits the backend LLM configuration.
- API:
  - GET `/api/llm-config`
  - PUT `/api/llm-config`
- DTO:
  - `LlmConfig` = `{ model: string; instructions: string; updatedAt: string }`

## Objective

Create a new route that allows viewing and updating the LLM configuration:

- **model**: select box
- **instructions**: textarea
- **updatedAt**: informational label

Must follow FSD boundaries, use i18n for all user-facing text, and support both light/dark themes (AntD tokens + CSS modules).

## Technical Approach

- Add a new domain slice `entities/llm-config`:
  - `types/` for `LlmConfig`
  - `api/` for `getLlmConfig()` + `updateLlmConfig()` using `shared/api/fetchJson`
  - `model/` Zustand store for loading/saving state with request cancellation via `AbortController`
- Add a new route/page slice `pages/llm` that:
  - reads entity store state (loading/error/data)
  - renders Ant Design form fields (Select + TextArea) and an `updatedAt` label
  - triggers load on mount and PUT on submit
- Wire route `'/llm'` in `app/router/router.tsx` and add a nav item in `widgets/layout`.
- Add a Vite dev proxy entry for `'/llm-config'` so local dev can call the backend without CORS issues (consistent with existing `/digests` proxy pattern).
- Add required i18n keys to both `en` and `ru` resources.

Notes:

- Client calls will use `getApiBaseUrl()` (which already includes `/api` in defaults). That means the client-facing path should be `'/llm-config'`, producing full backend URL `.../api/llm-config`.
- For now, the **model** Select has exactly **one allowed option**. We will render the Select with a single option derived from the loaded config (the current `model`), so we don't hardcode backend model names in the UI.

## Implementation Steps

- [x] Step 1: Add `entities/llm-config` (types + API + store)
- [x] Step 2: Add `pages/llm` UI (form, loading/error states, save action)
- [x] Step 3: Wire routing + navigation (`app/router/router.tsx`, `widgets/layout`)
- [x] Step 4: Add i18n strings (EN/RU) for nav + page fields/buttons/messages
- [x] Step 5: Add Vite dev proxy for `'/llm-config'`
- [x] Step 6: Manual verification in browser (load, edit, save, error handling)

## Completed

- Date completed: 2026-01-18
- Deviations:
  - Switched LLM config API calls to use relative `'/llm-config'` to consistently leverage Vite proxy and avoid CORS in dev.
  - Added a `/api` proxy briefly during investigation, but final solution relies on `/llm-config` proxy for this page.
- Follow-ups:
  - Consider aligning other entity APIs to the same relative+proxy approach for consistency.

## Files to Modify/Create

- `src/entities/llm-config/index.ts` - public API exports
- `src/entities/llm-config/types/LlmConfig.ts` - entity type
- `src/entities/llm-config/types/index.ts` - types segment public API
- `src/entities/llm-config/api/llmConfigApi.ts` - GET/PUT functions
- `src/entities/llm-config/api/index.ts` - api segment public API
- `src/entities/llm-config/model/llmConfigStore.ts` - Zustand store (load/save state + abort)
- `src/entities/llm-config/model/index.ts` - model segment public API
- `src/pages/llm/index.ts` - public API exports
- `src/pages/llm/ui/LlmPage.tsx` - route UI
- `src/app/router/router.tsx` - add `llm` route
- `src/widgets/layout/ui/AppLayout.tsx` - add nav item + selectedKey mapping
- `src/shared/config/i18n/resources/en.ts` - add `nav.llm` + `llmConfig.*`
- `src/shared/config/i18n/resources/ru.ts` - add `nav.llm` + `llmConfig.*`
- `vite.config.ts` - add dev proxy for `'/llm-config'`
- (Optional) `docs/Overview.md` - mention new LLM page route (only if we want docs to list it)

## Testing Strategy (manual)

- [ ] Navigate to `/llm`:
  - shows loading spinner initially
  - renders form with values from GET
  - `updatedAt` shows formatted date/time (or `common.notAvailable` when invalid)
- [ ] Edit `model` and `instructions`, click Save:
  - button shows loading / disabled during request
  - success shows a toast (AntD `message.success`) and updates `updatedAt`/form state
- [ ] Simulate backend error (wrong base URL / offline):
  - shows an error state with retry

## Rollback Plan

- Revert the commit(s) created under this plan (or `git revert` them in reverse order).
- Remove the `/llm` route and `entities/llm-config` slice; restore `vite.config.ts` proxy and i18n resources to previous state.

## Open Questions

- None (confirmed):
  - **model**: single allowed option for now
  - **PUT**: returns the updated `LlmConfig` (`updatedAt` set to “now” in ISO format)
