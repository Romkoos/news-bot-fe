# Task: Digest cards UI + hamburger navigation (mobile-first)

## Context

- Ticket/Request: Replace digests table with **card-based UI** and move side navigation into a **hamburger menu**, using a **mobile-first** approach.
- Constraints:
  - FSD: digest UI stays in `entities/digest/ui` as presentational components; dashboard page owns container logic.
  - No pages calling `shared/api` directly.
  - User-facing text via i18n keys (RU/EN).
  - CSS Modules for custom styling.

## Objective

- Render digests as **cards**:
  - Each card shows `digest_text` (main content) and `is_published` (Tag).
  - Each card has an **info icon**; clicking it reveals the remaining fields (`id`, `created_at`, `updated_at`, `published_at`, `source_item_ids_json`, `llm_model`).
- Update app layout:
  - Replace persistent `Sider` with a **Header** containing a **hamburger button**.
  - Hamburger opens a **Drawer** with navigation items.
  - Mobile-first defaults (Drawer nav primary; no permanent sidebar).

## Technical Approach

- Digests UI:
  - Create `entities/digest/ui/DigestCard.tsx` (presentational).
  - Create `entities/digest/ui/DigestCardList.tsx` (presentational list layout).
  - Use AntD `Card`, `Tag`, and `Popover` (or `Drawer`) for info details.
  - Add i18n keys for all labels shown in details.
- Layout:
  - Update `widgets/layout/ui/AppLayout.tsx` to use AntD `Layout.Header` + `Drawer`.
  - Use CSS Modules to keep spacing and mobile defaults; keep it responsive for larger screens (optional enhancements later).
- Dashboard:
  - Keep `pages/dashboard/ui/DashboardPage.tsx` as the container (load on mount, loading/error/empty, retry).
  - Swap `DigestList` for `DigestCardList`.

## Implementation Steps

- [x] Step 1: Replace `entities/digest/ui/DigestList` table with `DigestCard` + `DigestCardList` (presentational) + CSS Modules.
- [x] Step 2: Add i18n keys for digest details labels (RU/EN) and any new UI text (e.g., “Details”, “Close”).
- [x] Step 3: Update `pages/dashboard/ui/DashboardPage.tsx` to render card list.
- [x] Step 4: Update `widgets/layout/ui/AppLayout.tsx` to hamburger + Drawer navigation (mobile-first).
- [x] Step 5: Verify `npm run lint` + `npm run build` pass.

## Files to Modify/Create

- `src/entities/digest/ui/DigestCard.tsx` - card UI
- `src/entities/digest/ui/DigestCard.module.css` - card styles
- `src/entities/digest/ui/DigestCardList.tsx` - list layout
- `src/entities/digest/ui/DigestCardList.module.css` - list styles
- `src/entities/digest/ui/index.ts` - export new components (and remove/stop exporting table list)
- `src/pages/dashboard/ui/DashboardPage.tsx` - render cards
- `src/widgets/layout/ui/AppLayout.tsx` - hamburger + Drawer menu
- `src/widgets/layout/ui/AppLayout.module.css` - mobile-first layout styles
- `src/shared/config/i18n/resources/en.ts` - new labels
- `src/shared/config/i18n/resources/ru.ts` - new labels

## Testing Strategy (if needed)

- [ ] Dashboard shows cards for digests.
- [ ] Clicking info icon reveals all extra fields.
- [ ] Menu opens via hamburger; navigation works.
- [ ] Works on narrow viewport (mobile-first).

## Rollback Plan

- Revert the commit(s) that introduce card UI and hamburger layout, restoring table and `Sider`.

## Open Questions

- Should “details” appear as a **Popover** (lightweight) or a **Drawer/Modal** (more readable on mobile) per card?

## Completed

- Date completed: 2026-01-17
- Notes:
  - Implemented details as a per-card bottom `Drawer` (mobile-friendly).
