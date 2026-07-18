import { LegalPage } from "@/components/layout/legal-page";

export const metadata = { title: "Support" };

export default function SupportPage() {
  return (
    <LegalPage
      eyebrow="Help"
      title="Support &"
      titleAccent="Guidance"
      intro="Whether it's a question about your manifestation or your account, we're here to help you on the path."
      sections={[
        {
          heading: "Where is my order?",
          body: "Sign in and open My Orders to see the live status of every manifestation — from Transcending (processing) through Vibrating (shipped) to Manifested (delivered). Each order page shows the items, totals, and shipping address.",
        },
        {
          heading: "Payments & refunds",
          body: "Payments are handled securely by Razorpay. If a payment was deducted but your order doesn't appear within a few minutes, it will be reconciled automatically — if it still doesn't show, email us with your payment reference and we'll resolve it.",
        },
        {
          heading: "Account help",
          body: "Forgot your password? Use the 'Forgot password?' link on the sign-in page to receive a reset link valid for one hour. You can change your name, password, and email preferences anytime in Settings.",
        },
        {
          heading: "Returns",
          body: "To start a return within 30 days of delivery, email support@akaal.com with your order number. We'll send you the return instructions and process your refund after the item is received.",
        },
        {
          heading: "Contact us",
          body: "For anything else, write to support@akaal.com — we respond within one business day.",
        },
      ]}
    />
  );
}
