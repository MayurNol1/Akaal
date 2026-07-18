# Akaal — Work Plan

> Generated 2026-07-18 from a full codebase audit. Track progress by checking boxes.
> Status legend: `[ ]` todo · `[x]` done · `[~]` in progress

---

## 1. Project Map (high level)

**Stack:** Next.js 16.1.6 (App Router) · React 19 · TypeScript · Prisma 7 + PostgreSQL (pg driver adapter) · NextAuth v5 beta (JWT, Google/Apple/Credentials) · Razorpay · Tailwind v4 (CSS-first config) · Zod + react-hook-form.

**How it connects:**
- Server components fetch via `src/modules/<domain>/{repository,service}.ts` (repository is the only Prisma layer). Some older routes/pages still hit Prisma directly.
- API routes under `src/app/api/**` return the `{ success, data }` envelope from `src/lib/api-responses.ts`.
- Client mutations go through hooks (`src/hooks/use-cart.ts`) → API routes → `router.refresh()`.
- Auth: `src/auth.ts` (providers) + `src/auth.config.ts` (edge callbacks) + `src/proxy.ts` (Next 16 middleware). Roles USER/ADMIN enforced in middleware + route handlers.
- Payments: `/api/checkout` creates a Razorpay order → `RazorpayButton` opens checkout.js → `/api/checkout/verify` verifies HMAC signature, creates Order + items in a transaction, clears cart.
- Prisma models: User, Account, Session, VerificationToken, Category, Product, Order, OrderItem, Coupon, Cart, CartItem. **No Review, Address, or Wishlist model.**

**Build health:** `tsc --noEmit`, `eslint`, and `next build` all pass clean. All errors below are runtime/logic-level.

---

## 2. Errors Found (grouped)

### Checkout / payments (CRITICAL)
- **Amount mismatch:** UI shows `subtotal + shipping + 5% GST` (`src/app/checkout/page.tsx:34-36`) but `/api/checkout` charges **subtotal only** (`route.ts:28-32`) and `/api/checkout/verify` stores subtotal as `Order.total` (`verify/route.ts:54-62`). Customer sees one price, is charged a smaller one; order records are wrong. `orders/[id]/page.tsx` then labels the subtotal as "Total Paid" while showing a shipping line that was never charged.
- **Shipping form unwired:** 7 checkout address fields are uncontrolled inputs, never read/submitted (`checkout/page.tsx:93-118`). No Address storage.
- **Webhook missing:** `src/app/api/webhooks/` is empty; `proxy.ts` excludes it and `.env.example` declares `RAZORPAY_WEBHOOK_SECRET`, but no handler exists. Payment confirmation relies solely on the client redirect.
- Non-constant-time signature compare (`verify/route.ts:26`) — use `crypto.timingSafeEqual`.

### Products page (CRITICAL)
- `src/app/products/page.tsx:35-44` uses raw `prisma.product.findMany` and passes Prisma `Decimal` price into client component `ProductCardStitch` (`:187`) — violates the serialization convention; server→client boundary error.

### Latent / dead-code errors
- `src/hooks/use-products.ts:19-20,47-48` — doesn't unwrap the `{success,data}` envelope (currently unused, so latent).
- `src/lib/db.ts`, `src/lib/utils.ts` — empty files.
- `src/app/admin/products/new/` — byte-identical duplicate of `create/`; dashboard links to `/new`, product list to `/create`.
- Unused: `src/components/layout/logo.tsx`, `src/app/checkout/payment-selector.tsx`, `src/app/products/[id]/like-button.tsx` (stale twin of `components/products/like-button.tsx`), `OrderStatusLabels` in `src/constants/order-status.ts`, `modules/orders/validation.ts` empty schema.
- Root clutter: `admin_dashboard.html`, `cart_checkout.html`, `download_stitch.ps1`, `check-products.ts`, `lint_output*.txt`, `final_lint_output.txt`.

### Config / env
- `.env.example` missing `GOOGLE_CLIENT_ID/SECRET`, `APPLE_ID/SECRET` (providers instantiate with `undefined` → social login fails silently).
- `NEXT_PUBLIC_APP_URL` declared but unused; `NEXTAUTH_*` names are legacy (v5 prefers `AUTH_*`, both still work).
- `api/categories/route.ts:9` returns 401 where the codebase convention is 403.
- `admin/customers/page.tsx:49` uses `"NO_ORDER"`, outside the `OrderStatus` enum.

---

## 3. Flow Status

| Flow | Status | Notes |
|---|---|---|
| Credentials login/register | ✅ Complete | Login page's embedded "Create Account" tab is a dead decorative form |
| Google/Apple OAuth | ⚠️ Code-complete | Env vars undocumented; fails without them |
| Browse / product detail | ✅ Complete | Sidebar filters (price, availability, checkboxes) & qty stepper are decorative |
| Cart add/update/remove | ✅ Complete | Coupon "Apply" button has no handler |
| Checkout + Razorpay | ⚠️ Broken math | See errors above; payment radios decorative |
| Order history/detail | ✅ Complete | Totals display wrong due to checkout bug |
| Dashboard | ✅ Complete | "Wishlist" stat actually shows cart count |
| Profile | 🔴 Stub | Redirects to /dashboard |
| Settings (profile/password) | 🔴 UI-only | Save is a toast; no API exists |
| Forgot/reset password | 🔴 Missing | `href="#"`; only CLI script |
| Admin product CRUD | ✅ Complete | Duplicate create/new routes |
| Admin orders | ⚠️ Read-only | `POST /api/admin/orders` exists; no UI calls it |
| Admin users | 🔴 Fake | Mail/Ban buttons just toast |
| Admin coupons | ⚠️ Half | Can create/toggle; never validated/applied anywhere |
| Admin analytics/customers | ✅ Complete | Read-only by design |
| Admin settings | 🔴 UI-only | No persistence; mentions "Stripe" |
| Wishlist | ⚠️ Client-only | localStorage, not per-account |
| Reviews | 🔴 Missing | 3 hardcoded reviews, static 4.8 rating, no model |
| Email notifications | 🔴 Missing | Order page promises a confirmation email; nothing sends |
| Newsletter | 🔴 Fake | setTimeout success, no API |

---

## 4. UI Issues

- **Logo fragmentation:** navbar + admin sidebar use a hardcoded inline SVG glyph; homepage/auth pages use `/images/bg-removed-logo.png` at 4+ different sizes; `components/layout/logo.tsx` (Sparkles icon, "Infinite Soul") is unused. Inconsistent alt text ("The Eternal Trishul" / "Sacred Symbol" / "" / "Akaal"). No single source of brand truth. Manifest files exist in `public/` but aren't linked in metadata.
- **No shared footer:** four divergent inline footers (home, products, login/register fixed-position); most pages have none. Footer links `href="#"`.
- **No route-level states:** zero `loading.tsx` / `error.tsx` / `not-found.tsx` anywhere, on a fully `force-dynamic`, DB-backed site.
- **Responsive:** hardcoded px layouts with no breakpoints — products sidebar 240px + 3-col grid, detail `1fr 1fr` + 4-col related, cart/checkout `1fr 380px`, dashboard 270px sidebar.
- **Two styling systems:** inline `style={{}}` with hardcoded hex (`#d4a94a` etc.) nearly everywhere, vs Tailwind + theme tokens in admin components. `globals.css` defines tokens/utility classes (`.btn-primary-akaal`, `.product-card`) that are mostly unadopted; `animate-shimmer` used but keyframe undefined; keyframes duplicated inline in `page.tsx`.
- **Tone inconsistency:** mystical `OrderStatusLabels` ("Transcending", "Manifested"…) authored but unused — all order UIs hardcode plain terms. Three names for users ("Seeker", "Sacred Member", "Disciple"); CLAUDE.md says "Disciples".
- **A11y/polish:** icon-only buttons without aria-labels, no focus-visible styles (hover via JS onMouseEnter), `alert()`/`confirm()` in checkout & admin, hardcoded fake ratings "(42)"/"4.8 (124 reviews)", external googleusercontent fallback image URLs duplicated in 6 files, duplicate product-card implementations (home vs shared).

---

## 5. Chunked Work Plan

### Phase 0 — Blocking errors (do first)

- [x] **C1. Checkout money correctness** — done: `src/lib/pricing.ts` is the single source (used by cart page, checkout page, `/api/checkout`, `/api/checkout/verify`, `orders/[id]`); charge = displayed total; correct `Order.total`; `timingSafeEqual` signature check; verify route now scopes cart to session user.
- [x] **C2. Products page Decimal leak** — done: `products/page.tsx` wraps the query in `serializeData()`.
- [x] **C3. Dead code & clutter purge** — done: removed `use-products.ts`, `db.ts`, `utils.ts`, `payment-selector.tsx`, stale `like-button`, unused `logo.tsx`, duplicate `/admin/products/new` (dashboard link repointed to `/create`), root html/ps1/log artifacts. Razorpay refactor staged, not committed (awaiting user).
- [x] **C4. Env & config hygiene** — done: `.env.example` now documents Google/Apple OAuth vars; categories route uses `unauthorizedResponse()` (403); customer `latestStatus` fallback human-readable.

### Phase 1 — Wire up half-built flows

- [x] **C5. Checkout shipping form** — done: `Order.shippingAddress Json?` (schema pushed), `ShippingAddressSchema` in orders module, `checkout-client.tsx` (react-hook-form + Zod, inline errors), address validated server-side in `/api/checkout` before payment, stored in `/api/checkout/verify`, shown on order detail. Fake payment radios replaced with honest Razorpay method card.
- [x] **C6. Razorpay webhook** — done: `POST /api/webhooks/razorpay` (raw-body HMAC via `RAZORPAY_WEBHOOK_SECRET`, `payment.captured`, idempotent on `razorpayOrderId`, race-safe vs /verify). Needs endpoint configured in the Razorpay dashboard.
- [x] **C7. Admin order status UI** — done: `status-select.tsx` dropdown on `/admin/orders` calling `POST /api/admin/orders`; page now uses mystical `OrderStatusLabels`.
- [x] **C8. Settings page for real** — done: `User.emailNotifications`/`privacyMode` fields; `GET/PATCH /api/profile` + `POST /api/profile/password` (current-password check for credentials accounts, direct set for OAuth-only); settings page fully wired with toasts/errors; session name refresh via jwt `update` trigger.
- [x] **C9. Coupons end-to-end** — done: `Cart.couponCode` + `Order.couponCode/couponDiscount`; `modules/coupons` (validate: exists/active/not expired); `POST|DELETE /api/cart/coupon`; pricing helper takes discount %; cart Apply/Remove UI with errors; discount rows on cart/checkout/order-detail; all three money paths (checkout, verify, webhook) apply it; admin coupon server actions now role-checked.
- [x] **C10. Admin users actions** — done: `User.isDisabled` enforced at sign-in (credentials + OAuth); `PATCH /api/admin/users` (role change + restrict, self-modification blocked); users table has working promote/demote + restrict buttons, real mailto link, RESTRICTED status badge. **Bonus fix:** admin users page was serializing full user rows (incl. password hashes) to the client — now selects only safe fields.

### Phase 2 — Missing flows

- [x] **C11. Forgot/reset password** — done: hashed one-hour tokens on `VerificationToken`; `POST /api/auth/forgot-password` (no email-enumeration leak) + `POST /api/auth/reset-password`; `/forgot-password` + `/reset-password` pages; login "Forgot password?" link wired; reset email via `src/lib/mail.ts`.
- [x] **C12. DB-backed wishlist** — done: `WishlistItem` model; `GET/POST /api/wishlist` (toggle + merge); `src/lib/wishlist-client.ts` (deduped cache); LikeButton/WishlistCount/wishlist page are session-aware with guest localStorage fallback and merge-on-login; dashboard "Wishlist" stat now counts real wishlist items (was cart count).
- [x] **C13. Reviews** — done: `Review` model (one per user+product, verified-purchase flag from order history); `modules/reviews`; `GET/POST /api/products/[id]/reviews`; star-picker review form (sign-in gated); product detail shows real reviews + aggregate; hardcoded "4.8 (124 reviews)" and fake card "(42)" ratings replaced with real aggregates (hidden when zero).
- [x] **C14. Email notifications** — done: `src/lib/mail.ts` (Resend REST via fetch, console fallback when `RESEND_API_KEY` unset — no new npm deps); order confirmation email from verify route + webhook, honoring the `emailNotifications` preference; `NewsletterSubscriber` model + `POST /api/newsletter`; newsletter form actually subscribes now.

### Phase 3 — UI & polish

- [x] **C15. Logo system** — done: new `src/components/layout/logo.tsx` (real PNG asset, size/iconOnly/href props) used in navbar + admin sidebar + footer; inline SVG glyphs removed; `site.webmanifest` fixed (name, correct icon paths, dark theme colors) and linked via metadata.
- [x] **C16. Shared footer** — done: `Footer` component in root layout (auto-hides on admin/auth); inline footers removed from home + products pages; real `/privacy`, `/terms`, `/support` pages (shared `LegalPage` shell); all dead `href="#"` legal links now point somewhere real.
- [x] **C17. Route states** — done: themed root `loading.tsx` (spinner), `error.tsx` (retry + home, logs digest), `not-found.tsx` (404) — cover all routes incl. product-detail `notFound()`.
- [x] **C18. Responsive pass** — done: `.layout-split`/`.layout-sidebar`/`.layout-detail`/`.grid-*` utilities in globals.css with ≤960px collapse; applied to cart, checkout, product detail (+related grid), products sidebar/grid, dashboard sidebar/stats.
- [x] **C19. Mystical copy pass** — done: `OrderStatusLabels` now used on customer orders list + detail (admin done in C7); "Seeker"/"Sacred Member" → "Disciple"; checkout `alert()`s → inline themed error; admin `confirm()`s → two-step confirm buttons; login's dead "Create Account" fake form replaced with honest CTA + social buttons.
- [x] **C20. Product page interactivity** — done: `filters.tsx` (category/price-range/availability → URL params, server-side filtering, clear button); `QuantityAddToCart` stepper (stock-capped) feeding a quantity-aware `AddToCartButton`.
- [x] **C21. Theme/a11y cleanup** — done: `animate-shimmer` keyframe defined; global `:focus-visible` outlines; aria-labels on icon-only controls (menu toggle, sidebar collapse, steppers, like/status controls); external googleusercontent fallback images → local `FALLBACK_PRODUCT_IMAGE`; avatar fallbacks → initial letter (no external host); homepage's duplicate `ProductCard` replaced by shared `ProductCardStitch` with real ratings. (Full hex→token migration deferred — cosmetic only, huge diff for no behavior change.)

**Order rationale:** C1–C4 remove wrong-money and crash risks and stabilize the tree for everything after. Phase 1 items are independent of each other (safe to do in any order). Phase 2 items each add a schema model (independent). Phase 3 is cosmetic and safest last, though C15/C16 can be pulled earlier if branding is urgent.

### Phase 4 — Admin consistency round (user feedback, 2026-07-18)

- [x] **C22. Edit/Create product page parity** — identical header pattern (back link + gold dash + eyebrow + serif title); removed create page's double card wrapper and edit page's gradient-text one-off.
- [x] **C23. Admin settings made real** — replaced fake toggles (Entity Caching / Stripe webhooks / Lockdown) and wrong constants (18% tax) with a truthful server-rendered page: live integration status from env (Razorpay, webhook, Resend, Google, Apple), real commerce constants from `pricing.ts`, live counts + management tool links. Customer settings tab verified working (built in C8).
- [x] **C24. Notification bell removed** — the admin header's top-right bell (with its dead "Seek All History" button) deleted along with `notification-bell.tsx` and `actions.ts`; header now just has "Back to Site".
- [x] **C25. Search feedback + clear** — storefront: navbar search box keeps the current term; products page shows a gold "Results for 'x' ✕" chip (clear preserves other filters) and "N matches found". Admin: products and users search fields get an in-field ✕ clear button and a live match-count chip; dead "Filter Essences"/"Filter Auras" chips removed.
- [x] **C26. Admin UI consistency** — coupons page restyled from off-theme cyan to gold with the standard header; admin dashboard stats/chart grids made responsive; dashboard sidebar nav cleaned (removed circular "Profile" link and nonexistent "Addresses"; wishlist count added).
- [x] **C27. Typography** — kept DM Sans + Cormorant Garamond (fits the mystical-premium theme and is highly readable); added global line-height 1.6 + optimizeLegibility.

### Phase 5 — Live browser audit (Playwright sweep of all 36 pages, 2026-07-18)

- [x] **C28. Edit form: category never pre-selected** — root cause was a render race (registered value applied before `<option>`s existed); fixed with a post-render effect keyed on loaded categories. Verified in-browser: select now shows the product's real category.
- [x] **C29. Out-of-stock purchasable** — product page showed an enabled Add to Cart for 0-stock items AND the cart API accepted them. Fixed both: disabled "Out of Stock" button client-side, and real stock/availability validation in `CartService.addToCart` (surfaced as 400s with clear messages).
- [x] **C30. Guest 401 noise** — `CartPlaceholder` fetched `/api/cart` on every page for signed-out visitors; now session-gated.
- [x] **C31. Broken-image fallbacks** — product cards swap to the local fallback on load error (was showing raw alt text); fake 4× duplicate thumbnail row on product detail removed; related-products `src=""` fixed; `AdminImage` renders its placeholder for empty src.
- [x] **C32. Misleading SKUs** — `id.slice(0,6)` on time-prefixed cuids made every SKU look identical; now `slice(-6)` (dashboard, inventory, admin orders id).
- [x] **C33. INR formatting** — cart/checkout/pay-button totals now use en-IN locale separators (₹4,725 not ₹4725).

Verified visually via headless-Chromium screenshots (desktop + mobile) across home, products (+search/filters), product detail, cart, checkout, auth pages, legal pages, 404, dashboard, settings, wishlist, orders, and all 10 admin screens. Remaining console output: one expected 404 for a product row whose stored imageUrl points to a deleted file (now falls back visually).

### Phase 6 — Customer-friendly UI pass (mobile + desktop, 2026-07-18)

- [x] **C34. Search reachable everywhere** — navbar search now shows from tablet width (was hidden below 1280px), and the mobile menu gained a search bar. Sign In button no longer wraps on small screens.
- [x] **C35. Mobile menu upgraded** — search field + Wishlist/Cart quick-access tiles + nav links + sign in/out; overlay scrolls on short screens.
- [x] **C36. Mobile filters collapsed** — products page filters sit behind a "Filters (n)" toggle on phones (with active-filter count), so the product grid is immediately visible; desktop unchanged. Sidebar border/height artifacts on mobile removed.
- [x] **C37. Sticky mobile buy bar** — product detail on phones pins a total-price + Add to Cart bar to the bottom (quantity-aware, safe-area padded); hidden for out-of-stock items.
- [x] **C38. Guest add-to-cart guidance** — tapping Add to Cart signed-out now shows a themed "Sign in to add items to your cart" toast with a Sign In link (both button variants), instead of a raw failure.
- [x] **C39. Mobile spacing** — cart promo bar and products hero horizontal padding now scale down on small screens.

All verified with fresh browser screenshots at 1440px, 1024px, and 390px.

### Phase 7 — Filter panel rebuild (user feedback, 2026-07-18)

- [x] **C40. "Stuck" filters fixed** — the filters worked but gave zero feedback while results loaded, so clicks felt dead. The panel now keeps a local optimistic state (controls respond instantly), dims while applying with a small spinner, and active rows get a gold highlight.
- [x] **C41. Price slider replaced** — the range slider is gone in favour of four tappable price buckets (Under ₹500 / ₹500–₹2,000 / ₹2,000–₹10,000 / Over ₹10,000) via a `price=min-max` URL param, applied server-side.
- [x] **C42. Stock filters removed** — In Stock / Low Stock UI and their query handling deleted.
- [x] **C43. New filters** — "★★★★ & Up" (products whose average review rating ≥ 4, via a review groupBy) and "New Arrivals" (added in the last 30 days). Category rows now show per-category product counts.
- [x] Also fixed in passing: the mobile Filters toggle was leaking onto desktop (inline display overriding the responsive class — same pattern as the navbar bug).

Verified in-browser: single + combined filters change the URL and grid, Clear All resets, toggle hidden at 1440px and functional at 390px.

### Phase 8 — Collection & ratings refinements (user feedback, 2026-07-18)

- [x] **C44. Collapsible filter sidebar** — desktop-only `<` handle (new `shop-layout.tsx` client shell) hides/shows the filter rail; grid expands to full width; mobile untouched (keeps its own Filters toggle).
- [x] **C45. About page "Akaal"** — the stark white bold lead word now renders in gold serif matching brand accents.
- [x] **C46. Out-of-stock last** — collection lists in-stock products first and out-of-stock at the end (two-query pagination stitch, works across pages); homepage featured strip floats in-stock first; admin products table pins out-of-stock rows to the TOP with a red left-border/tint, an "Out of Stock" pill, and a count chip in the header.
- [x] **C47. Ratings improvements** — shared `Stars` component with half-star rendering (4.3 shows 4½, was Math.round), average shown to one decimal on cards, verified-purchase reviews listed first, and a rating-breakdown panel (big average + 5→1 star distribution bars) on the product page. Verified live by submitting a real 4★ review through the UI.
- [x] Fixed in passing: mobile buy bar was leaking onto desktop (third instance of inline `display` overriding responsive classes).
