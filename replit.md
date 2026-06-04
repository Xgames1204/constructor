# XEMENS Constructor

A visual website builder with drag-and-drop, block scripting, auth, and DB — migrated from Next.js/Vercel to the Replit pnpm_workspace stack.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, reads `PORT` env)
- `pnpm --filter @workspace/constructor run dev` — run the frontend (port from `PORT` env)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind v4 + Wouter router
- API: Express 5 (port 8080), cookie-based sessions (no JWT)
- DB: PostgreSQL + Drizzle ORM
- Auth: bcrypt passwords, email verification codes, session cookies
- Editor: dnd-kit drag-and-drop, Zustand store, visual block scripting (@xyflow/react)

## Where things live

- `artifacts/constructor/src/` — React frontend source
  - `App.tsx` — wouter router (all routes defined here)
  - `lib/auth-context.tsx` — custom auth context (useAuth, useSession hooks)
  - `components/providers.tsx` — Providers wrapper (AuthProvider + ThemeProvider + SettingsContext)
  - `components/editor/editor-shell.tsx` — main drag-and-drop editor UI
  - `lib/site-renderer.ts` — renders project JSON → HTML for published sites
  - `index.css` — Tailwind v4 theme vars (brand-*, constructor-charcoal, etc.)
- `artifacts/api-server/src/` — Express API
  - `routes/auth.ts` — register/verify/login/logout/me
  - `routes/projects.ts` — CRUD + publish + site runtime + `/site/:siteId`
- `lib/db/src/schema/` — Drizzle schema (users, sessions, emailVerifications, projects)

## Architecture decisions

- **No next-auth**: replaced with custom Express sessions (bcrypt + cookie-parser + sessionsTable in DB)
- **SMTP optional**: in dev mode, verification codes are returned in the API response as `devCode` (no email needed)
- **Client-side site rendering**: `/api/site/:siteId` returns raw project JSON; frontend renders it using `renderProjectBody()` from `lib/site-renderer.ts`
- **Vite proxy**: `/api/*` proxied to `localhost:8080` (the API server)
- **Brand colors**: defined in `index.css` `@theme inline` block as `--color-brand-*` and `--color-constructor-charcoal`

## Product

Users can register/login, create visual website projects using drag-and-drop editor, add block-based scripts, and publish sites to `/site/:siteId`. The editor supports: text/image/button/container elements, style properties panel, layers panel, server/API endpoints panel, undo/redo, autosave, dark mode.

## Gotchas

- API server listens on `PORT` env (Replit assigns 8080 for api-server artifact); Vite proxies `/api` → 8080
- SMTP not configured = dev mode: verification code returned as `devCode` in register response
- `"use client"` strings in shadcn component files are harmless no-ops in Vite (not parsed as directives)
- `immer` must be installed as a direct dependency (peer dep of `zustand/middleware/immer`)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._
