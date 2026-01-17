# Task: Unified digest date formatting + digest_text unescape with preserved line breaks

## Context

- Ticket/Request: All digest date strings must be rendered in a single unified format `HH:mm dd.mm.yyyy`. Digest text initially contains escaping (must not be rendered) and includes `\n` line breaks which must be preserved.
- Constraints:
  - FSD: formatting helpers live in `shared/lib` as focused segments (no “utils dump”).
  - UI renders must remain safe (no HTML injection); keep text rendering.
  - Apply formatting at the rendering boundary (`entities/digest/ui`), not inside pages.

## Objective

- Display `created_at`, `updated_at`, `published_at` as `HH:mm dd.mm.yyyy` (or fallback `—` when null/invalid).
- Render `digest_text` without visible escape sequences (e.g. `\\n`, `\\t`, `\\uXXXX`) and **preserve line breaks** in the UI.

## Technical Approach

- Add `shared/lib/datetime`:
  - `formatDateTime(value: string | null | undefined): string | null` parsing via `new Date(value)` and formatting with zero-padding.
- Add `shared/lib/text`:
  - `unescapeText(value: string): string` that decodes common JSON-style escaping using a safe `JSON.parse` strategy with fallbacks.
- Apply in `entities/digest/ui`:
  - `DigestCard`: format dates in details drawer; unescape `digest_text` and render with CSS `white-space: pre-wrap`.
  - Keep `DigestList` consistent (optional, for parity while it still exists).

## Implementation Steps

- [x] Step 1: Add `shared/lib/datetime` + `shared/lib/text` segments and export via `shared/lib` public API.
- [x] Step 2: Update `entities/digest/ui/DigestCard` to use `formatDateTime` and `unescapeText` (preserve line breaks).
- [x] Step 3: Update `entities/digest/ui/DigestList` to use the same formatting helpers (parity).
- [x] Step 4: Verify `npm run lint` + `npm run build` pass.

## Files to Modify/Create

- `src/shared/lib/datetime/formatDateTime.ts` - date formatting helper
- `src/shared/lib/datetime/index.ts` - public API
- `src/shared/lib/text/unescapeText.ts` - unescape helper
- `src/shared/lib/text/index.ts` - public API
- `src/shared/lib/index.ts` - re-export new helpers
- `src/entities/digest/ui/DigestCard.tsx` - apply formatting
- `src/entities/digest/ui/DigestCard.module.css` - ensure `pre-wrap` for text
- `src/entities/digest/ui/DigestList.tsx` - apply formatting (optional parity)

## Testing Strategy (if needed)

- [ ] Render digest with `digest_text` containing `\\n` and confirm line breaks display.
- [ ] Render digest with escaped sequences (e.g. `\\u003c`) and confirm they don’t display as escapes.
- [ ] Dates display as `HH:mm dd.mm.yyyy` across UI surfaces.

## Rollback Plan

- Revert the commit(s) affecting `shared/lib` and digest UI formatting.

## Open Questions

- Should date formatting be **local time** (browser timezone) or **UTC**? (Default: local time.)
