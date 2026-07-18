import { WishlistRepository } from "./repository";

export class WishlistService {
  static async getProductIds(userId: string) {
    return WishlistRepository.findProductIdsByUser(userId);
  }

  /** Returns the new liked state. */
  static async toggle(userId: string, productId: string): Promise<boolean> {
    const liked = await WishlistRepository.exists(userId, productId);
    if (liked) {
      await WishlistRepository.remove(userId, productId);
      return false;
    }
    try {
      await WishlistRepository.add(userId, productId);
      return true;
    } catch (error) {
      // P2003 = product doesn't exist; P2002 = raced duplicate — both benign
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: string }).code === "P2002"
      ) {
        return true;
      }
      throw error;
    }
  }

  /** Merge guest (localStorage) likes into the account. */
  static async merge(userId: string, productIds: string[]) {
    await WishlistRepository.addMany(userId, productIds);
    return WishlistRepository.findProductIdsByUser(userId);
  }

  static async count(userId: string) {
    return WishlistRepository.count(userId);
  }
}
