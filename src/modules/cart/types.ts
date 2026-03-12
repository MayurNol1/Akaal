import type { Cart, CartItem, Product } from "@prisma/client";

export type CartWithItems = Cart & {
  items: (CartItem & { product: Product })[];
};

