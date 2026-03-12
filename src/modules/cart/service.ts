import prisma from "@/lib/prisma";
import {
  AddToCartInput,
  RemoveCartItemInput,
  UpdateCartItemInput,
} from "./validation";

export async function getOrCreateCart(userId: string) {
  const existing = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (existing) return existing;

  return prisma.cart.create({
    data: { userId },
    include: { items: { include: { product: true } } },
  });
}

export async function getCart(userId: string) {
  return prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });
}

export async function addToCart(userId: string, input: AddToCartInput) {
  const cart = await getOrCreateCart(userId);

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: input.productId,
      },
    },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + input.quantity },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: input.productId,
      quantity: input.quantity,
    },
  });
}

export async function updateCartItem(userId: string, input: UpdateCartItemInput) {
  const cart = await getCart(userId);
  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: input.productId,
      },
    },
  });

  if (!item) {
    throw new Error("Item not found in cart");
  }

  return prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: input.quantity },
  });
}

export async function removeCartItem(userId: string, input: RemoveCartItemInput) {
  const cart = await getCart(userId);
  if (!cart) return;

  const item = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: input.productId,
      },
    },
  });

  if (!item) return;

  await prisma.cartItem.delete({
    where: { id: item.id },
  });
}

