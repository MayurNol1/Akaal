---
name: api-conventions
description: How Akaal builds Next.js App Router API routes — response envelope, auth gating, validation, and the repository→service→route flow
---

# API Conventions

Conventions for route handlers under `src/app/api/**/route.ts` (Next.js 16 App Router, NextAuth v5, Prisma 7).

## Response envelope

Always return via the helpers in `src/lib/api-responses.ts` — never a bare `NextResponse.json`:

- `successResponse(data, status?)` → `{ success: true, data }` (default 200; use `201` on create)
- `errorResponse(message, status?, errors?)` → `{ success: false, error, details? }`
- `unauthorizedResponse()` → 403 `"Unauthorized. Admin access required."`

## Handler shape

Every handler follows this pattern:

```ts
export async function POST(req: Request) {
  try {
    const session = await auth();

    // Admin-only:
    if (!session || session.user.role !== "ADMIN") {
      return unauthorizedResponse();
    }
    // Or authenticated user:
    if (!session?.user?.id) {
      return errorResponse("Authentication required", 401);
    }

    const body = await req.json();
    const parsed = SomeSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Invalid input data", 400, parsed.error.flatten().fieldErrors);
    }

    const result = await SomeService.doThing(parsed.data);
    return successResponse(result);
  } catch (error) {
    console.error("POST /api/... error:", error);
    return errorResponse("Internal Server Error", 500);
  }
}
```

Rules:
- Wrap the whole body in `try/catch`; on throw, `console.error(...)` + generic `errorResponse("Internal Server Error", 500)`.
- Gate with `auth()` from `@/auth`. Admin gating is `session.user.role !== "ADMIN"` (enforced here **and** in middleware).
- Validate with a Zod schema's `.safeParse(body)`; on failure return `errorResponse(msg, 400, err.flatten().fieldErrors)`.
- Dynamic route params are async in Next 16: `{ params }: { params: Promise<{ id: string }> }`, then `const { id } = await params`.
- Map known domain errors to real status codes (e.g. `"Product not found"` → 404) before the generic 500.

## Business logic goes through modules

Route handlers call the **service** layer (`src/modules/<domain>/service.ts`), never Prisma directly. Follow repository→service→route. Existing handlers that hit `prisma` inline (e.g. `src/app/api/checkout/route.ts`) predate this — prefer the module pattern for new code.

## Conventions

- JSON properties are camelCase.
- No URL versioning (`/v1/`) and no forced pagination — this store doesn't use them; don't add them.
- Money: prices are Prisma `Decimal` in INR. Use `Number(price)` for math; Razorpay wants paise, so `Math.round(total * 100)`. Serialize Decimal-bearing data (`serializeData()` in `src/lib/serialization.ts`) before returning it.
- The `api/auth/[...nextauth]`, `api/webhooks`, and `api/register` routes are excluded from middleware auth — see `src/proxy.ts`.
