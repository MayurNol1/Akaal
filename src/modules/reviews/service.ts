import { serializeData } from "@/lib/serialization";
import { ReviewRepository } from "./repository";
import { SubmitReviewInput } from "./validation";

export class ReviewService {
  static async getProductReviews(productId: string) {
    const [reviews, aggregate] = await Promise.all([
      ReviewRepository.findByProduct(productId),
      ReviewRepository.aggregateForProduct(productId),
    ]);
    return serializeData({ reviews, aggregate });
  }

  /** Map of productId → { average, count } for listing pages. */
  static async getAggregates(productIds: string[]) {
    const rows = await ReviewRepository.aggregateForProducts(productIds);
    const map: Record<string, { average: number; count: number }> = {};
    for (const row of rows) {
      map[row.productId] = {
        average: row._avg.rating ?? 0,
        count: row._count.rating,
      };
    }
    return map;
  }

  static async submitReview(userId: string, productId: string, input: SubmitReviewInput) {
    const isVerifiedPurchase = await ReviewRepository.hasPurchased(userId, productId);
    const review = await ReviewRepository.upsert(userId, productId, {
      rating: input.rating,
      title: input.title,
      body: input.body,
      isVerifiedPurchase,
    });
    return serializeData(review);
  }
}
