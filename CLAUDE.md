# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Akaal — a spiritually-themed e-commerce store built on Next.js 16 (App Router), React 19, TypeScript, Prisma 7 (PostgreSQL), NextAuth v5, Tailwind v4, and Razorpay for payments. User-facing copy uses mystical framing (e.g. new users are "Disciples", orders are "Manifestations"); preserve that tone when writing UI strings.

## Commands

```bash
npm run dev          # start dev server (next dev)
npm run build        # production build
npm run start        # serve production build
npm run lint         # eslint

npm run db:push      # push prisma schema to the database (no migrations dir — schema is the source of truth)
npm run db:generate  # regenerate Prisma client after editing schema.prisma
npm run db:studio    # open Prisma Studio
npm run db:seed      # seed via prisma/seed.ts
npm run make-admin   # scripts/make-admin.ts — promote a user to ADMIN role
```

There is no test suite. Scripts under `scripts/` are one-off admin utilities run with `tsx` (e.g. `tsx scripts/list-users.ts`).

## Architecture

### Layered domain modules
Business logic lives in `src/modules/<domain>/` (products, cart, orders, auth), each split into:
- `repository.ts` — the **only** layer that touches `prisma`. Static-method classes.
- `service.ts` — orchestration + business rules; calls the repository. Also static-method classes.
- `validation.ts` — Zod schemas and their inferred input types.
- `types.ts` — domain types.

API routes and server components call the **service** layer, never Prisma directly. When adding a feature, follow this repository→service→route flow rather than querying Prisma inline (existing route handlers like `src/app/api/checkout/route.ts` predate this and hit Prisma directly — prefer the module pattern for new code).

### API routes & response envelope
Route handlers in `src/app/api/**/route.ts` must return the standard envelope via `src/lib/api-responses.ts`:
- `successResponse(data, status?)` → `{ success: true, data }`
- `errorResponse(message, status?, errors?)` → `{ success: false, error, details? }`
- `unauthorizedResponse()` → 403 for non-admins

Pattern: `auth()` for gating, `Schema.safeParse(body)` for validation (return `errorResponse(..., 400, err.flatten().fieldErrors)` on failure), wrap in try/catch, `console.error` + generic 500 on throw.

### Prisma Decimal serialization gotcha
`Product.price`, `Order.total`, and `OrderItem.price` are Prisma `Decimal`. They do **not** serialize cleanly across the server/client boundary or in JSON responses. The codebase strips them with `JSON.parse(JSON.stringify(x))` — see `serializeData()` in `src/lib/serialization.ts` and the service methods. Always serialize before returning Decimal-bearing data to a client component or API response. Convert with `Number(price)` for arithmetic (money is stored as INR; Razorpay wants paise, so `Math.round(total * 100)`).

### Database client
`src/lib/prisma.ts` is the singleton. It uses the **pg driver adapter** (`@prisma/adapter-pg` + a `pg` Pool over `DATABASE_URL`), not Prisma's default engine — `schema.prisma`'s datasource block intentionally has no `url`. Import the default export: `import prisma from "@/lib/prisma"`.

### Auth
NextAuth v5 (beta), JWT session strategy, Prisma adapter. Split across three files:
- `src/auth.config.ts` — edge-safe config: `authorized` callback (route protection rules for `/admin`, `/dashboard`, `/orders`) plus `jwt`/`session` callbacks that thread `id` and `role` onto the token/session.
- `src/auth.ts` — full config with providers (Google, Apple, Credentials via bcrypt) and the Prisma adapter; exports `auth`, `handlers`, `signIn`, `signOut`.
- `src/proxy.ts` — the Next.js middleware entry (Next 16 names it `proxy.ts`, not `middleware.ts`). Runs `authConfig.authorized`; the `matcher` excludes `api/webhooks`, `api/register`, and static assets.

Roles are `USER` / `ADMIN` (see `src/constants/roles.ts` and the `Role` enum). Admin gating is enforced in **both** the middleware and individual route handlers (`session.user.role !== "ADMIN"`). `session.user.role` is available via the type augmentation in `src/next-auth.d.ts` / `src/types/next-auth.d.ts`.

### Client-side mutations
Client components mutate via hooks in `src/hooks/` (e.g. `use-cart.ts`) that `fetch` the API routes and call `router.refresh()` to re-fetch server-rendered data. There is no client-side global store or SWR/react-query — server components are the source of truth and refresh drives updates.

### Conventions
- Import alias `@/*` → `src/*`.
- Route paths are centralized in `src/constants/routes.ts` (`Routes.ADMIN.EDIT_PRODUCT(id)` etc.) — use these instead of hardcoding.
- Payments: `src/lib/razorpay.ts` exposes `getRazorpay()` which lazily constructs the client at request time (constructing at module scope breaks `next build` when env vars are absent).
