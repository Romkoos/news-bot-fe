# Task: LLM providers + models management on LLM page

## Context

- Ticket/Request: “On the LLM page, add LLM provider select + model select with add/delete. Models must be linked to selected LLM; deleting an LLM must delete its linked models.”
- Current state:
  - The `/llm` route renders `pages/llm/ui/LlmPage.tsx`.
  - It currently edits a single backend config via `entities/llm-config` (GET/PUT `'/llm-config'`).
- New APIs (backend):
  - Get LLM providers — GET `/api/llms`
  - Create LLM provider — POST `/api/llms`
  - Update LLM provider — PUT `/api/llms/:id`
  - Delete LLM provider — DELETE `/api/llms/:id`
  - Get models by LLM ID — GET `/api/llms/:id/models`
  - Create model — POST `/api/llm-models`
  - Update model — PUT `/api/llm-models/:id`
  - Delete model — DELETE `/api/llm-models/:id`
- DTOs:
  - `LlmDto` = `{ id: number; name: string; alias: string }`
  - `LlmModelDto` = `{ id: number; llm_id: number; name: string }`

## Objective

Enhance the existing `/llm` page to:

- Add an **LLM provider select** with **add** and **delete** capabilities.
- Change the **model** field to a select that supports **add** and **delete** models.
- Ensure **models list is always scoped to the selected LLM provider**.
- Implement **cascading delete**: deleting a provider must delete its linked models first.
- When provider selection changes, **models list updates immediately** and selected model is cleared if not available.
- Preserve existing behavior for the rest of the page (LLM instructions + saving config) unless backend requires otherwise.

## Technical Approach

### API path conventions (dev proxy)

This frontend uses **relative paths without `/api`** and relies on Vite proxy in dev:

- Client will call `'/llms'`, `'/llms/:id/models'`, and `'/llm-models'`.
- Vite proxy targets an `apiBaseUrl` that already includes `/api`, so the backend receives `/api/llms` etc.

### FSD slices

- Add **entity slices**:
  - `entities/llm` for provider DTO types + CRUD API functions.
  - `entities/llm-model` for model DTO types + CRUD API functions + “get by LLM ID”.
- Add a **feature slice** `features/llm-management` to orchestrate:
  - loading providers
  - selecting provider and loading its models
  - creating/deleting providers
  - creating/deleting models
  - **cascading delete** (delete models, then provider)

Rationale: cascade delete needs to coordinate both entities; putting that logic in a feature respects “UI vs business logic” and avoids forbidden cross-entity imports.

### UI behavior (Ant Design Select)

- Provider Select:
  - Dropdown renders the options plus an inline “Add provider” mini-form (name + alias).
  - Each option includes a small delete action (with event propagation prevented so it won’t select on delete).
- Model Select:
  - Dropdown renders model options for the selected provider plus an inline “Add model” input.
  - Each model option includes a delete action.
  - Disabled until a provider is selected.
- Saving config:
  - Form “model” value will be the selected model’s **name** (since current config expects `model: string`).
  - On load, we’ll attempt to resolve the provider/model selection by finding a model whose `name` matches the loaded config model.

### Error handling

- Show user-friendly toasts via AntD `message.success` / `message.error`.
- For destructive actions, use confirmation (AntD `Popconfirm`) to avoid accidental deletion.
- Treat network failures as recoverable; keep UI responsive and re-load after success.

## Implementation Steps

- [ ] Step 0: Branch prep (required)
  - [x] Update `master`
  - [x] Create a new branch from updated `master`
- [x] Step 1: Add dev proxy routes for new endpoints
  - Add `'/llms'` and `'/llm-models'` to `vite.config.ts` proxy.
- [x] Step 2: Create `entities/llm` (types + api + public API)
  - `getLlms()`, `createLlm()`, `updateLlm()`, `deleteLlm()`
  - Runtime DTO shape validation similar to `entities/llm-config/api`.
- [x] Step 3: Create `entities/llm-model` (types + api + public API)
  - `getModelsByLlmId(llmId)`, `createLlmModel()`, `updateLlmModel()`, `deleteLlmModel()`
  - Runtime DTO shape validation.
- [x] Step 4: Create `features/llm-management` store
  - State: providers list + selected provider id, models list + selected model id, loading/errors for each operation.
  - Actions: loadProviders, selectProvider (loads models), create/delete provider (with cascade), create/delete model, reload models.
- [x] Step 5: Update `/llm` page UI to use the new selects
  - Provider select (add/delete).
  - Model select (add/delete; linked to provider).
  - Keep existing instructions field and “Save” that calls `entities/llm-config` update.
  - Sync logic:
    - On mount: load config + load providers
    - After provider+models are known: set provider/model selection to match config’s `model` (best-effort).
    - When provider changes: refresh models, clear model in form if not available.
- [x] Step 6: i18n updates (EN/RU)
  - Add keys for provider/model fields and actions (add/delete/confirmations/messages).
- [x] Step 7: Manual verification
  - Providers: list/add/delete (including cascade).
  - Models: list/add/delete scoped to provider.
  - Provider change updates models list and selection.
  - Config save still works (model name + instructions).

## Completed

- Date completed: 2026-01-19
- Deviations:
  - Backend expects `llmId` (camelCase) for model creation payload (`POST /api/llm-models`), while model DTO uses `llm_id` in responses.
  - Backend returns `204 No Content` for some successful DELETE operations; `shared/api/fetchJson` was updated to treat HTTP 204 as a valid “no body” success.
  - Added a UI sync fix so the model selection is cleared whenever the selected provider changes (including when provider selection is set programmatically after creating a provider).

## Files to Modify/Create

- `vite.config.ts` - add proxy entries for `'/llms'` and `'/llm-models'`
- `src/entities/llm/index.ts` - entity public API
- `src/entities/llm/types/LlmDto.ts` - DTO type
- `src/entities/llm/types/index.ts` - types public API
- `src/entities/llm/api/llmApi.ts` - CRUD functions
- `src/entities/llm/api/index.ts` - api public API
- `src/entities/llm-model/index.ts` - entity public API
- `src/entities/llm-model/types/LlmModelDto.ts` - DTO type
- `src/entities/llm-model/types/index.ts` - types public API
- `src/entities/llm-model/api/llmModelApi.ts` - CRUD + list-by-llm
- `src/entities/llm-model/api/index.ts` - api public API
- `src/features/llm-management/index.ts` - feature public API
- `src/features/llm-management/model/llmManagementStore.ts` - Zustand store
- `src/features/llm-management/model/index.ts` - model public API
- `src/pages/llm/ui/LlmPage.tsx` - update UI and wiring
- `src/shared/config/i18n/resources/en.ts` - new keys
- `src/shared/config/i18n/resources/ru.ts` - new keys

## Testing Strategy (manual)

- [ ] Navigate to `/llm`: providers load; config loads; model select reflects selected provider models.
- [ ] Add provider: provider appears in select immediately and can be selected.
- [ ] Delete provider with models:
  - confirmation appears
  - models are deleted first, then provider
  - provider disappears; model list clears if it was selected
- [ ] Add model under selected provider: model appears; can be selected; then Save updates config model.
- [ ] Delete model: model disappears; if selected, selection clears.
- [ ] Change provider: models list updates; model selection resets if no longer valid.
- [ ] Verify RU/EN strings and light/dark theme visuals remain OK.

## Rollback Plan

- Revert the commits created under this plan (or `git revert` them in reverse order).
- Remove newly added slices (`entities/llm`, `entities/llm-model`, `features/llm-management`) and restore `/llm` page and `vite.config.ts` proxy.

## Open Questions

- Does backend guarantee `llm-config.model` always matches an existing `LlmModelDto.name`? If not, we’ll keep a fallback “unknown model” option but it won’t be linked to a provider.
- What are the exact request bodies for create/update provider/model endpoints? (We will start with `{ name, alias }` and `{ llm_id, name }` per DTOs and adjust if backend differs.)
