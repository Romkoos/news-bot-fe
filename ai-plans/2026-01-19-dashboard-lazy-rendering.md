# Task: Dashboard — Lazy rendering for digest cards

## Context

- Ticket/Request: Implement lazy rendering on the dashboard page. On desktop, the user sees **2 rows with 3 cards per row** (6 cards above-the-fold).
- Relevant docs:
  - `docs/Overview.md` (Dashboard runtime flow)
  - `docs/HighLevelArchitecture.md` (FSD boundaries, dashboard entry points)

## Objective

Reduce initial render cost on `Dashboard` by **mounting only the first 6 digest cards immediately** (desktop above-the-fold), and **lazy-mounting remaining cards as they approach the viewport**, without breaking the existing grid layout, i18n, or theme support.

## Technical Approach

- Add a small, domain-agnostic `shared/ui/lazy-mount` primitive that uses `IntersectionObserver` to mount children only when visible (with configurable `rootMargin`).
- Keep entity UI presentational:
  - Extend `entities/digest/ui/DigestCardList` with optional lazy-render props (default off to avoid surprising other consumers).
- Enable lazy rendering specifically from the dashboard composition:
  - `pages/dashboard` → `widgets/digest-list-with-details` → `entities/digest/DigestCardList`
- Desktop constraint:
  - Ensure the first **6** items are rendered immediately (no placeholders) so the initial 2×3 grid is fully populated above the fold.

## Implementation Steps

- [x] Step 1: Add `shared/ui/lazy-mount` primitive (IntersectionObserver-based)
- [x] Step 2: Extend `entities/digest/ui/DigestCardList` to support lazy-mounting after N items
- [x] Step 3: Wire lazy rendering from `pages/dashboard` via `widgets/digest-list-with-details` (set initialRenderCount=6)
- [ ] Step 4: Validate behavior (desktop shows 6 real cards immediately; scrolling mounts the rest) and update docs if needed

## Files to Modify/Create

- `src/shared/ui/lazy-mount/ui/LazyMount.tsx` - Lazy-mount wrapper component (IO-driven)
- `src/shared/ui/lazy-mount/ui/LazyMount.module.css` - Minimal wrapper styles (if needed)
- `src/shared/ui/lazy-mount/index.ts` - Public API for the slice
- `src/shared/ui/index.ts` - Re-export `LazyMount` from shared UI public API
- `src/entities/digest/ui/DigestCardList.tsx` - Add optional lazy rendering support (first N eager)
- `src/widgets/digest-list-with-details/ui/DigestListWithDetails.tsx` - Accept and pass lazy-render config down
- `src/pages/dashboard/ui/DashboardPage.tsx` - Enable lazy rendering for dashboard (initialRenderCount=6)
- (Optional) `docs/Overview.md` - Note lazy rendering behavior on dashboard (if it meaningfully changes runtime flow)

## Testing Strategy (if needed)

- [ ] Desktop (≥1024px): first 6 cards render immediately; remaining cards mount on scroll
- [ ] Mobile: initial 6 render immediately (acceptable); remaining mount on scroll
- [ ] Verify info button works for lazily mounted cards (opens details drawer)
- [ ] Verify no console errors when `IntersectionObserver` is unavailable (fallback to eager mount)

## Rollback Plan

- Revert the changes to `DigestCardList` and remove `shared/ui/lazy-mount` exports; dashboard falls back to eager rendering.

## Open Questions

- Should we compute eager count per breakpoint (e.g., columns × 2 rows) or keep a constant **6**? (Current proposal: constant 6 to satisfy desktop requirement, simple + safe.)
