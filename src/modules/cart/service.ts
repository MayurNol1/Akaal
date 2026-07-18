import { CartRepository } from "./repository";
import {
  AddToCartInput,
  RemoveCartItemInput,
  UpdateCartItemInput,
} from "./validation";

async function getOrCreateCart(userId: string) {
  const existing = await CartRepository.findByUserId(userId);
  if (existing) return JSON.parse(JSON.stringify(existing));
  const created = await CartRepository.createCart(userId);
  return JSON.parse(JSON.stringify(created));
}

async function getCart(userId: string) {
  const cart = await CartRepository.findByUserId(userId);
  return cart ? JSON.parse(JSON.stringify(cart)) : null;
}

async function addToCart(userId: string, input: AddToCartInput) {
  const product = await CartRepository.findProduct(input.productId);
  if (!product || !product.isActive) {
    throw new Error("This artifact is no longer available");
  }

  const cart = await getOrCreateCart(userId);
  const existingItem = await CartRepository.findItem(cart.id, input.productId);
  const requestedTotal = (existingItem?.quantity ?? 0) + input.quantity;

  if (product.stock <= 0) {
    throw new Error("This artifact is out of stock");
  }
  if (requestedTotal > product.stock) {
    throw new Error(`Only ${product.stock} left in stock`);
  }

  if (existingItem) {
    return CartRepository.updateItem(existingItem.id, requestedTotal);
  }

  return CartRepository.createItem(cart.id, input.productId, input.quantity);
}

async function updateCartItem(userId: string, input: UpdateCartItemInput) {
  const cart = await getCart(userId);
  if (!cart) throw new Error("Cart not found");

  const item = await CartRepository.findItem(cart.id, input.productId);
  if (!item) throw new Error("Item not found in cart");

  return CartRepository.updateItem(item.id, input.quantity);
}

async function removeCartItem(userId: string, input: RemoveCartItemInput) {
  const cart = await getCart(userId);
  if (!cart) return;

  const item = await CartRepository.findItem(cart.id, input.productId);
  if (!item) return;

  await CartRepository.deleteItem(item.id);
}

export const CartService = {
  getOrCreateCart,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};

// Also export individual for existing API routes if needed, 
// but better to update them too.
export {
  getOrCreateCart,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
