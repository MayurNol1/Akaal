import { OrderRepository } from "./repository";
import { OrderStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { sendMail, emailLayout } from "@/lib/mail";

export async function getOrdersForUser(userId: string) {
  return OrderRepository.findManyByUserId(userId);
}

export async function getOrderForUser(userId: string, orderId: string) {
  return OrderRepository.findByIdAndUserId(orderId, userId);
}

export async function getAllOrders() {
  return OrderRepository.findAll();
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return OrderRepository.updateStatus(orderId, status);
}

/**
 * Sends the order confirmation email, respecting the user's
 * emailNotifications preference. Never throws — a mail failure must not
 * break checkout, so callers can fire-and-forget with `void`.
 */
export async function sendOrderConfirmationEmail(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { name: true, email: true, emailNotifications: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    });
    if (!order?.user.email || !order.user.emailNotifications) return;

    const itemRows = order.items
      .map(
        (item) =>
          `<tr>
             <td style="padding:8px 0;font-size:13px;color:#c8c3b2;">${item.product.name} × ${item.quantity}</td>
             <td style="padding:8px 0;font-size:13px;color:#f0ede6;text-align:right;">₹${(Number(item.price) * item.quantity).toLocaleString("en-IN")}</td>
           </tr>`
      )
      .join("");

    await sendMail({
      to: order.user.email,
      subject: `Your manifestation is confirmed — Order #AK-${order.id.slice(-8).toUpperCase()}`,
      html: emailLayout(
        "Order Confirmed 🙏",
        `<p style="font-size:14px;line-height:1.7;color:#c8c3b2;">Namaste ${order.user.name ?? "Seeker"}, your sacred artifacts are being prepared with intention.</p>
         <table style="width:100%;border-collapse:collapse;margin:20px 0;border-top:1px solid rgba(212,169,74,0.2);border-bottom:1px solid rgba(212,169,74,0.2);">${itemRows}</table>
         <p style="font-size:15px;color:#f0ede6;text-align:right;margin:0;">Total Paid: <strong style="color:#d4a94a;">₹${Number(order.total).toLocaleString("en-IN")}</strong></p>
         <p style="font-size:12px;color:#6b6857;margin-top:20px;">Track your manifestation anytime from your orders page.</p>`
      ),
    });
  } catch (error) {
    console.error("sendOrderConfirmationEmail failed:", error);
  }
}
