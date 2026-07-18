"use client";

/**
 * Client-side wishlist store. Authenticated users hit /api/wishlist (shared,
 * deduped cache so many LikeButtons on one page trigger a single GET);
 * guests fall back to localStorage `liked_<id>` keys. `mergeGuestLikes`
 * migrates guest likes into the account after sign-in.
 * Components listen to the "wishlist-updated" window event to stay in sync.
 */

let cache: Promise<Set<string>> | null = null;

export function notifyWishlistUpdated() {
  window.dispatchEvent(new Event("wishlist-updated"));
}

export function getLocalLikedIds(): string[] {
  const ids: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("liked_")) ids.push(key.replace("liked_", ""));
  }
  return ids;
}

function clearLocalLikes() {
  for (const id of getLocalLikedIds()) {
    localStorage.removeItem(`liked_${id}`);
  }
}

export function invalidateWishlistCache() {
  cache = null;
}

/** Server-side wishlist ids for the signed-in user (cached per page load). */
export function getServerWishlist(force = false): Promise<Set<string>> {
  if (!cache || force) {
    cache = fetch("/api/wishlist")
      .then((res) => res.json())
      .then((json) => new Set<string>(json?.success ? json.data.ids : []))
      .catch(() => {
        cache = null;
        return new Set<string>();
      });
  }
  return cache;
}

/** Toggle for a signed-in user; returns the new liked state. */
export async function toggleServerWishlist(productId: string): Promise<boolean> {
  const res = await fetch("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Wishlist update failed");
  invalidateWishlistCache();
  notifyWishlistUpdated();
  return json.data.liked;
}

/** One-shot migration of guest likes after sign-in. */
export async function mergeGuestLikes(): Promise<void> {
  const ids = getLocalLikedIds();
  if (ids.length === 0) return;
  try {
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mergeIds: ids }),
    });
    const json = await res.json();
    if (json.success) {
      clearLocalLikes();
      invalidateWishlistCache();
      notifyWishlistUpdated();
    }
  } catch {
    // Guest likes stay local; merge retries next visit
  }
}
