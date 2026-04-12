import prisma from "@/lib/prisma";
import { RegisterInput } from "./validation";
import { Role } from "@prisma/client";

export class AuthRepository {
  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async createUser(data: RegisterInput & { password: string; role?: Role }) {
    return prisma.user.create({
      data: {
        ...data,
        role: data.role || Role.USER,
      },
    });
  }
}
