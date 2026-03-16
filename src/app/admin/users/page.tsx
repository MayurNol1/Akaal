import prisma from "@/lib/prisma";
import { AdminUsersClient } from "@/components/admin/users-client";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <AdminUsersClient initialUsers={JSON.parse(JSON.stringify(users))} />;
}
