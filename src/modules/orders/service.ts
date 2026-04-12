import { OrderRepository } from "./repository";
import { OrderStatus } from "@prisma/client";

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
