import { LegalPage } from "@/components/layout/legal-page";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy"
      titleAccent="Policy"
      intro="Your trust is sacred to us. This policy explains what information Akaal collects, why we collect it, and how it is protected."
      sections={[
        {
          heading: "What we collect",
          body: "When you create an account we store your name, email address, and a securely hashed password. When you place an order we additionally store your shipping address, order contents, and payment references from Razorpay (we never see or store your card or UPI details). If you subscribe to the newsletter we store the email address you provide.",
        },
        {
          heading: "How we use it",
          body: "Your information is used solely to operate the store: fulfilling orders, sending order confirmations and password-reset emails, and personalising your wishlist and dashboard. We do not sell or share your personal data with third parties for advertising.",
        },
        {
          heading: "Payments",
          body: "All payments are processed by Razorpay over encrypted connections. Payment verification uses cryptographic signatures; Akaal only records the order and payment identifiers needed to trace your transaction.",
        },
        {
          heading: "Your choices",
          body: "You can update your name, preferences, and password anytime from Settings, and turn off marketing-style emails with the Email Notifications toggle. To delete your account and associated data, contact support@akaal.com.",
        },
        {
          heading: "Cookies & sessions",
          body: "We use a session cookie to keep you signed in. Guest wishlists are stored locally in your own browser and migrate to your account when you sign in.",
        },
      ]}
    />
  );
}
