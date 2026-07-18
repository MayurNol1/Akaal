import { LegalPage } from "@/components/layout/legal-page";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of"
      titleAccent="Service"
      intro="By using Akaal you agree to these terms. They exist to keep the sanctuary fair and safe for every Disciple."
      sections={[
        {
          heading: "Accounts",
          body: "You are responsible for keeping your credentials confidential and for all activity under your account. We may restrict accounts that abuse the platform, attempt fraud, or violate these terms.",
        },
        {
          heading: "Orders & pricing",
          body: "All prices are in Indian Rupees and include the displayed GST. An order is confirmed only after successful payment verification. Displayed totals — subtotal, coupon discounts, shipping, and GST — are exactly what you are charged.",
        },
        {
          heading: "Shipping",
          body: "Orders above ₹999 (after discounts) ship free; otherwise a ₹99 shipping fee applies. Estimated delivery is 4–7 business days within India.",
        },
        {
          heading: "Returns & refunds",
          body: "We offer 30-day returns on unused items in their original packaging. Refunds are issued to the original payment method after inspection. Energised or consecrated items that have been opened may not be returnable — see the product page for specifics.",
        },
        {
          heading: "Coupons & offers",
          body: "Coupon codes apply to the product subtotal, are subject to expiry and deactivation, and cannot be exchanged for cash. One coupon per order.",
        },
        {
          heading: "Content & reviews",
          body: "Reviews you submit must reflect your genuine experience. We may remove content that is offensive, fraudulent, or unrelated to the product.",
        },
      ]}
    />
  );
}
