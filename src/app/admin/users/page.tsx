import prisma from "@/lib/prisma";
import { AdminUsersClient } from "@/components/admin/users-client";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  // Select only what the UI needs — never ship password hashes to the client
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isDisabled: true,
      createdAt: true,
    },
  });

  return <AdminUsersClient initialUsers={JSON.parse(JSON.stringify(users))} />;
}
