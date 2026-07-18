import prisma from "@/lib/prisma";

export class CouponRepository {
  static async findByCode(code: string) {
    return prisma.coupon.findUnique({
      where: { code },
    });
  }
}
