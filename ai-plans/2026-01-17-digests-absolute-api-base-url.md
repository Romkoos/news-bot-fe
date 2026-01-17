# Task: Make digests API call absolute using API_BASE_URL from .env

## Context

- Ticket/Request: The digests API call must be **absolute**, built from `API_BASE_URL` provided via `.env`, falling back to `DEFAULT_API_BASE_URL`.
- Current behavior: `entities/digest/api/fetchDigests()` forces a dev-only relative `/digests` call which bypasses base URL.

## Objective

- Always call an absolute URL for digests, using a **single source of truth** for base URL:
  - `shared/api/getApiBaseUrl()` is the only place that knows how env vars and defaults are resolved.

## Technical Approach

- Remove the dev-only override `{ baseUrl: '' }` from `entities/digest/api/digestApi.ts`.
- Ensure `entities/digest` does not read `import.meta.env` directly; it relies on `shared/api` for URL construction.

## Implementation Steps

- [x] Step 1: Update `entities/digest/api/fetchDigests()` to always use the configured base URL.
- [x] Step 2: Ensure dev uses Vite proxy by default (to avoid CORS), while non-dev builds use absolute `API_BASE_URL`.
- [x] Step 3: Verify `npm run lint` and `npm run build`.
- [ ] Step 4: Commit referencing this plan file and push branch.

## Files to Modify/Create

- `src/entities/digest/api/digestApi.ts` - remove dev relative override
- `src/shared/api/fetchJson.ts` - centralize dev-proxy (CORS) behavior in shared/api (single source of truth)
- `ai-plans/2026-01-17-digests-absolute-api-base-url.md` - this plan

## Testing Strategy (if needed)

- [ ] With `.env` containing `API_BASE_URL=http://35.237.12.130:8080`, verify the network request goes to `http://35.237.12.130:8080/digests`.

## Rollback Plan

- Revert the commit on this branch.
