# Overview

## Purpose

This is a Vite + React + TypeScript frontend organized using **Feature-Sliced Design (FSD)**. It renders “digests” fetched from a backend API, supports **RU/EN** i18n and **light/dark** themes (both persisted in localStorage), and uses Ant Design v5 for UI primitives.

## Tech stack

- Bundler: Vite
- UI: Ant Design v5
- Routing: react-router-dom
- State: Zustand
- Data fetching: `fetch` via `shared/api`
- Styling: CSS Modules for custom components

## FSD layers

- `src/app`: app initialization (router + global providers)
- `src/pages`: route-level composition (Dashboard / Filters / Settings)
- `src/widgets`: reusable page blocks (Layout)
- `src/features`: user actions/capabilities (theme switch, language switch)
- `src/entities`: domain entities (Digest) + entity UI
- `src/shared`: reusable, domain-agnostic code (api, lib, ui, config)

## Runtime flow (Dashboard)

1. `app` mounts `AppProvider` (AntD theming) and router.
2. Route `/dashboard` renders `pages/dashboard/ui/DashboardPage`.
3. Page triggers `entities/digest` store `loadDigests()` on mount.
4. `entities/digest/api` fetches `/digests` using `shared/api/fetchJson`.
5. Page renders:
   - loading, error (+ retry), empty
   - success: `entities/digest/ui/DigestCardList` (cards)

## Text + date rendering rules

- Digest text is **unescaped** and Telegram MarkdownV2 escapes are removed for readability.
- Line breaks are preserved (CSS `white-space: pre-wrap`).
- Dates are formatted as `HH:mm dd.mm.yyyy` (local time).

## Dev proxy (CORS)

If the backend does not send CORS headers, dev uses a Vite proxy for `/digests` so the UI can load data locally without changing production behavior.
