# Task: Digest info dialog with source news items

## Context

- Ticket/Request: Clicking the info-circle icon on a digest should open a bottom-anchored dialog (bottom sheet) with digest details and fetched source news items.
- Constraints:
  - Dialog must be anchored to bottom and lock page scroll while open.
  - Dialog height must not exceed 2/3 of the viewport; overflow should scroll inside the items container, not the page.
  - Digest details must include **only**: id, publication date, model name.
  - Digest field `source_item_ids_json` contains a JSON array of numbers (e.g. `[110,111,112]`), used to request:
    - `/news-items/by-ids?ids=110,111,112` (base URL `http://35.237.12.130/api` via `shared/api` env default).
  - Render fetched items using only: `id`, `raw_text`, `source`.
  - RTL support is required (item text is Hebrew).
- Architecture constraints: Feature-Sliced Design (FSD) boundaries must be respected (entities must not depend on features; side effects should not live in entity UI).

## Objective

Implement a bottom-anchored digest details dialog that:

- Opens from the digest info icon.
- Locks page scrolling while open.
- Shows digest metadata (id, published_at, llm_model).
- Fetches and displays related news items by IDs with robust loading/error/empty states.
- Supports RTL for item text and constrains height/scrolling per requirements.

## Technical Approach

- **UI primitive**: Use Ant Design `Drawer` with `placement="bottom"` and `height="66vh"` (≤ 2/3 viewport).
- **Scroll behavior**: Make Drawer body a flex column; keep metadata fixed and make only the news items list container scrollable (`overflow: auto; min-height: 0`).
- **Scroll lock**: Rely on AntD Drawer scroll locking and add an explicit body-scroll lock hook as a safety net (enabled while dialog is open).
- **Data fetching**: Create a feature-scoped hook in `features/digest-details/model` that:
  - Parses `source_item_ids_json` safely (validate number array).
  - Builds the `ids=...` query.
  - Calls `shared/api/fetchJson` with `AbortController` support, using an **absolute URL** built from `shared/api/getApiBaseUrl()` (always absolute, including dev).
  - Maps DTOs to render-model fields (`id`, `rawText`, `source`).
- **FSD wiring**:
  - Keep `entities/digest/ui` presentational: remove the current Drawer/state from `DigestCard`, expose `onInfoClick`.
  - Add a widget `widgets/digest-list-with-details` to compose entity list + feature drawer.
  - Update `pages/dashboard` to render the widget instead of the entity list directly.
- **Dev proxy**: Update `vite.config.ts` proxy to include `/news-items` (DEV uses same-origin URLs via `fetchJson`).
- **i18n**: Add RU/EN keys for new labels/states (no hardcoded user-facing strings).

## Implementation Steps

- [x] Step 1: Refactor `entities/digest/ui/DigestCard` to remove Drawer/state and expose an `onInfoClick` callback (keep info icon).
- [x] Step 2: Update `entities/digest/ui/DigestCardList` to pass `onInfoClick(digest)` down to each card.
- [x] Step 3: Create `features/digest-details` slice:
  - `api/` fetcher + DTO types
  - `lib/` JSON parsing/validation helpers
  - `model/` hook for loading/error/data with abort-on-close
  - `ui/` bottom-sheet drawer component (RTL-aware) + container
  - `index.ts` public API
- [x] Step 4: Create `widgets/digest-list-with-details` slice that:
  - Renders `DigestCardList` with an `onInfoClick` handler.
  - Tracks selected digest + open state.
  - Renders feature `DigestDetailsDrawer` with selected digest.
- [x] Step 5: Update `pages/dashboard/ui/DashboardPage.tsx` to use `widgets/digest-list-with-details` for the digests view.
- [x] Step 6: Ensure the requests are **absolute** (news-items and digests; no dev proxy requirement).
- [x] Step 7: Add i18n keys (EN/RU) for the dialog (title, section headers, loading/error/empty).

## Files to Modify/Create

- `src/entities/digest/ui/DigestCard.tsx` - remove Drawer, add `onInfoClick`.
- `src/entities/digest/ui/DigestCardList.tsx` - pass `onInfoClick` to cards.
- `src/pages/dashboard/ui/DashboardPage.tsx` - switch to widget composition.
- `src/widgets/digest-list-with-details/index.ts` - public API.
- `src/widgets/digest-list-with-details/ui/DigestListWithDetails.tsx` - composition + state.
- `src/widgets/digest-list-with-details/ui/DigestListWithDetails.module.css` - layout if needed.
- `src/features/digest-details/index.ts` - public API.
- `src/features/digest-details/api/newsItemsApi.ts` - fetch `/news-items/by-ids`.
- `src/features/digest-details/api/types.ts` - `NewsItemDto` type.
- `src/features/digest-details/lib/parseSourceItemIdsJson.ts` - validate/parse IDs.
- `src/features/digest-details/model/useNewsItemsByIds.ts` - abortable fetch hook.
- `src/features/digest-details/ui/DigestDetailsDrawer.tsx` - presentational drawer UI.
- `src/features/digest-details/ui/DigestDetailsDrawer.container.tsx` - wiring to model.
- `src/features/digest-details/ui/DigestDetailsDrawer.module.css` - RTL + scrolling styles.
- `src/shared/config/i18n/resources/en.ts` - add keys.
- `src/shared/config/i18n/resources/ru.ts` - add keys.
- `vite.config.ts` - (optional) only if we later decide to proxy other endpoints; news-items request is absolute by design.

## Testing Strategy (if needed)

- [ ] Open Dashboard → click digest info icon → bottom drawer opens; page behind does not scroll.
- [ ] Verify drawer height is ≤ 2/3 viewport; long content scrolls inside the items list only.
- [ ] Verify request is sent to `/news-items/by-ids?ids=...` (DEV via proxy, PROD via base URL).
- [ ] Validate RTL: Hebrew `raw_text` renders with correct direction and wrapping.
- [ ] Error state: simulate network failure → show retry; retry triggers refetch.

## Rollback Plan

- Revert the commit(s) created by this task branch.

## Open Questions

- Confirm “publication date” should use `DigestDto.published_at` (default assumption) and show `—` when null.
- Confirm whether the drawer title/section names are acceptable in RU/EN (Hebrew support is for content, not UI chrome).
