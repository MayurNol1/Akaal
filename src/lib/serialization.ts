/**
 * Serialize Prisma objects with Decimal types to plain JSON
 * This is a workaround for Prisma Decimal serialization in API responses
 */
export function serializeData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
