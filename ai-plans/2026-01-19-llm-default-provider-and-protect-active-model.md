# Task: Lock default provider + protect active model on LLM page

## Context

- Ticket/Request: “Make the first LLM in list default and NOT changeable. Model name take from config response. Make impossible deleting actual model.”
- Current implementation:
  - `/llm` is `pages/llm/ui/LlmPage.tsx`
  - LLM providers + models are managed via `features/llm-management`
  - Active config is managed via `entities/llm-config` (`GET/PUT /api/llm-config`)

## Objective

- **Provider**:
  - Automatically select the **first** provider returned by `GET /api/llms`
  - Make provider **not changeable** via UI (no switching)
- **Model**:
  - The displayed/selected model must be derived from the config response (`llm-config.model`).
  - Prevent deleting the **active model** (the model currently referenced by `llm-config.model`).

## Technical Approach

- Treat the “first provider” as the **default provider** (index `0` of providers list).
- Enforce locked provider selection in `features/llm-management`:
  - After `loadLlms()` succeeds, if no provider is selected, auto-`selectLlm(first.id)`.
  - Expose `defaultLlmId` in the store to simplify UI disabling and “protect default provider” decisions.
- In `pages/llm/ui/LlmPage.tsx`:
  - Disable provider `<Select />` to prevent changes (and optionally hide `allowClear`).
  - Keep adding providers allowed; but selection must remain locked to the first item.
- Active model protection:
  - Define `activeModelName = item?.model ?? null`.
  - Disable delete UI for any model whose `name === activeModelName`.
  - Also disable delete provider if it contains the active model (optional safety; confirm requirement).
- “Model name taken from config response”:
  - Ensure model selection label always reflects `item.model`.
  - If `item.model` is not present in the provider’s models list, show a single read-only option representing `item.model` (to avoid blank select).

## Implementation Steps

- [x] Step 0: Branch prep (required)
  - [x] Update `master`
  - [x] Create a new branch from updated `master`
- [x] Step 1: Update `features/llm-management` to enforce default provider selection + expose `defaultLlmId`
- [ ] Step 2: Update `pages/llm/ui/LlmPage.tsx`
  - Disable provider selection UI
  - Model select uses config model name as the source of truth for display
  - Disable delete button for active model
- [ ] Step 3: i18n (if new strings are needed)
- [ ] Step 4: Manual verification in browser
  - Provider is locked to first item
  - Model shows config model
  - Active model delete is disabled

## Files to Modify/Create

- `src/features/llm-management/model/llmManagementStore.ts` - default provider logic
- `src/pages/llm/ui/LlmPage.tsx` - provider lock + active model protection
- `src/shared/config/i18n/resources/en.ts` - if any new strings are added
- `src/shared/config/i18n/resources/ru.ts` - if any new strings are added

## Testing Strategy (manual)

- [ ] Load `/llm`: provider auto-selected to first in list and provider select is disabled.
- [ ] Attempt to change provider: impossible via UI.
- [ ] Model select displays config model name; if not in list, it still displays.
- [ ] Delete button for active model is disabled; other models remain deletable.

## Rollback Plan

- Revert commits created under this plan.

## Open Questions

- Does “NOT changeable” also mean the default provider is **not deletable**? (I can enforce this too if you confirm.)
- If config model belongs to a non-default provider, should we:
  - still lock to first provider and show config model as “external”, or
  - instead treat the provider owning that model as the default?
