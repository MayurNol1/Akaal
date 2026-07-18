import Razorpay from "razorpay";

let client: Razorpay | null = null;

/**
 * Lazily construct the Razorpay client. Instantiating at module scope throws
 * ("`key_id` or `oauthToken` is mandatory") when the env vars are missing —
 * e.g. during `next build` page-data collection — so we defer it to request time.
 */
export function getRazorpay(): Razorpay {
  if (!client) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      throw new Error(
        "Razorpay is not configured: set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
      );
    }

    client = new Razorpay({ key_id, key_secret });
  }

  return client;
}
