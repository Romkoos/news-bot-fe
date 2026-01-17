# Task: Render markdown-style links in digest_text as clickable anchors (safe)

## Context

- Ticket/Request: Digest text contains markdown-style links like `[Title](https://...)`. These should render as **clickable links**, while keeping the digest text as plain text (no HTML injection) and preserving line breaks.
- Current state: `digest_text` is unescaped and line breaks are preserved via `white-space: pre-wrap`, but links remain plain text.

## Objective

- Convert `[label](url)` occurrences inside `digest_text` into clickable anchors.
- Preserve all other text and **preserve line breaks**.
- Security: allow only `http:` / `https:` URLs (no `javascript:`).

## Technical Approach

- Add `shared/lib/text/markdownLinks` parser:
  - Pure function returning tokens `{ kind: 'text' | 'link', text, href? }`.
  - Validates href via `new URL()` and protocol whitelist.
- Apply in `entities/digest/ui`:
  - After existing `unescapeText()`, call parser and render tokens:
    - `text` tokens render as text nodes.
    - `link` tokens render as `<a href ... target="_blank" rel="noreferrer noopener">`.
  - Keep CSS `white-space: pre-wrap` to preserve `\n`.
- Optional parity: apply in `DigestList` table cell too.

## Implementation Steps

- [ ] Step 1: Add `shared/lib/text/markdownLinks` parser + export via `shared/lib`.
- [ ] Step 2: Update `entities/digest/ui/DigestCard` to render tokens with safe anchors.
- [ ] Step 3: Update `entities/digest/ui/DigestList` digest cell for parity.
- [ ] Step 4: Validate in dev server: link appears and is clickable; lint/build pass.

## Files to Modify/Create

- `src/shared/lib/text/markdownLinks.ts`
- `src/shared/lib/text/index.ts`
- `src/entities/digest/ui/DigestCard.tsx`
- `src/entities/digest/ui/DigestList.tsx`

## Testing Strategy (if needed)

- [ ] Open `/dashboard`, confirm `[...](https://...)` renders as clickable link and `\n` still produces line breaks.
- [ ] Confirm non-http(s) links are not converted.

## Rollback Plan

- Revert changes to `shared/lib/text/*` and digest UI rendering.
